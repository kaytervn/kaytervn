/* eslint-disable react-hooks/exhaustive-deps */
import useForm from "../../hooks/useForm";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import useApi from "../../hooks/useApi";
import {
  ActionSection,
  BasicCardForm,
  HrefLink,
} from "../../components/form/FormCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useModal from "../../hooks/useModal";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { encryptClientData } from "../../services/encryption/clientEncryption";
import { ENCRYPT_FIELDS } from "../../services/encryption/encryptFields";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../types/constant";
import {
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/form/Dialog";
import { InputField2 } from "../../components/form/InputTextField";
import { USER_CONFIG } from "../../components/config/PageConfigDetails";
import useDocTitle from "../../hooks/useDocTitle";

const ResetPassword = () => {
  useDocTitle();
  const { setToast } = useGlobalContext();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useApi();
  const { isModalVisible, showModal, formConfig } = useModal();

  useEffect(() => {
    if (!state?.userId) {
      navigate(USER_CONFIG.FORGOT_PASSWORD.path);
    }
  }, [state]);

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.otp.trim()) {
      newErrors.otp = "Invalid OTP";
    }
    if (!form.newPassword.trim()) {
      newErrors.newPassword = "Invalid password";
    }
    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Password not match";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    { otp: "", newPassword: "", confirmPassword: "" },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await user.resetPassword(
        encryptClientData(
          { userId: state.userId, ...form },
          ENCRYPT_FIELDS.RESET_PASSWORD_FORM
        )
      );
      if (res.result) {
        setToast(BASIC_MESSAGES.SUCCESS, TOAST.SUCCESS);
        showModal({
          title: "Success",
          message: "Reset password successfully",
          color: "mediumseagreen",
          confirmText: BUTTON_TEXT.LOGIN,
          onConfirm: () => navigate(USER_CONFIG.LOGIN.path),
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
      <BasicCardForm title={USER_CONFIG.RESET_PASSWORD.label}>
        <div className="space-y-4">
          <InputField2
            title="OTP code"
            isRequired={true}
            placeholder="Enter OTP code"
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
            label={"Back to Login page"}
            onClick={() => navigate(USER_CONFIG.LOGIN.path)}
          />
          <ActionSection
            children={
              <>
                <CancelButton
                  onClick={() => navigate(USER_CONFIG.FORGOT_PASSWORD.path)}
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
