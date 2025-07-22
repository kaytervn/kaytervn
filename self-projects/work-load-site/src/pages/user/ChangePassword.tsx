/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from "react";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../types/constant";
import { ActionSection, ModalForm } from "../../components/form/FormCard";
import { LoadingDialog } from "../../components/form/Dialog";
import { InputField2 } from "../../components/form/InputTextField";
import { CancelButton, SubmitButton } from "../../components/form/Button";

const ChangePassword = ({ isVisible, formConfig }: any) => {
  const { user, loading } = useApi();
  const { setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.oldPassword.trim()) {
      newErrors.oldPassword = "Invalid password";
    }
    if (!form.newPassword.trim()) {
      newErrors.newPassword = "Invalid password";
    }
    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Password does not match";
    }
    return newErrors;
  };

  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    { oldPassword: "", newPassword: "", confirmPassword: "" },
    validate
  );

  useEffect(() => {
    resetForm();
  }, [isVisible]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await user.changePassword(form);
      if (res.result) {
        formConfig?.hideModal();
        setToast(BASIC_MESSAGES.SUCCESS, TOAST.SUCCESS);
      } else {
        setToast(res.message, TOAST.ERROR);
      }
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  if (!isVisible) return null;
  return (
    <ModalForm
      isVisible={isVisible}
      onClose={formConfig?.hideModal}
      title={formConfig?.title}
      children={
        <>
          <LoadingDialog isVisible={loading} />
          <div className="flex flex-col space-y-4">
            <InputField2
              isRequired={true}
              title="Current password"
              placeholder="Enter current password"
              value={form.oldPassword}
              onChangeText={(value: any) => handleChange("oldPassword", value)}
              type="password"
              error={errors.oldPassword}
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
            <ActionSection
              children={
                <>
                  <CancelButton onClick={formConfig.hideModal} />
                  <SubmitButton
                    text={BUTTON_TEXT.UPDATE}
                    onClick={handleSubmit}
                  />
                </>
              }
            />
          </div>
        </>
      }
    />
  );
};

export default ChangePassword;
