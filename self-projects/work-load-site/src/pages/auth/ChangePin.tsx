/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../types/constant";
import { ActionSection, ModalForm } from "../../components/form/FormCard";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import useForm from "../../hooks/useForm";
import useApi from "../../hooks/useApi";
import { LoadingDialog } from "../../components/form/Dialog";
import { ENCRYPT_FIELDS } from "../../services/encryption/encryptFields";
import { InputField2 } from "../../components/form/InputTextField";
import { encryptClientData } from "../../services/encryption/clientEncryption";

const ChangePin = ({ isVisible, formConfig }: any) => {
  const { user, loading } = useApi();
  const { setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.oldPin.trim()) {
      newErrors.oldPin = "Invalid PIN";
    }
    if (!form.newPin.trim()) {
      newErrors.newPin = "Invalid PIN";
    }
    if (!form.currentPassword.trim()) {
      newErrors.currentPassword = "Invalid password";
    }
    if (form.newPin !== form.confirmPin) {
      newErrors.confirmPin = "PIN does not match";
    }
    return newErrors;
  };

  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    { oldPin: "", newPin: "", confirmPin: "", currentPassword: "" },
    validate
  );

  useEffect(() => {
    resetForm();
  }, [isVisible]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await user.changePin(
        encryptClientData(form, ENCRYPT_FIELDS.CHANGE_PIN_FORM)
      );
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
              title="Current PIN"
              placeholder="Enter current PIN"
              value={form.oldPin}
              onChangeText={(value: any) => handleChange("oldPin", value)}
              type="password"
              error={errors.oldPin}
            />
            <InputField2
              isRequired={true}
              title="New PIN"
              placeholder="Enter new PIN"
              value={form.newPin}
              onChangeText={(value: any) => handleChange("newPin", value)}
              type="password"
              error={errors.newPin}
            />
            <InputField2
              isRequired={true}
              title="Confirm PIN"
              placeholder="Enter confirm PIN"
              value={form.confirmPin}
              onChangeText={(value: any) => handleChange("confirmPin", value)}
              type="password"
              error={errors.confirmPin}
            />
            <InputField2
              isRequired={true}
              title="Current password"
              placeholder="Enter current password"
              value={form.currentPassword}
              onChangeText={(value: any) =>
                handleChange("currentPassword", value)
              }
              type="password"
              error={errors.currentPassword}
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

export default ChangePin;
