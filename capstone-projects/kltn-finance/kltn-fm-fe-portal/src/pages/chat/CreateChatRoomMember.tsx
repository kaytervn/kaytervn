import { ActionSection, ModalForm } from "../../components/form/FormCard";
import useForm from "../../hooks/useForm";
import { useEffect } from "react";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../services/constant";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { MultiSelectField } from "../../components/form/SelectField";
import useApi from "../../hooks/useApi";

const CreateChatRoomMember = ({ isVisible, formConfig }: any) => {
  const { employee } = useApi();
  const { setToast } = useGlobalContext();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (form.memberIds.length == 0) {
      newErrors.memberIds = "Yêu cầu không hợp lệ";
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
      zIndex={60}
      children={
        <>
          <div className="flex flex-col space-y-4">
            <MultiSelectField
              title="Thành viên"
              isRequired={true}
              fetchListApi={employee.autoComplete}
              placeholder="Chọn các thành viên"
              labelKey="fullName"
              queryParams={{
                ignoreChatRoomId: form?.chatRoomId,
              }}
              value={form?.memberIds}
              onChange={(value: any) => handleChange("memberIds", value)}
              error={errors?.memberIds}
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

export default CreateChatRoomMember;
