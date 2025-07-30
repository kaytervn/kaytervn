/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useForm from "../../hooks/useForm";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
  VALID_PATTERN,
} from "../../types/constant";
import { ActionSection, ModalForm } from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import { CancelButton, SubmitButton } from "../../components/form/Button";

const RequestKey = ({ isVisible, formConfig }: any) => {
  const { setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.PASSWORD.test(form.password)) {
      newErrors.password = "Invalid Password";
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
      await formConfig.onButtonClick(form);
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  if (!isVisible) return null;
  return (
    <ModalForm
      zIndex={980}
      isVisible={isVisible}
      onClose={formConfig.hideModal}
      title={formConfig.title}
      children={
        <>
          <div className="flex flex-col space-y-4">
            <InputField2
              type="password"
              title="Password"
              isRequired={true}
              placeholder="Enter password"
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
  );
};

export default RequestKey;
