/* eslint-disable react-hooks/exhaustive-deps */
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { LoadingDialog } from "../../components/form/Dialog";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import JsonListField from "../../components/form/json/JsonListField";
import { CustomDatePickerField } from "../../components/form/SchedulePickerField";
import {
  SelectField2,
  StaticSelectField,
} from "../../components/form/SelectTextField";
import { TextAreaField2 } from "../../components/form/TextareaField";
import Sidebar2 from "../../components/main/Sidebar2";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import useQueryState from "../../hooks/useQueryState";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  SCHEDULE_EMAIL_FIELD_CONFIG,
  SCHEDULE_KIND_MAP,
  SCHEDULE_TYPE_MAP,
  TAG_KIND_MAP,
  TOAST,
  VALID_PATTERN,
} from "../../types/constant";
import { calculateDueDate } from "../../types/utils";

const CreateSchedule = () => {
  const isExactDate = () =>
    !form.kind || form?.kind == SCHEDULE_KIND_MAP.EXACT_DATE.value;
  const isMonths = () => form?.kind == SCHEDULE_KIND_MAP.MONTHS.value;
  const isDays = () => form?.kind == SCHEDULE_KIND_MAP.DAYS.value;

  const { setToast } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.SCHEDULE.path,
  });
  const { schedule, loading } = useApi();
  const { tag } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "Invalid name";
    }
    if (!form.sender.trim()) {
      newErrors.sender = "Invalid sender";
    }
    if (!form.content.trim()) {
      newErrors.content = "Invalid content";
    }
    if (!VALID_PATTERN.TIME.test(form.time)) {
      newErrors.time = "Invalid time";
    }
    if (!form.kind) {
      newErrors.kind = "Invalid kind";
    }
    if (!isExactDate() && !form.type) {
      newErrors.type = "Invalid type";
    }
    if ((isDays() || isMonths()) && !form.amount) {
      newErrors.amount = "Invalid amount";
    }
    if (!form.checkedDate) {
      newErrors.checkedDate = "Invalid date";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    {
      name: "",
      sender: "",
      kind: "",
      type: "",
      tagId: "",
      checkedDate: "",
      time: "",
      emails: "",
      content: "",
      amount: "",
    },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const emails = JSON.parse(form.emails || "[]");
      if (emails.length == 0) {
        setToast("At least one email is required", TOAST.ERROR);
      }
      const res = await schedule.create(form);
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
          label: PAGE_CONFIG.SCHEDULE.label,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.CREATE_SCHEDULE.label,
        },
      ]}
      activeItem={PAGE_CONFIG.SCHEDULE.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.CREATE_SCHEDULE.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <InputField2
                    title="Name"
                    isRequired={true}
                    placeholder="Enter name"
                    value={form?.name}
                    onChangeText={(value: any) => handleChange("name", value)}
                    error={errors.name}
                  />
                  <InputField2
                    title="Sender"
                    isRequired={true}
                    placeholder="Enter sender"
                    value={form?.sender}
                    onChangeText={(value: any) => handleChange("sender", value)}
                    error={errors.sender}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <StaticSelectField
                    title="Kind"
                    isRequired={true}
                    dataMap={SCHEDULE_KIND_MAP}
                    placeholder="Choose kind"
                    value={form?.kind}
                    onChange={(value: any) => handleChange("kind", value)}
                    error={errors?.kind}
                  />
                  <SelectField2
                    title="Tag"
                    fetchListApi={tag.autoComplete}
                    placeholder="Choose tag"
                    value={form.tagId}
                    onChange={(value: any) => handleChange("tagId", value)}
                    error={errors.tagId}
                    colorCodeField="color"
                    queryParams={{ kind: TAG_KIND_MAP.SCHEDULE.value }}
                  />
                </div>
                {form?.kind && (
                  <div className="flex flex-row space-x-2">
                    <CustomDatePickerField
                      title="Checked Date"
                      isRequired={true}
                      value={form?.checkedDate}
                      onChange={(value: any) =>
                        handleChange("checkedDate", value)
                      }
                      error={errors.checkedDate}
                      kind={form?.kind}
                    />
                    <InputField2
                      title="Time"
                      isRequired={true}
                      placeholder="Enter time (HH:mm)"
                      value={form?.time}
                      onChangeText={(value: any) => handleChange("time", value)}
                      error={
                        form?.time && !VALID_PATTERN.TIME.test(form?.time)
                          ? "Invalid format (HH:mm)"
                          : null
                      }
                    />
                    {(isMonths() || isDays()) && (
                      <InputField2
                        title={`${isMonths() ? "Month(s)" : "Day(s)"} count`}
                        isRequired={true}
                        placeholder="Enter count"
                        type="number"
                        value={form?.amount}
                        onChangeText={(value: any) =>
                          handleChange("amount", value)
                        }
                        error={errors.amount}
                      />
                    )}
                  </div>
                )}
                {!isExactDate() && (
                  <div className="flex flex-row space-x-2">
                    <InputField2
                      title="Due Date"
                      disabled={true}
                      value={calculateDueDate(
                        form?.checkedDate,
                        form?.time,
                        form?.kind,
                        form?.amount
                      )}
                    />
                    <StaticSelectField
                      title="Type"
                      isRequired={true}
                      dataMap={SCHEDULE_TYPE_MAP}
                      placeholder="Choose type"
                      value={form?.type}
                      onChange={(value: any) => handleChange("type", value)}
                      error={errors?.type}
                    />
                  </div>
                )}
                <JsonListField
                  title="Emails"
                  isRequired={true}
                  value={form?.emails}
                  onChange={(value: any) => handleChange("emails", value)}
                  fieldConfig={SCHEDULE_EMAIL_FIELD_CONFIG}
                />
                <TextAreaField2
                  title="Content"
                  isRequired={true}
                  placeholder="Enter content"
                  value={form?.content}
                  onChangeText={(value: any) => handleChange("content", value)}
                  error={errors?.content}
                  height={"200"}
                  maxLength={2000}
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

export default CreateSchedule;
