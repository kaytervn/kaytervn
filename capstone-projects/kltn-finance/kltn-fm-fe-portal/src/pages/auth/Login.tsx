import useForm from "../../hooks/useForm";
import { InputField } from "../../components/form/InputField";
import {
  Button,
  CancelButton,
  SubmitButton,
} from "../../components/form/Button";
import { LoadingDialog } from "../../components/page/Dialog";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  GRANT_TYPE,
  GRANT_TYPE_MAP,
  LOCAL_STORAGE,
  TOAST,
} from "../../services/constant";
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
import { StaticSelectField } from "../../components/form/SelectField";
import welcomeImg from "../../assets/welcome.png";

const Login = () => {
  const { setToast } = useGlobalContext();
  const navigate = useNavigate();
  const { auth, loading } = useApi();
  const [isMfa, setIsMfa] = useState(false);
  const [qrUrl, setQrUrl] = useState<any>(null);

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!isMfa) {
      if (!form.grantType) {
        newErrors.grantType = "Loại tài khoản không hợp lệ";
      }
      if (!form.tenantId.trim()) {
        newErrors.tenantId = "Mã công ty không được bỏ trống";
      }
      if (!form.username.trim()) {
        newErrors.username = "Tài khoản không được bỏ trống";
      }
      if (!form.password) {
        newErrors.password = "Mật khẩu không được bỏ trống";
      }
    } else {
      if (!form.totp) {
        newErrors.totp = "Mã OTP không được bỏ trống";
      }
    }
    return newErrors;
  };

  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    { username: "", password: "", totp: "", grantType: "", tenantId: "" },
    validate
  );

  const handleCallLoginCustomer = async () => {
    const res = await auth.login({
      username: form.username,
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
      if (GRANT_TYPE.CUSTOMER === form.grantType) {
        const verify = await auth.verifyCreditial({
          username: form.username,
          password: form.password,
          tenantId: form.tenantId,
        });
        if (!verify?.result) {
          setToast(
            verify?.message || BASIC_MESSAGES.LOG_IN_FAILED,
            TOAST.ERROR
          );
          return;
        }
        const data = verify.data;
        if (!data.isMfaEnable) {
          await handleCallLoginCustomer();
        } else {
          setIsMfa(true);
          if (data.qrUrl) {
            setQrUrl(data.qrUrl);
          }
        }
      } else {
        const res = await auth.loginEmployee({
          username: form.username,
          password: form.password,
          tenantId: form.tenantId,
          grant_type: GRANT_TYPE.EMPLOYEE,
        });
        if (res?.access_token) {
          setToast(BASIC_MESSAGES.LOGGED_IN, TOAST.SUCCESS);
          setStorageData(LOCAL_STORAGE.ACCESS_TOKEN, res?.access_token);
          window.location.href = "/";
        } else {
          setToast(res?.message || BASIC_MESSAGES.LOG_IN_FAILED, TOAST.ERROR);
        }
      }
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  const handleSubmitTOTP = async () => {
    if (isValidForm()) {
      const res = await auth.login({
        username: form.username,
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

  return (
    <>
      <LoadingDialog isVisible={loading} />
      {!isMfa ? (
        <BasicCardForm
          title={"Chào mừng bạn đến với hệ thống"}
          imgSrc={welcomeImg}
        >
          <div className="space-y-4">
            <StaticSelectField
              title="Loại tài khoản"
              isRequired={true}
              placeholder="Chọn loại tài khoản"
              dataMap={GRANT_TYPE_MAP}
              value={form.grantType}
              onChange={(value: any) => handleChange("grantType", value)}
              error={errors.grantType}
            />
            <InputField
              title="Tên đăng nhập"
              isRequired
              placeholder="Nhập tên đăng nhập"
              value={form.username}
              onChangeText={(value: any) => handleChange("username", value)}
              error={errors.username}
            />
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
              isRequired
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChangeText={(value: any) => handleChange("password", value)}
              error={errors.password}
              type="password"
            />
            <HrefLink
              label={BUTTON_TEXT.LOGIN_QR}
              onClick={() => navigate("/login-qr")}
            />
            <HrefLink
              label={"Quên mật khẩu?"}
              onClick={() => navigate("/forgot-password")}
            />
            <Button
              title={BUTTON_TEXT.LOGIN}
              color="royalblue"
              onPress={handleSubmitLogin}
            />
          </div>
        </BasicCardForm>
      ) : (
        <BasicCardForm title={BUTTON_TEXT.TWO_FACTOR}>
          <div className="space-y-4">
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
        </BasicCardForm>
      )}
    </>
  );
};

export default Login;
