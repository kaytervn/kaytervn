import { useGlobalContext } from "../../components/config/GlobalProvider";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { LoadingDialog } from "../../components/form/Dialog";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import { SelectField2 } from "../../components/form/SelectTextField";
import { TextAreaField2 } from "../../components/form/TextareaField";
import Sidebar2 from "../../components/main/Sidebar2";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import useQueryState from "../../hooks/useQueryState";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TAG_KIND_MAP,
  TOAST,
} from "../../types/constant";
import { isValidURL } from "../../types/utils";

const CreateSoftware = () => {
  const { setToast } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.SOFTWARE.path,
  });
  const { software, loading } = useApi();
  const { tag } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "Invalid name";
    }
    if (form.link && !isValidURL(form.link)) {
      newErrors.link = "Invalid link";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    {
      name: "",
      link: "",
      note: "",
      tagId: "",
    },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await software.create(form);
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
          label: PAGE_CONFIG.SOFTWARE.label,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.CREATE_SOFTWARE.label,
        },
      ]}
      activeItem={PAGE_CONFIG.SOFTWARE.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.CREATE_SOFTWARE.label}
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
                    title="Link"
                    placeholder="Enter link"
                    value={form.link}
                    onChangeText={(value: any) => handleChange("link", value)}
                    error={errors.link}
                    maxLength={255}
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
                    queryParams={{ kind: TAG_KIND_MAP.SOFTWARE.value }}
                  />
                  <div className="flex-1" />
                </div>
                <TextAreaField2
                  title="Note"
                  placeholder="Enter note"
                  value={form?.note}
                  onChangeText={(value: any) => handleChange("note", value)}
                  error={errors?.note}
                  height={"200"}
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

export default CreateSoftware;
