import { ActionSection, ModalForm } from "../../components/form/FormCard";
import useForm from "../../hooks/useForm";
import { useEffect, useRef } from "react";
import { TextAreaField } from "../../components/form/InputField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../services/constant";
import { useGlobalContext } from "../../components/GlobalProvider";
import useApi from "../../hooks/useApi";
import { LoadingDialog } from "../../components/page/Dialog";

const PushBackup = ({ isVisible, formConfig }: any) => {
  const { setToast } = useGlobalContext();
  const { media, loading } = useApi();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log(file.type);
    if (file.type !== "application/x-zip-compressed") {
      setToast("Định dạng tệp không hợp lệ", TOAST.ERROR);
      return;
    }
    const res = await media.pushBackup(form.apiKey, file);
    if (res.result) {
      setToast("Phục hồi các tệp tin thành công", TOAST.SUCCESS);
    } else {
      setToast(res.message, TOAST.ERROR);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    formConfig?.hideModal();
  };

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.apiKey) {
      newErrors.apiKey = "API Key không hợp lệ";
    }
    return newErrors;
  };

  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    { apiKey: "" },
    validate
  );

  useEffect(() => {
    resetForm();
  }, [isVisible]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      fileInputRef.current?.click();
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
        title={"Nhập tệp phục hồi tệp tin"}
        children={
          <>
            <input
              type="file"
              accept=".zip"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <div className="flex flex-col space-y-4">
              <TextAreaField
                title="API Key"
                isRequired={true}
                placeholder="Nhập API Key"
                value={form?.apiKey}
                onChangeText={(value: any) => handleChange("apiKey", value)}
                error={errors?.apiKey}
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
    </>
  );
};

export default PushBackup;
