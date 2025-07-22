/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useGlobalContext } from "../../../components/config/GlobalProvider";
import useApi from "../../../hooks/useApi";
import useForm from "../../../hooks/useForm";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../../types/constant";
import { LoadingDialog } from "../../../components/form/Dialog";
import { ActionSection, ModalForm } from "../../../components/form/FormCard";
import { SelectField2 } from "../../../components/form/SelectTextField";
import { TextAreaField2 } from "../../../components/form/TextareaField";
import { CancelButton, SubmitButton } from "../../../components/form/Button";

const UpdateLinkAccount = ({ isVisible, formConfig }: any) => {
  const { setToast } = useGlobalContext();
  const { account, loading } = useApi();
  const { platform } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.platformId) {
      newErrors.platformId = "Invalid platform";
    }
    return newErrors;
  };

  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm(formConfig.initForm, validate);

  useEffect(() => {
    const fetchData = async () => {
      resetForm();
      const res = await account.get(formConfig.initForm.id);
      if (res.result) {
        const data = res.data;
        setForm({
          id: data.id,
          platformId: data.platform?.id,
          note: data.note,
          platformName: data.platform?.name,
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
      await formConfig.onButtonClick(form);
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
        title={formConfig.title}
        children={
          <>
            <div className="flex flex-col space-y-4">
              <SelectField2
                title="Platform"
                isRequired={true}
                fetchListApi={platform.autoComplete}
                placeholder="Choose platform"
                value={form.platformId}
                onChange={(value: any) => handleChange("platformId", value)}
                error={errors.platformId}
                initSearch={form?.platformName}
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
                    <CancelButton onClick={formConfig?.hideModal} />
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
    </>
  );
};

export default UpdateLinkAccount;
