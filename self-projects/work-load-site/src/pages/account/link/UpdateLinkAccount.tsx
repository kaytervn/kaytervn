/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useGlobalContext } from "../../../components/config/GlobalProvider";
import useApi from "../../../hooks/useApi";
import useForm from "../../../hooks/useForm";
import {
  decryptDataByUserKey,
  encryptDataByUserKey,
} from "../../../services/encryption/sessionEncryption";
import { ENCRYPT_FIELDS } from "../../../services/encryption/encryptFields";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../../types/constant";
import { ActionSection, ModalForm } from "../../../components/form/FormCard";
import { LoadingDialog } from "../../../components/form/Dialog";
import { TextAreaField2 } from "../../../components/form/TextareaField";
import { SelectFieldLazy } from "../../../components/form/SelectTextField";
import { DECRYPT_FIELDS } from "../../../components/config/PageConfig";
import { CancelButton, SubmitButton } from "../../../components/form/Button";

const UpdateLinkAccount = ({ isVisible, formConfig }: any) => {
  const { account, loading } = useApi();
  const { platform } = useApi();
  const { sessionKey, setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.platformId.trim()) {
      newErrors.platformId = "Invalid platform";
    }
    return newErrors;
  };

  const { form, errors, resetForm, setForm, handleChange, isValidForm } =
    useForm(formConfig.initForm, validate);

  useEffect(() => {
    const fetchData = async () => {
      resetForm();
      const res = await account.get(formConfig.initForm.id);
      if (res.result) {
        const data = decryptDataByUserKey(
          sessionKey,
          res.data,
          ENCRYPT_FIELDS.ACCOUNT
        );
        setForm({
          id: data._id,
          platformId: data.platform._id || "",
          note: data.note || "",
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
        encryptDataByUserKey(sessionKey, form, ENCRYPT_FIELDS.ACCOUNT)
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
            <SelectFieldLazy
              title="Platform"
              isRequired={true}
              fetchListApi={platform.list}
              placeholder="Choose platform"
              value={form?.platformId}
              onChange={(value: any) => handleChange("platformId", value)}
              error={errors?.platformId}
              valueKey="_id"
              decryptFields={DECRYPT_FIELDS.PLATFORM}
            />
            <TextAreaField2
              title="Note"
              placeholder="Enter note"
              value={form?.note}
              onChangeText={(value: any) => handleChange("note", value)}
              error={errors?.note}
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

export default UpdateLinkAccount;
