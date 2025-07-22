import { useGlobalContext } from "../../components/config/GlobalProvider";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { LoadingDialog } from "../../components/form/Dialog";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import { ImageUploadField } from "../../components/form/OtherField";
import {
  SelectField2,
} from "../../components/form/SelectTextField";
import Sidebar2 from "../../components/main/Sidebar2";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import useQueryState from "../../hooks/useQueryState";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
  USER_KIND_MAP,
  VALID_PATTERN,
} from "../../types/constant";

const CreateUser = () => {
  const { setToast } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.USER.path,
  });
  const { user, loading } = useApi();
  const { role } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.fullName.trim()) {
      newErrors.fullName = "Invalid name";
    }
    if (!VALID_PATTERN.USERNAME.test(form.username)) {
      newErrors.username = "Invalid username";
    }
    if (!VALID_PATTERN.EMAIL.test(form.email)) {
      newErrors.email = "Invalid email";
    }
    if (!VALID_PATTERN.PASSWORD.test(form.password)) {
      newErrors.password = "Invalid password";
    }
    if (!form.groupId) {
      newErrors.groupId = "Invalid role";
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    {
      username: "",
      fullName: "",
      email: "",
      password: "",
      avatarPath: "",
      groupId: "",
      confirmPassword: "",
    },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await user.create(form);
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
          label: PAGE_CONFIG.USER.label,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.CREATE_USER.label,
        },
      ]}
      activeItem={PAGE_CONFIG.USER.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.CREATE_USER.label}
            children={
              <div className="flex flex-col space-y-4">
                <ImageUploadField
                  title="Avatar"
                  value={form.avatarPath}
                  onChange={(value: any) => handleChange("avatarPath", value)}
                />
                <div className="flex flex-row space-x-2">
                  <SelectField2
                    title="Role"
                    isRequired={true}
                    fetchListApi={role.autoComplete}
                    placeholder="Choose role"
                    value={form.groupId}
                    onChange={(value: any) => handleChange("groupId", value)}
                    error={errors.groupId}
                    queryParams={{
                      kind: USER_KIND_MAP.USER.value,
                    }}
                  />
                  <InputField2
                    title="Email"
                    isRequired={true}
                    placeholder="Enter email address"
                    value={form.email}
                    onChangeText={(value: any) => handleChange("email", value)}
                    error={errors.email}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField2
                    title="Full name"
                    isRequired={true}
                    placeholder="Enter full name"
                    value={form.fullName}
                    onChangeText={(value: any) =>
                      handleChange("fullName", value)
                    }
                    error={errors.fullName}
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
                    type="password"
                    error={errors.password}
                  />
                  <InputField2
                    title="Confirm password"
                    isRequired={true}
                    placeholder="Enter confirm password"
                    value={form.confirmPassword}
                    onChangeText={(value: any) =>
                      handleChange("confirmPassword", value)
                    }
                    type="password"
                    error={errors.confirmPassword}
                  />
                </div>
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

export default CreateUser;
