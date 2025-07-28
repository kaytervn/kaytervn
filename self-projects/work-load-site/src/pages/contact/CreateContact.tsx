import { useGlobalContext } from "../../components/config/GlobalProvider";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { LoadingDialog } from "../../components/form/Dialog";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import JsonListField from "../../components/form/json/JsonListField";
import { SelectField2 } from "../../components/form/SelectTextField";
import { TextAreaField2 } from "../../components/form/TextareaField";
import Sidebar2 from "../../components/main/Sidebar2";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import useQueryState from "../../hooks/useQueryState";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  CONTACT_PHONE_FIELD_CONFIG,
  TAG_KIND_MAP,
  TOAST,
  VALID_PATTERN,
} from "../../types/constant";

const CreateContact = () => {
  const { setToast } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.CONTACT.path,
  });
  const { contact, loading } = useApi();
  const { tag } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "Invalid name";
    }
    if (!VALID_PATTERN.PHONE.test(form.phone)) {
      newErrors.phone = "Invalid phone";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    {
      name: "",
      phone: "",
      phones: "[]",
      note: "",
      tagId: "",
    },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await contact.create(form);
      if (res.result) {
        setToast(BASIC_MESSAGES.CREATED, TOAST.SUCCESS);
        handleNavigateBack();
      } else {
        setToast(res.message || BASIC_MESSAGES.FAILED, TOAST.ERROR);
      }
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  return (
    <Sidebar2
      breadcrumbs={[
        {
          label: PAGE_CONFIG.CONTACT.label,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.CREATE_CONTACT.label,
        },
      ]}
      activeItem={PAGE_CONFIG.CONTACT.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.CREATE_CONTACT.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <InputField2
                    title="Name"
                    isRequired={true}
                    placeholder="Enter name"
                    value={form.name}
                    onChangeText={(value: any) => handleChange("name", value)}
                    error={errors.name}
                  />
                  <InputField2
                    title="Phone"
                    isRequired={true}
                    placeholder="Enter phone"
                    value={form.phone}
                    onChangeText={(value: any) => handleChange("phone", value)}
                    error={errors.phone}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <SelectField2
                    title="Tag"
                    fetchListApi={tag.autoComplete}
                    placeholder="Choose tag"
                    value={form.tagId}
                    onChange={(value: any) => handleChange("tagId", value)}
                    error={errors.tagId}
                    colorCodeField="color"
                    queryParams={{ kind: TAG_KIND_MAP.CONTACT.value }}
                  />
                  <div className="flex-1" />
                </div>
                <TextAreaField2
                  title="Note"
                  placeholder="Enter note"
                  value={form?.note}
                  onChangeText={(value: any) => handleChange("note", value)}
                  error={errors?.note}
                />
                <JsonListField
                  title="Extra phones"
                  value={form?.phones}
                  onChange={(value: any) => handleChange("phones", value)}
                  fieldConfig={CONTACT_PHONE_FIELD_CONFIG}
                />
                <ActionSection
                  children={
                    <>
                      <CancelButton onClick={handleNavigateBack} />
                      <SubmitButton
                        text={BUTTON_TEXT.CREATE}
                        color="royalblue"
                        onClick={handleSubmit}
                      />
                    </>
                  }
                />
              </div>
            }
          />
        </>
      }
    />
  );
};

export default CreateContact;
