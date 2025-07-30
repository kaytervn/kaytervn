/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useGlobalContext } from "../../../components/config/GlobalProvider";
import useForm from "../../../hooks/useForm";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../../types/constant";
import { ActionSection, ModalForm } from "../../../components/form/FormCard";
import { CancelButton, SubmitButton } from "../../../components/form/Button";
import { InputField2 } from "../../../components/form/InputTextField";
import { encryptFieldByUserKey } from "../../../services/encryption/sessionEncryption";

const CreateBackupCode = ({ isVisible, formConfig }: any) => {
  const { setToast, sessionKey } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.code.trim()) {
      newErrors.code = "Invalid Code";
    }
    return newErrors;
  };

  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    formConfig.initForm,
    validate
  );

  useEffect(() => {
    resetForm();
  }, [isVisible]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      await formConfig.onButtonClick({
        ...form,
        code: encryptFieldByUserKey(sessionKey, form.code),
      });
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  if (!isVisible) return null;
  return (
    <ModalForm
      isVisible={isVisible}
      onClose={formConfig.hideModal}
      title={formConfig.title}
      children={
        <>
          <div className="flex flex-col space-y-4">
            <InputField2
              title="Code"
              isRequired={true}
              placeholder="Enter code"
              value={form?.code}
              onChangeText={(value: any) => handleChange("code", value)}
              error={errors?.code}
            />
            <ActionSection
              children={
                <>
                  <CancelButton onClick={formConfig.hideModal} />
                  <SubmitButton
                    text={BUTTON_TEXT.CREATE}
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

export default CreateBackupCode;
