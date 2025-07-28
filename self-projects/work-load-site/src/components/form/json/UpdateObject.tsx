/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useGlobalContext } from "../../config/GlobalProvider";
import useForm from "../../../hooks/useForm";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../../types/constant";
import { ActionSection, ModalForm } from "../FormCard";
import { InputField2 } from "../InputTextField";
import { CancelButton, SubmitButton } from "../Button";

const UpdateObject = ({ isVisible, formConfig }: any) => {
  const { setToast } = useGlobalContext();
  const fieldConfig = formConfig.fieldConfig;
  const validate = (form: any) => {
    const newErrors: any = {};
    if (fieldConfig.key.required && !form.name.trim()) {
      newErrors.name = "Invalid value";
    }
    if (fieldConfig.value.required && !form.note.trim()) {
      newErrors.note = "Invalid value";
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
      await formConfig.onButtonClick(form);
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  if (!isVisible) return null;
  return (
    <>
      <ModalForm
        isVisible={isVisible}
        onClose={formConfig.hideModal}
        title={formConfig.title}
        children={
          <>
            <div className="flex flex-col space-y-4">
              <InputField2
                title={fieldConfig.key.label}
                isRequired={fieldConfig.key.required}
                placeholder="Enter value"
                value={form?.name}
                onChangeText={(value: any) => handleChange("name", value)}
                error={errors?.name}
              />
              <InputField2
                title={fieldConfig.value.label}
                isRequired={fieldConfig.value.required}
                placeholder="Enter value"
                value={form?.note}
                onChangeText={(value: any) => handleChange("note", value)}
                error={errors?.note}
              />
              <ActionSection
                children={
                  <>
                    <CancelButton onClick={formConfig?.hideModal} />
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
    </>
  );
};

export default UpdateObject;
