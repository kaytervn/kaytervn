import { ActionSection, ModalForm } from "../../components/form/FormCard";
import useForm from "../../hooks/useForm";
import { useEffect, useState } from "react";
import { TextAreaField } from "../../components/form/InputField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../services/constant";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useApi from "../../hooks/useApi";

const DecryptPassword = ({ isVisible, formConfig }: any) => {
  const { setToast } = useGlobalContext();
  const { keyInformation } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.value.trim()) {
      newErrors.value = "Giá trị không hợp lệ";
    }
    return newErrors;
  };
  const [decryptedValue, setDecryptedValue] = useState("");
  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    formConfig.initForm,
    validate
  );

  useEffect(() => {
    setDecryptedValue("");
    resetForm();
  }, [isVisible]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await keyInformation.decrypt(form.value);
      if (res.result) {
        setToast(BASIC_MESSAGES.SUCCESS, TOAST.SUCCESS);
        setDecryptedValue(res.data.decryptedValue);
      } else {
        setToast(res.message, TOAST.ERROR);
      }
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
            <TextAreaField
              title="Chuỗi mã hóa"
              isRequired={true}
              placeholder="Nhập chuỗi cần giải mã"
              value={form?.value}
              onChangeText={(value: any) => {
                handleChange("value", value);
                setDecryptedValue("");
              }}
              error={errors?.value}
            />
            <TextAreaField
              title="Chuỗi đã giải mã"
              placeholder="Kết quả giải mã sẽ xuất hiện ở đây"
              disabled={true}
              value={decryptedValue}
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

export default DecryptPassword;
