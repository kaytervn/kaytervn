import { ActionSection, ModalForm } from "../../components/form/FormCard";
import useForm from "../../hooks/useForm";
import { useEffect } from "react";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../services/constant";
import { SelectField } from "../../components/form/SelectField";
import useApi from "../../hooks/useApi";
import { useGlobalContext } from "../../components/config/GlobalProvider";

const CreateServiceGroupPermission = ({ isVisible, formConfig }: any) => {
  const { setToast } = useGlobalContext();
  const { employee } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.accountId) {
      newErrors.accountId = "Nhân viên không hợp lệ";
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
            <SelectField
              title="Nhân viên"
              isRequired={true}
              fetchListApi={employee.autoComplete}
              placeholder="Chọn nhân viên"
              queryParams={{
                ignoreTransactionGroupId: form?.transactionGroupId,
              }}
              labelKey="fullName"
              value={form?.accountId}
              onChange={(value: any) => handleChange("accountId", value)}
              error={errors?.accountId}
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

export default CreateServiceGroupPermission;
