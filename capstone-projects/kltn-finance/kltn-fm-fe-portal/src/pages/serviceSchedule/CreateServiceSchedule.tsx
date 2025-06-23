import { ActionSection, ModalForm } from "../../components/form/FormCard";
import useForm from "../../hooks/useForm";
import { useEffect } from "react";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../services/constant";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { InputField } from "../../components/form/InputField";

const CreateServiceSchedule = ({ isVisible, formConfig }: any) => {
  const { setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    try {
      if (parseInt(form.numberOfDueDays) <= 0) {
        newErrors.numberOfDueDays = "Số ngày tới hạn không hợp lệ";
      }
    } catch (er) {
      newErrors.numberOfDueDays = "Số ngày tới hạn không hợp lệ";
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
      isVisible={isVisible}
      onClose={formConfig.hideModal}
      title={formConfig.title}
      children={
        <>
          <div className="flex flex-col space-y-4">
            <InputField
              title="Số ngày tới hạn"
              isRequired={true}
              type="number"
              placeholder="Nhập số ngày tới hạn"
              value={form?.numberOfDueDays}
              onChangeText={(value: any) =>
                handleChange("numberOfDueDays", value)
              }
              error={errors?.numberOfDueDays}
            />
            <ActionSection
              children={
                <>
                  <CancelButton onClick={formConfig.hideModal} />
                  <SubmitButton
                    text={BUTTON_TEXT.CREATE}
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

export default CreateServiceSchedule;
