import {
  ActionSection,
  ImageBase64,
  ModalForm,
} from "../../components/form/FormCard";
import useForm from "../../hooks/useForm";
import { useEffect, useState } from "react";
import { InputField } from "../../components/form/InputField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  GRANT_TYPE,
  LOCAL_STORAGE,
  TOAST,
  VALID_PATTERN,
} from "../../services/constant";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useApi from "../../hooks/useApi";
import { LoadingDialog } from "../../components/page/Dialog";
import { setStorageData } from "../../services/storages";

const ChangeLocation = ({ isVisible, formConfig }: any) => {
  const { profile, setToast } = useGlobalContext();
  const [isMfa, setIsMfa] = useState(false);
  const [qrUrl, setQrUrl] = useState<any>(null);
  const [formTitle, setFormTitle] = useState("Chuyển công ty");
  const { auth, loading } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (isMfa) {
      if (!form.totp) {
        newErrors.totp = "Mã OTP không được bỏ trống";
      }
    } else {
      if (!form.tenantId.trim()) {
        newErrors.tenantId = "Mã công ty không được bỏ trống";
      }
      if (!VALID_PATTERN.PASSWORD.test(form.password)) {
        newErrors.password = "Mật khẩu không hợp lệ";
      }
    }
    return newErrors;
  };

  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    { password: "", totp: "", tenantId: "" },
    validate
  );

  useEffect(() => {
    resetForm();
  }, [isVisible]);

  const handleCallLoginCustomer = async () => {
    const res = await auth.login({
      username: profile.username,
      password: form.password,
      tenantId: form.tenantId,
      grant_type: GRANT_TYPE.CUSTOMER,
    });
    if (res?.access_token) {
      setToast(res?.message || BASIC_MESSAGES.LOGGED_IN, TOAST.SUCCESS);
      setStorageData(LOCAL_STORAGE.ACCESS_TOKEN, res?.access_token);
      window.location.href = "/";
    } else {
      setToast(BASIC_MESSAGES.LOG_IN_FAILED, TOAST.ERROR);
    }
  };

  const handleSubmitLogin = async () => {
    if (isValidForm()) {
      const verify = await auth.verifyCreditial({
        username: profile.username,
        password: form.password,
        tenantId: form.tenantId,
      });
      if (!verify?.result) {
        setToast(verify?.message || BASIC_MESSAGES.LOG_IN_FAILED, TOAST.ERROR);
        return;
      }
      const data = verify.data;
      if (!data.isMfaEnable) {
        await handleCallLoginCustomer();
      } else {
        setIsMfa(true);
        setFormTitle(BUTTON_TEXT.TWO_FACTOR);
        if (data.qrUrl) {
          setQrUrl(data.qrUrl);
        }
      }
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  const handleSubmitTOTP = async () => {
    if (isValidForm()) {
      const res = await auth.login({
        username: profile.username,
        password: form.password,
        tenantId: form.tenantId,
        totp: form.totp,
        grant_type: GRANT_TYPE.CUSTOMER,
      });
      if (res?.access_token) {
        setToast(BASIC_MESSAGES.LOGGED_IN, TOAST.SUCCESS);
        setStorageData(LOCAL_STORAGE.ACCESS_TOKEN, res?.access_token);
        window.location.href = "/";
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

  if (!isVisible) return null;
  return (
    <>
      <LoadingDialog isVisible={loading} />
      <ModalForm
        isVisible={isVisible}
        onClose={formConfig.hideModal}
        title={formTitle}
        children={
          <>
            {!isMfa ? (
              <div className="flex flex-col space-y-4">
                <InputField
                  title="Mã công ty"
                  isRequired
                  placeholder="Nhập mã công ty"
                  value={form.tenantId}
                  onChangeText={(value: any) => handleChange("tenantId", value)}
                  error={errors.tenantId}
                />
                <InputField
                  title="Mật khẩu"
                  type="password"
                  isRequired={true}
                  placeholder="Nhập mật khẩu"
                  value={form?.password}
                  onChangeText={(value: any) => handleChange("password", value)}
                  error={errors?.password}
                />
                <ActionSection
                  children={
                    <>
                      <CancelButton onClick={formConfig.hideModal} />
                      <SubmitButton
                        text={BUTTON_TEXT.CONTINUE}
                        onClick={handleSubmitLogin}
                      />
                    </>
                  }
                />
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {qrUrl && <ImageBase64 imgString={qrUrl} />}
                <InputField
                  title="Mã OTP"
                  isRequired
                  placeholder="Nhập mã OTP"
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
            )}
          </>
        }
      />
    </>
  );
};

export default ChangeLocation;
