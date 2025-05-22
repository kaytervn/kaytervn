import useForm from "../../hooks/useForm";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { setStorageData } from "../../services/storages";
import useApi from "../../hooks/useApi";
import { useState } from "react";
import {
  ActionSection,
  BasicCardForm,
  HrefLink,
  ImageBase64,
} from "../../components/form/FormCard";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import secretImg from "../../assets/secret.png";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  LOCAL_STORAGE,
  TOAST,
} from "../../types/constant";
import { InputField2 } from "../../components/form/InputTextField";
import { LoadingDialog } from "../../components/form/Dialog";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import { encryptClientData } from "../../services/encryption/clientEncryption";
import { ENCRYPT_FIELDS } from "../../services/encryption/encryptFields";
import useModal from "../../hooks/useModal";
import InputMasterKey from "./InputMasterKey";
import { USER_CONFIG } from "../../components/config/PageConfigDetails";
import useDocTitle from "../../hooks/useDocTitle";

const Login = () => {
  useDocTitle();
  const { setToast } = useGlobalContext();
  const navigate = useNavigate();
  const { user, loading } = useApi();
  const [isMfa, setIsMfa] = useState(false);
  const [qrUrl, setQrUrl] = useState<any>(null);
  const {
    isModalVisible: inputKeyFormVisible,
    showModal: showInputKeyForm,
    hideModal: hideInputKeyForm,
    formConfig: inputKeyFormConfig,
  } = useModal();

  const handleInputSystemKey = () => {
    showInputKeyForm({
      hideModal: hideInputKeyForm,
    });
  };

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!isMfa) {
      if (!form.username.trim()) {
        newErrors.username = "Invalid username";
      }
      if (!form.password) {
        newErrors.password = "Invalid password";
      }
    } else {
      if (!form.totp) {
        newErrors.totp = "Invalid OTP";
      }
    }
    return newErrors;
  };

  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    { username: "", password: "", totp: "" },
    validate
  );

  const handleSubmitLogin = async () => {
    if (isValidForm()) {
      const verify = await user.verifyCreditial(
        encryptClientData(
          {
            username: form.username,
            password: form.password,
          },
          ENCRYPT_FIELDS.LOGIN_FORM
        )
      );
      if (!verify?.result) {
        setToast(verify?.message || BASIC_MESSAGES.LOG_IN_FAILED, TOAST.ERROR);
        return;
      }
      const data = verify.data;
      setIsMfa(true);
      if (data?.qrUrl) {
        setQrUrl(data.qrUrl);
      }
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  const handleSubmitTOTP = async () => {
    if (isValidForm()) {
      const res = await user.login(
        encryptClientData(
          {
            username: form.username,
            password: form.password,
            totp: form.totp,
          },
          ENCRYPT_FIELDS.LOGIN_FORM
        )
      );
      const accessToken = res?.data?.accessToken;
      if (accessToken) {
        setToast(BASIC_MESSAGES.LOGGED_IN, TOAST.SUCCESS);
        setStorageData(LOCAL_STORAGE.ACCESS_TOKEN, accessToken);
        window.location.href = PAGE_CONFIG.PLATFORM.path;
      } else {
        setToast(res?.message || BASIC_MESSAGES.LOG_IN_FAILED, TOAST.ERROR);
      }
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  const handleCancelSubmitOTP = () => {
    setIsMfa(false);
    setQrUrl(null);
    resetForm();
  };

  return (
    <>
      <LoadingDialog isVisible={loading} />
      <InputMasterKey
        isVisible={inputKeyFormVisible}
        formConfig={inputKeyFormConfig}
      />
      {!isMfa ? (
        <BasicCardForm title={"MSA Project"} imgSrc={secretImg}>
          <div className="flex items-center justify-center">
            <div className="space-y-4 w-full">
              <InputField2
                title="Username"
                isRequired
                placeholder="Enter username"
                value={form.username}
                onChangeText={(value: any) => handleChange("username", value)}
                error={errors.username}
              />
              <InputField2
                title="Password"
                isRequired
                placeholder="Enter password"
                value={form.password}
                onChangeText={(value: any) => handleChange("password", value)}
                error={errors.password}
                type="password"
              />
              <div className="flex flex-col space-y-2 text-sm text-blue-600">
                <HrefLink
                  label={"Input system key"}
                  onClick={handleInputSystemKey}
                />
                <HrefLink
                  label={"Reset 2FA"}
                  onClick={() => navigate(USER_CONFIG.REQUEST_RESET_MFA.path)}
                />
                <HrefLink
                  label={"Forgot password?"}
                  onClick={() => navigate(USER_CONFIG.FORGOT_PASSWORD.path)}
                />
              </div>
              <div className="flex justify-between gap-2">
                <button
                  type="button"
                  className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={() => navigate("/")}
                >
                  Home
                </button>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleSubmitLogin}
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </BasicCardForm>
      ) : (
        <BasicCardForm title={BUTTON_TEXT.TWO_FACTOR}>
          <div className="space-y-4">
            {qrUrl && <ImageBase64 imgString={qrUrl} />}
            <InputField2
              title="OTP code"
              isRequired
              placeholder="Enter OTP code"
              value={form.totp}
              onChangeText={(value: any) => handleChange("totp", value)}
              error={errors.totp}
            />
            <ActionSection
              children={
                <>
                  <CancelButton onClick={handleCancelSubmitOTP} />
                  <SubmitButton
                    text={BUTTON_TEXT.SUBMIT}
                    color="royalblue"
                    onClick={handleSubmitTOTP}
                  />
                </>
              }
            />
          </div>
        </BasicCardForm>
      )}
    </>
  );
};

export default Login;
