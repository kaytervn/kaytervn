import { ActionSection, ModalForm } from "../../components/form/FormCard";
import useForm from "../../hooks/useForm";
import { useEffect } from "react";
import { InputField } from "../../components/form/InputField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
  VALID_PATTERN,
} from "../../services/constant";
import useApi from "../../hooks/useApi";
import { LoadingDialog } from "../../components/page/Dialog";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { decryptData } from "../../services/utils";
import { DECRYPT_FIELDS } from "../../components/config/PageConfig";
import { ColorPickerField } from "../../components/form/OtherField";

const UpdateTransactionTag = ({ isVisible, formConfig }: any) => {
  const { setToast, sessionKey } = useGlobalContext();
  const { tag, loading } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "Tên tag không hợp lệ";
    }
    if (!VALID_PATTERN.COLOR_CODE.test(form.colorCode)) {
      newErrors.colorCode = "Màu không hợp lệ";
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
      const res = await tag.get(formConfig.initForm.id);
      if (res.result) {
        const data = decryptData(sessionKey, res.data, DECRYPT_FIELDS.TAG);
        setForm({
          id: data.id,
          name: data.name,
          colorCode: data.colorCode,
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
                title="Tên tag"
                isRequired={true}
                placeholder="Nhập tên tag"
                value={form?.name}
                onChangeText={(value: any) => handleChange("name", value)}
                error={errors?.name}
              />
              <ColorPickerField
                title="Mã màu"
                isRequired={true}
                value={form?.colorCode}
                onChange={(value: any) => handleChange("colorCode", value)}
                error={errors?.colorCode}
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

export default UpdateTransactionTag;
