/* eslint-disable react-hooks/exhaustive-deps */
import { ActionSection, ModalForm } from "../../components/form/FormCard";
import useForm from "../../hooks/useForm";
import { useEffect } from "react";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../types/constant";
import { InputField2 } from "../../components/form/InputTextField";
import { encryptClientData } from "../../services/encryption/clientEncryption";
import { ENCRYPT_FIELDS } from "../../services/encryption/encryptFields";

const RequestKey = ({ isVisible, formConfig }: any) => {
  const { setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.password.trim()) {
      newErrors.password = "Invalid password";
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
        encryptClientData(form, ENCRYPT_FIELDS.REQUEST_KEY_FORM)
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
              type="password"
              title="Password"
              isRequired={true}
              placeholder="Enter password"
              value={form?.password}
              onChangeText={(value: any) => handleChange("password", value)}
              error={errors?.password}
            />
            <ActionSection
              children={
                <>
                  <CancelButton onClick={formConfig.hideModal} />
                  <SubmitButton
                    text={BUTTON_TEXT.SUBMIT}
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

export default RequestKey;
