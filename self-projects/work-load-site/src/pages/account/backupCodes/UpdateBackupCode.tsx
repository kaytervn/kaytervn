/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from "react";
import { useGlobalContext } from "../../../components/config/GlobalProvider";
import useApi from "../../../hooks/useApi";
import useForm from "../../../hooks/useForm";
import {
  decryptDataByUserKey,
  encryptDataByUserKey,
} from "../../../services/encryption/sessionEncryption";
import { DECRYPT_FIELDS } from "../../../components/config/PageConfig";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../../types/constant";
import { ActionSection, ModalForm } from "../../../components/form/FormCard";
import { LoadingDialog } from "../../../components/form/Dialog";
import { InputField2 } from "../../../components/form/InputTextField";
import { CancelButton, SubmitButton } from "../../../components/form/Button";

const UpdateBackupCode = ({ isVisible, formConfig }: any) => {
  const { backupCode, loading } = useApi();
  const { sessionKey, setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.code.trim()) {
      newErrors.code = "Invalid code";
    }
    return newErrors;
  };

  const { form, errors, resetForm, setForm, handleChange, isValidForm } =
    useForm(formConfig.initForm, validate);

  useEffect(() => {
    const fetchData = async () => {
      resetForm();
      const res = await backupCode.get(formConfig.initForm.id);
      if (res.result) {
        const data = decryptDataByUserKey(
          sessionKey,
          res.data,
          DECRYPT_FIELDS.BACKUP_CODE
        );
        setForm({
          id: data._id,
          code: data.code || "",
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
        encryptDataByUserKey(sessionKey, form, DECRYPT_FIELDS.BACKUP_CODE)
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
              title="Code"
              isRequired={true}
              placeholder="Enter code"
              value={form?.code}
              onChangeText={(value: any) => handleChange("code", value)}
              error={errors?.code}
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

export default UpdateBackupCode;
