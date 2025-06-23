import { useGlobalContext } from "../../components/config/GlobalProvider";
import useForm from "../../hooks/useForm";
import { useEffect, useState } from "react";
import { ActionSection, ModalForm } from "../../components/form/FormCard";
import { TextAreaField } from "../../components/form/InputField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../services/constant";
import useModal from "../../hooks/useModal";
import useApi from "../../hooks/useApi";
import { decryptWithRSA } from "../../services/utils";
import { LoadingDialog } from "../../components/page/Dialog";
import { TimerResetIcon } from "lucide-react";

const InputKeyForm = ({ isVisible, formConfig }: any) => {
  const { auth, loading } = useApi();
  const { setToast, setSessionKey, refreshSessionTimeout } = useGlobalContext();
  const [mySecretKey, setMySecretKey] = useState<any>(null);
  const validate = (form: any) => {
    const newErrors: any = {};
    const decryptedKey = decryptWithRSA({
      privateKeyStr: form.sessionKey,
      encryptedData: mySecretKey,
    });
    if (!decryptedKey) {
      newErrors.sessionKey = "Mã bảo mật không hợp lệ";
    } else {
      setSessionKey(decryptedKey);
    }
    return newErrors;
  };

  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    { sessionKey: "" },
    validate
  );

  useEffect(() => {
    const getKey = async () => {
      if (!isVisible || mySecretKey) {
        return;
      }
      const res = await auth.getMyKey();
      if (!res.result) {
        formConfig?.hideModal();
      }
      const secretKey = res?.data?.secretKey;
      setMySecretKey(secretKey);
    };
    getKey();
    resetForm();
  }, [isVisible]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      formConfig?.hideModal();
      refreshSessionTimeout();
      setToast(BASIC_MESSAGES.SUCCESS, TOAST.SUCCESS);
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
        onClose={formConfig?.hideModal}
        title={"Nhập mã bảo mật"}
        children={
          <>
            <div className="flex flex-col space-y-4">
              <TextAreaField
                title="Mã bảo mật"
                isRequired={true}
                placeholder="Nhập mã bảo mật"
                value={form?.sessionKey}
                onChangeText={(value: any) => handleChange("sessionKey", value)}
                error={errors?.sessionKey}
                maxLength={2000}
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

const InputSessionKey = () => {
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();

  const handleOpenModal = () => {
    showModal({
      hideModal,
    });
  };

  return (
    <>
      <InputKeyForm formConfig={formConfig} isVisible={isModalVisible} />
      <div className="w-full min-h-[200px] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <TimerResetIcon className="text-gray-600" size={100} />
          <h2 className="text-lg font-semibold text-white">
            PHIÊN GIẢI MÃ HẾT HẠN
          </h2>
          <SubmitButton text={"Nhập mã"} onClick={handleOpenModal} />
        </div>
      </div>
    </>
  );
};

export default InputSessionKey;
