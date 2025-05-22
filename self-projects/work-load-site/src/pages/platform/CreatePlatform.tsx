/* eslint-disable react-hooks/exhaustive-deps */
import { ActionSection, ModalForm } from "../../components/form/FormCard";
import useForm from "../../hooks/useForm";
import { useEffect } from "react";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../types/constant";
import { InputField2 } from "../../components/form/InputTextField";
import { encryptDataByUserKey } from "../../services/encryption/sessionEncryption";
import { ENCRYPT_FIELDS } from "../../services/encryption/encryptFields";

const CreatePlatform = ({ isVisible, formConfig }: any) => {
  const { sessionKey, setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "Invalid name";
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
      await formConfig.onButtonClick(
        encryptDataByUserKey(sessionKey, form, ENCRYPT_FIELDS.CREATE_PLATFORM)
      );
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
              title="Name"
              isRequired={true}
              placeholder="Enter name"
              value={form?.name}
              onChangeText={(value: any) => handleChange("name", value)}
              error={errors?.name}
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

export default CreatePlatform;
