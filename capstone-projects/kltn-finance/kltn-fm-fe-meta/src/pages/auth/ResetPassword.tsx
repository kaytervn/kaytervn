import useForm from "../../hooks/useForm";
import { InputField } from "../../components/form/InputField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import {
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/page/Dialog";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
  VALID_PATTERN,
} from "../../services/constant";
import useApi from "../../hooks/useApi";
import {
  ActionSection,
  BasicCardForm,
  HrefLink,
} from "../../components/form/FormCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useModal from "../../hooks/useModal";
import { useGlobalContext } from "../../components/GlobalProvider";

const ResetPassword = () => {
  const { setToast } = useGlobalContext();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { auth, loading } = useApi();
  const { isModalVisible, showModal, formConfig } = useModal();

  useEffect(() => {
    if (!state?.userId) {
      navigate("/forgot-password");
    }
  }, [state]);

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.otp.trim()) {
      newErrors.otp = "Mã OTP không hợp lệ";
    }
    if (!VALID_PATTERN.PASSWORD.test(form.newPassword)) {
      newErrors.newPassword = "Mật khẩu không hợp lệ";
    }
    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    { otp: "", newPassword: "", confirmPassword: "" },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await auth.resetPassword({ userId: state.userId, ...form });
      if (res.result) {
        setToast(BASIC_MESSAGES.SUCCESS, TOAST.SUCCESS);
        showModal({
          title: "Thành công",
          message: "Đặt lại mật khẩu thành công",
          color: "mediumseagreen",
          confirmText: BUTTON_TEXT.LOGIN,
          onConfirm: () => navigate("/"),
        });
      } else {
        setToast(res.message || BASIC_MESSAGES.FAILED, TOAST.ERROR);
      }
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  return (
    <>
      <LoadingDialog isVisible={loading} />
      <BasicCardForm title="Đặt lại mật khẩu">
        <div className="space-y-4">
          <InputField
            title="Mã xác thực OTP"
            isRequired={true}
            placeholder="Nhập mã xác thực OTP"
            value={form.otp}
            onChangeText={(value: any) => handleChange("otp", value)}
            error={errors.otp}
          />
          <InputField
            isRequired={true}
            title="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới"
            value={form.newPassword}
            onChangeText={(value: any) => handleChange("newPassword", value)}
            type="password"
            error={errors.newPassword}
          />
          <InputField
            isRequired={true}
            title="Mật khẩu xác nhận"
            placeholder="Nhập mật khẩu xác nhận"
            value={form.confirmPassword}
            onChangeText={(value: any) =>
              handleChange("confirmPassword", value)
            }
            type="password"
            error={errors.confirmPassword}
          />
          <HrefLink label={"Quay về đăng nhập"} onClick={() => navigate("/")} />
          <ActionSection
            children={
              <>
                <CancelButton onClick={() => navigate("/forgot-password")} />
                <SubmitButton
                  text={BUTTON_TEXT.SUBMIT}
                  onClick={handleSubmit}
                />
              </>
            }
          />
        </div>
      </BasicCardForm>
      <ConfirmationDialog isVisible={isModalVisible} formConfig={formConfig} />
    </>
  );
};

export default ResetPassword;
