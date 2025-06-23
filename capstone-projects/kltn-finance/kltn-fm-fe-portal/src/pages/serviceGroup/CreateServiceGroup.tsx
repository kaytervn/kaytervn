import { ActionSection, ModalForm } from "../../components/form/FormCard";
import useForm from "../../hooks/useForm";
import { useEffect } from "react";
import { InputField, TextAreaField } from "../../components/form/InputField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../services/constant";
import { useGlobalContext } from "../../components/config/GlobalProvider";

const CreateServiceGroup = ({ isVisible, formConfig }: any) => {
  const { setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "Tên nhóm không hợp lệ";
    }
    if (!form.description.trim()) {
      newErrors.description = "Mô tả không hợp lệ";
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
            <InputField
              title="Tên nhóm"
              isRequired={true}
              placeholder="Nhập tên nhóm"
              value={form?.name}
              onChangeText={(value: any) => handleChange("name", value)}
              error={errors?.name}
            />
            <TextAreaField
              title="Mô tả"
              isRequired={true}
              placeholder="Nhập mô tả"
              value={form?.description}
              onChangeText={(value: any) => handleChange("description", value)}
              error={errors?.description}
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

export default CreateServiceGroup;
