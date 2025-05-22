/* eslint-disable react-hooks/exhaustive-deps */
import { ActionSection, ModalForm } from "../../components/form/FormCard";
import useForm from "../../hooks/useForm";
import { useEffect } from "react";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../types/constant";
import { InputField2 } from "../../components/form/InputTextField";
import {
  decryptDataByUserKey,
  encryptDataByUserKey,
} from "../../services/encryption/sessionEncryption";
import { ENCRYPT_FIELDS } from "../../services/encryption/encryptFields";
import useApi from "../../hooks/useApi";
import { LoadingDialog } from "../../components/form/Dialog";

const UpdatePlatform = ({ isVisible, formConfig }: any) => {
  const { platform, loading } = useApi();
  const { sessionKey, setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "Invalid name";
    }
    return newErrors;
  };

  const { form, errors, resetForm, setForm, handleChange, isValidForm } =
    useForm(formConfig.initForm, validate);

  useEffect(() => {
    const fetchData = async () => {
      resetForm();
      const res = await platform.get(formConfig.initForm.id);
      if (res.result) {
        const data = decryptDataByUserKey(
          sessionKey,
          res.data,
          ENCRYPT_FIELDS.PLATFORM
        );
        setForm({
          id: data._id,
          name: data.name,
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
      await formConfig.onButtonClick(
        encryptDataByUserKey(sessionKey, form, ENCRYPT_FIELDS.UPDATE_PLATFORM)
      );
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
          <LoadingDialog isVisible={loading} />
          <div className="flex flex-col space-y-4">
            <InputField2
              title="Name"
              isRequired={true}
              placeholder="Enter name"
              value={form?.name}
              onChangeText={(value: any) => handleChange("name", value)}
              error={errors?.name}
            />
            <ActionSection
              children={
                <>
                  <CancelButton onClick={formConfig.hideModal} />
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
  );
};

export default UpdatePlatform;
