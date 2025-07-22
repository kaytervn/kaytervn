/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useApi from "../../hooks/useApi";
import { TimerResetIcon } from "lucide-react";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import useModal from "../../hooks/useModal";
import { TextAreaField2 } from "../../components/form/TextareaField";
import { ActionSection, ModalForm } from "../../components/form/FormCard";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../types/constant";
import { LoadingDialog } from "../../components/form/Dialog";
import useForm from "../../hooks/useForm";
import { decryptRSA } from "../../types/utils";
import { decryptClientField } from "../../services/encryption/clientEncryption";

const InputKeyForm = ({ isVisible, formConfig }: any) => {
  const { user, loading } = useApi();
  const { setToast, setSessionKey, refreshSessionTimeout } = useGlobalContext();
  const [mySecretKey, setMySecretKey] = useState<any>(null);
  const validate = (form: any) => {
    const newErrors: any = {};
    const decryptedKey = decryptRSA(
      decryptClientField(form.sessionKey),
      mySecretKey
    );
    if (!decryptedKey) {
      newErrors.sessionKey = "Invalid key";
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
      const res = await user.getMyKey();
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
        title={"Input session key"}
        children={
          <>
            <div className="flex flex-col space-y-4">
              <TextAreaField2
                title="Secret key"
                isRequired={true}
                placeholder="Enter your secret key"
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
            SESSION KEY TIMED OUT
          </h2>
          <SubmitButton text={"Input key"} onClick={handleOpenModal} />
        </div>
      </div>
    </>
  );
};

export default InputSessionKey;
