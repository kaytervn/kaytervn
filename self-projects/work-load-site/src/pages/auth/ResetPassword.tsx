/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useApi from "../../hooks/useApi";
import useModal from "../../hooks/useModal";
import { useEffect } from "react";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
  VALID_PATTERN,
} from "../../types/constant";
import useForm from "../../hooks/useForm";
import { AUTH_CONFIG } from "../../components/config/PageConfigDetails";
import {
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/form/Dialog";
import {
  ActionSection,
  BasicCardForm,
  HrefLink,
} from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import { CancelButton, SubmitButton } from "../../components/form/Button";

const ResetPassword = () => {
  const { setToast } = useGlobalContext();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useApi();
  const { isModalVisible, showModal, formConfig } = useModal();

  useEffect(() => {
    if (!state?.userId) {
      navigate(AUTH_CONFIG.FORGOT_PASSWORD.path);
    }
  }, [state]);

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.otp.trim()) {
      newErrors.otp = "Invalid OTP";
    }
    if (!VALID_PATTERN.PASSWORD.test(form.newPassword)) {
      newErrors.newPassword = "Invalid password";
    }
    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    { otp: "", newPassword: "", confirmPassword: "" },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await user.resetPassword({ userId: state.userId, ...form });
      if (res.result) {
        setToast(BASIC_MESSAGES.SUCCESS, TOAST.SUCCESS);
        showModal({
          title: "Success",
          message: "Reset password successfully",
          color: "mediumseagreen",
          confirmText: BUTTON_TEXT.LOGIN,
          onConfirm: () => navigate(AUTH_CONFIG.LOGIN.path),
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
      <ConfirmationDialog isVisible={isModalVisible} formConfig={formConfig} />
      <BasicCardForm title="Reset password">
        <div className="space-y-4">
          <InputField2
            title="OTP"
            isRequired={true}
            placeholder="Enter OTP"
            value={form.otp}
            onChangeText={(value: any) => handleChange("otp", value)}
            error={errors.otp}
          />
          <InputField2
            isRequired={true}
            title="New password"
            placeholder="Enter new password"
            value={form.newPassword}
            onChangeText={(value: any) => handleChange("newPassword", value)}
            type="password"
            error={errors.newPassword}
          />
          <InputField2
            isRequired={true}
            title="Confirm password"
            placeholder="Enter confirm password"
            value={form.confirmPassword}
            onChangeText={(value: any) =>
              handleChange("confirmPassword", value)
            }
            type="password"
            error={errors.confirmPassword}
          />
          <HrefLink
            label={"Back to login page"}
            onClick={() => navigate(AUTH_CONFIG.LOGIN.path)}
          />
          <ActionSection
            children={
              <>
                <CancelButton
                  onClick={() => navigate(AUTH_CONFIG.FORGOT_PASSWORD.path)}
                />
                <SubmitButton
                  text={BUTTON_TEXT.SUBMIT}
                  onClick={handleSubmit}
                />
              </>
            }
          />
        </div>
      </BasicCardForm>
    </>
  );
};

export default ResetPassword;
