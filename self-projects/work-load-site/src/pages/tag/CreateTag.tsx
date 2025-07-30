/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useForm from "../../hooks/useForm";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TAG_KIND_MAP,
  TOAST,
  VALID_PATTERN,
} from "../../types/constant";
import { ActionSection, ModalForm } from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import { ColorPickerField } from "../../components/form/OtherField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { StaticSelectField } from "../../components/form/SelectTextField";

const CreateTag = ({ isVisible, formConfig }: any) => {
  const { setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "Invalid Name";
    }
    if (!form.kind) {
      newErrors.kind = "Invalid Kind";
    }
    if (!VALID_PATTERN.COLOR_CODE.test(form.color)) {
      newErrors.color = "Invalid Color";
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
            <StaticSelectField
              title="Kind"
              isRequired={true}
              dataMap={TAG_KIND_MAP}
              placeholder="Choose kind"
              value={form?.kind}
              onChange={(value: any) => handleChange("kind", value)}
              error={errors?.kind}
            />
            <InputField2
              title="Name"
              isRequired={true}
              placeholder="Enter name"
              value={form?.name}
              onChangeText={(value: any) => handleChange("name", value)}
              error={errors?.name}
            />
            <ColorPickerField
              title="Color"
              isRequired={true}
              value={form?.color}
              onChange={(value: any) => handleChange("color", value)}
              error={errors?.color}
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

export default CreateTag;
