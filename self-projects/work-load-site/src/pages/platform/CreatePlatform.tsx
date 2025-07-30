/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useForm from "../../hooks/useForm";
import { isValidURL } from "../../types/utils";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../types/constant";
import { ActionSection, ModalForm } from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import { CancelButton, SubmitButton } from "../../components/form/Button";

const CreatePlatform = ({ isVisible, formConfig }: any) => {
  const { setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "Invalid Name";
    }
    if (form.url && !isValidURL(form.url)) {
      newErrors.url = "Invalid URL";
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
            <InputField2
              title="URL"
              placeholder="Enter URL"
              value={form?.url}
              onChangeText={(value: any) => handleChange("url", value)}
              error={errors?.url}
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
