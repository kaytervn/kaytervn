import { useGlobalContext } from "../../components/config/GlobalProvider";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { LoadingDialog } from "../../components/form/Dialog";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import JsonListField from "../../components/form/json/JsonListField";
import { SelectField2 } from "../../components/form/SelectTextField";
import Sidebar2 from "../../components/main/Sidebar2";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import useQueryState from "../../hooks/useQueryState";
import { encryptFieldByUserKey } from "../../services/encryption/sessionEncryption";
import {
  BANK_PIN_FIELD_CONFIG,
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TAG_KIND_MAP,
  TOAST,
} from "../../types/constant";

const CreateBank = () => {
  const { setToast, sessionKey } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.BANK.path,
    requireSessionKey: true,
  });
  const { bank, loading } = useApi();
  const { tag } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.username.trim()) {
      newErrors.username = "Invalid Username";
    }
    if (!form.password.trim()) {
      newErrors.password = "Invalid Password";
    }
    if (!form.tagId) {
      newErrors.tagId = "Invalid Tag";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    {
      username: "",
      password: "",
      numbers: "[]",
      pins: "[]",
      tagId: "",
    },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const password = encryptFieldByUserKey(sessionKey, form.password);
      const pins = encryptFieldByUserKey(sessionKey, form.pins);
      const res = await bank.create({ ...form, password, pins });
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
          label: PAGE_CONFIG.BANK.label,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.CREATE_BANK.label,
        },
      ]}
      activeItem={PAGE_CONFIG.BANK.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.CREATE_BANK.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <SelectField2
                    title="Tag"
                    fetchListApi={tag.autoComplete}
                    placeholder="Choose tag"
                    value={form.tagId}
                    onChange={(value: any) => handleChange("tagId", value)}
                    error={errors.tagId}
                    colorCodeField="color"
                    queryParams={{ kind: TAG_KIND_MAP.BANK.value }}
                    isRequired={true}
                  />
                  <InputField2
                    title="Username"
                    isRequired={true}
                    placeholder="Enter username"
                    value={form.username}
                    onChangeText={(value: any) =>
                      handleChange("username", value)
                    }
                    error={errors.username}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField2
                    title="Password"
                    isRequired={true}
                    placeholder="Enter password"
                    value={form.password}
                    onChangeText={(value: any) =>
                      handleChange("password", value)
                    }
                    error={errors.password}
                    type="password"
                  />
                  <JsonListField
                    title="Pin(s)"
                    value={form?.pins}
                    onChange={(value: any) => handleChange("pins", value)}
                    fieldConfig={BANK_PIN_FIELD_CONFIG}
                  />
                </div>
                <JsonListField
                  title="Number(s)"
                  value={form?.numbers}
                  onChange={(value: any) => handleChange("numbers", value)}
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

export default CreateBank;
