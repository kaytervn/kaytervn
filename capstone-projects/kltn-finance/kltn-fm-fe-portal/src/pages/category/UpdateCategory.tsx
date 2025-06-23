import { ActionSection, ModalForm } from "../../components/form/FormCard";
import useForm from "../../hooks/useForm";
import { useEffect } from "react";
import { InputField, TextAreaField } from "../../components/form/InputField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
  TRANSACTION_KIND_MAP,
} from "../../services/constant";
import useApi from "../../hooks/useApi";
import { LoadingDialog } from "../../components/page/Dialog";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { decryptData } from "../../services/utils";
import { DECRYPT_FIELDS } from "../../components/config/PageConfig";
import { StaticSelectField } from "../../components/form/SelectField";

const UpdateCategory = ({ isVisible, formConfig }: any) => {
  const { setToast, sessionKey } = useGlobalContext();
  const { category, loading } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "Tên danh mục không hợp lệ";
    }
    if (!form.kind) {
      newErrors.kind = "Loại không hợp lệ";
    }
    if (!form.description.trim()) {
      newErrors.description = "Mô tả không hợp lệ";
    }
    return newErrors;
  };

  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm(formConfig.initForm, validate);

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionKey) {
        formConfig?.hideModal();
      }
      resetForm();
      const res = await category.get(formConfig.initForm.id);
      if (res.result) {
        const data = decryptData(sessionKey, res.data, DECRYPT_FIELDS.CATEGORY);
        setForm({
          id: data.id,
          name: data.name,
          kind: data.kind,
          description: data.description,
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
              <InputField
                title="Tên danh mục"
                isRequired={true}
                placeholder="Nhập tên danh mục"
                value={form?.name}
                onChangeText={(value: any) => handleChange("name", value)}
                error={errors?.name}
              />
              <StaticSelectField
                title="Loại"
                isRequired={true}
                placeholder="Chọn loại"
                dataMap={TRANSACTION_KIND_MAP}
                value={form?.kind}
                onChange={(value: any) => handleChange("kind", value)}
                error={errors?.kind}
              />
              <TextAreaField
                title="Mô tả"
                isRequired={true}
                placeholder="Nhập mô tả"
                value={form?.description}
                onChangeText={(value: any) =>
                  handleChange("description", value)
                }
                error={errors?.description}
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

export default UpdateCategory;
