import { ActionSection, ModalForm } from "../../components/form/FormCard";
import useForm from "../../hooks/useForm";
import { useEffect } from "react";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../services/constant";
import { SelectFieldLazy } from "../../components/form/SelectField";
import useApi from "../../hooks/useApi";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { DECRYPT_FIELDS } from "../../components/config/PageConfig";

const CreateServiceNotificationGroup = ({ isVisible, formConfig }: any) => {
  const { setToast } = useGlobalContext();
  const { notificationGroup } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.notificationGroupId) {
      newErrors.notificationGroupId = "Nhóm không hợp lệ";
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
            <SelectFieldLazy
              title="Nhóm thông báo"
              isRequired={true}
              fetchListApi={notificationGroup.autoComplete}
              placeholder="Chọn nhóm dịch vụ"
              value={form?.notificationGroupId}
              onChange={(value: any) =>
                handleChange("notificationGroupId", value)
              }
              error={errors?.notificationGroupId}
              decryptFields={DECRYPT_FIELDS.NOTIFICATION_GROUP}
              queryParams={{
                ignoreServiceId: form?.serviceId,
              }}
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

export default CreateServiceNotificationGroup;
