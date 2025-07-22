import { useGlobalContext } from "../../components/config/GlobalProvider";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { LoadingDialog } from "../../components/form/Dialog";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import {
  SelectField2,
  StaticSelectField,
} from "../../components/form/SelectTextField";
import { TextAreaField2 } from "../../components/form/TextareaField";
import Sidebar2 from "../../components/main/Sidebar2";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import useQueryState from "../../hooks/useQueryState";
import { encryptFieldByUserKey } from "../../services/encryption/sessionEncryption";
import {
  ACCOUNT_KIND_MAP,
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
  VALID_PATTERN,
} from "../../types/constant";

const CreateAccount = () => {
  const { setToast, sessionKey } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.ACCOUNT.path,
    requireSessionKey: true,
  });
  const { account, loading } = useApi();
  const { platform } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.USERNAME.test(form.username)) {
      newErrors.username = "Invalid username";
    }
    if (!form.password.trim()) {
      newErrors.password = "Invalid password";
    }
    if (!form.platformId) {
      newErrors.platformId = "Invalid platform";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    {
      username: "",
      password: "",
      note: "",
      platformId: "",
      kind: ACCOUNT_KIND_MAP.ROOT.value,
    },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const password = encryptFieldByUserKey(sessionKey, form.password);
      const res = await account.create({ ...form, password });
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
          label: PAGE_CONFIG.ACCOUNT.label,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.CREATE_ACCOUNT.label,
        },
      ]}
      activeItem={PAGE_CONFIG.ACCOUNT.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.CREATE_ACCOUNT.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <SelectField2
                    title="Platform"
                    isRequired={true}
                    fetchListApi={platform.autoComplete}
                    placeholder="Choose platform"
                    value={form.platformId}
                    onChange={(value: any) => handleChange("platformId", value)}
                    error={errors.platformId}
                  />
                  <StaticSelectField
                    title="Kind"
                    disabled={true}
                    dataMap={ACCOUNT_KIND_MAP}
                    value={ACCOUNT_KIND_MAP.ROOT.value}
                  />
                </div>
                <div className="flex flex-row space-x-2">
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
                </div>
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

export default CreateAccount;
