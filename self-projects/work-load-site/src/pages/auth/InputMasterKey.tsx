/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../types/constant";
import { ActionSection, ModalForm } from "../../components/form/FormCard";
import { TextAreaField2 } from "../../components/form/TextareaField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import useForm from "../../hooks/useForm";
import useApi from "../../hooks/useApi";
import { LoadingDialog } from "../../components/form/Dialog";

const InputMasterKey = ({ isVisible, formConfig }: any) => {
  const { user, loading } = useApi();
  const { setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.key.trim()) {
      newErrors.key = "Invalid key";
    }
    return newErrors;
  };

  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    { key: "" },
    validate
  );

  useEffect(() => {
    resetForm();
  }, [isVisible]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await user.inputKey(form);
      if (res.result) {
        formConfig?.hideModal();
        setToast(BASIC_MESSAGES.SUCCESS, TOAST.SUCCESS);
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
      onClose={formConfig?.hideModal}
      title={"Input System Key"}
      children={
        <>
          <LoadingDialog isVisible={loading} />
          <div className="flex flex-col space-y-4">
            <TextAreaField2
              title="Master key"
              isRequired={true}
              placeholder="Enter master key"
              value={form?.key}
              onChangeText={(value: any) => handleChange("key", value)}
              error={errors?.key}
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
  );
};

export default InputMasterKey;
