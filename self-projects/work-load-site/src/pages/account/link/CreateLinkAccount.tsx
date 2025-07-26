/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useGlobalContext } from "../../../components/config/GlobalProvider";
import useForm from "../../../hooks/useForm";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TAG_KIND_MAP,
  TOAST,
} from "../../../types/constant";
import { ActionSection, ModalForm } from "../../../components/form/FormCard";
import { TextAreaField2 } from "../../../components/form/TextareaField";
import { SelectField2 } from "../../../components/form/SelectTextField";
import useApi from "../../../hooks/useApi";
import { CancelButton, SubmitButton } from "../../../components/form/Button";

const CreateLinkAccount = ({ isVisible, formConfig }: any) => {
  const { platform, tag } = useApi();
  const { setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.platformId) {
      newErrors.platformId = "Invalid platform";
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
            <SelectField2
              title="Platform"
              isRequired={true}
              fetchListApi={platform.autoComplete}
              placeholder="Choose platform"
              value={form.platformId}
              onChange={(value: any) => handleChange("platformId", value)}
              error={errors.platformId}
            />
            <TextAreaField2
              title="Note"
              placeholder="Enter note"
              value={form?.note}
              onChangeText={(value: any) => handleChange("note", value)}
              error={errors?.note}
            />
            <SelectField2
              title="Tag"
              fetchListApi={tag.autoComplete}
              placeholder="Choose tag"
              value={form?.tagId}
              onChange={(value: any) => handleChange("tagId", value)}
              error={errors?.tagId}
              colorCodeField="color"
              queryParams={{ kind: TAG_KIND_MAP.ACCOUNT.value }}
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

export default CreateLinkAccount;
