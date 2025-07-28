/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TAG_KIND_MAP,
  TOAST,
  VALID_PATTERN,
} from "../../types/constant";
import { LoadingDialog } from "../../components/form/Dialog";
import { ActionSection, ModalForm } from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { StaticSelectField } from "../../components/form/SelectTextField";
import { ColorPickerField } from "../../components/form/OtherField";

const UpdateTag = ({ isVisible, formConfig }: any) => {
  const { setToast } = useGlobalContext();
  const { tag, loading } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "Invalid name";
    }
    if (!VALID_PATTERN.COLOR_CODE.test(form.color)) {
      newErrors.color = "Invalid color";
    }
    return newErrors;
  };

  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm(formConfig.initForm, validate);

  useEffect(() => {
    const fetchData = async () => {
      resetForm();
      const res = await tag.get(formConfig.initForm.id);
      if (res.result) {
        const data = res.data;
        setForm({
          id: data.id,
          name: data.name,
          kind: data.kind,
          color: data.color || "",
        });
      } else {
        formConfig?.hideModal();
      }
    };

    if (formConfig?.initForm?.id) {
      fetchData();
    }
  }, [formConfig]);

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
      <LoadingDialog isVisible={loading} />
      <ModalForm
        isVisible={isVisible}
        onClose={formConfig.hideModal}
        title={formConfig.title}
        children={
          <>
            <div className="flex flex-col space-y-4">
              <StaticSelectField
                title="Kind"
                disabled={true}
                dataMap={TAG_KIND_MAP}
                value={form?.kind}
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

export default UpdateTag;
