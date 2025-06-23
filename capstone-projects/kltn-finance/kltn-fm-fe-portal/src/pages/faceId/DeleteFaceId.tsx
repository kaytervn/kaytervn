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
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useApi from "../../hooks/useApi";
import { LoadingDialog } from "../../components/page/Dialog";

const DeleteFaceId = ({ isVisible, formConfig }: any) => {
  const { faceId, loading } = useApi();
  const { setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.PASSWORD.test(form.password)) {
      newErrors.password = "Mật khẩu không hợp lệ";
    }
    return newErrors;
  };

  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    formConfig.initForm,
    validate
  );

  useEffect(() => {
    resetForm();
  }, [isVisible]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await faceId.del(form);
      if (!res.result) {
        setToast(res.message, TOAST.ERROR);
        return;
      }
      setToast(BASIC_MESSAGES.SUCCESS, TOAST.SUCCESS);
      await formConfig.onButtonClick();
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
        title={BUTTON_TEXT.DELETE_FACEID}
        children={
          <>
            <div className="flex flex-col space-y-4">
              <InputField
                type="password"
                title="Mật khẩu"
                isRequired={true}
                placeholder="Nhập mật khẩu"
                value={form?.password}
                onChangeText={(value: any) => handleChange("password", value)}
                error={errors?.password}
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

export default DeleteFaceId;
