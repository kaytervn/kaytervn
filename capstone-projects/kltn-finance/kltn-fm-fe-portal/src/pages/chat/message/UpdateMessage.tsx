import { useEffect } from "react";
import { useGlobalContext } from "../../../components/config/GlobalProvider";
import useApi from "../../../hooks/useApi";
import useForm from "../../../hooks/useForm";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../../services/constant";
import { LoadingDialog } from "../../../components/page/Dialog";
import { ActionSection, ModalForm } from "../../../components/form/FormCard";
import { TextAreaField } from "../../../components/form/InputField";
import { CancelButton, SubmitButton } from "../../../components/form/Button";
import DocumentsField from "../../../components/form/DocumentsField";
import { decryptData, encryptAES } from "../../../services/utils";
import { DECRYPT_FIELDS } from "../../../components/config/PageConfig";

const UpdateMessage = ({ isVisible, formConfig }: any) => {
  const { setToast, sessionKey } = useGlobalContext();
  const { chatMessage, loading } = useApi();

  const { form, errors, setForm, resetForm, handleChange } = useForm(
    formConfig.initForm,
    () => {}
  );

  useEffect(() => {
    const fetchData = async () => {
      resetForm();
      const res = await chatMessage.get(formConfig.initForm.id);
      if (res.result) {
        const data = decryptData(sessionKey, res.data, DECRYPT_FIELDS.MESSAGE);
        setForm({
          id: data.id,
          content: data.content || "",
          document: data.document || "[]",
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
    const content = form?.content.trim()
      ? encryptAES(form.content, sessionKey)
      : null;
    const document =
      form?.document && form?.document != "[]"
        ? encryptAES(form.document, sessionKey)
        : null;
    if (!content && !document) {
      setToast("Vui lòng nhập tin nhắn hoặc gửi tệp", TOAST.ERROR);
      return;
    }
    await formConfig.onButtonClick({
      id: form.id,
      content,
      document,
    });
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
              <TextAreaField
                title="Nội dung"
                placeholder="Nhập nội dung"
                value={form?.content}
                onChangeText={(value: any) => handleChange("content", value)}
                error={errors?.content}
              />
              <DocumentsField
                title="Tệp đính kèm"
                value={form?.document}
                onChange={(value: any) => handleChange("document", value)}
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

export default UpdateMessage;
