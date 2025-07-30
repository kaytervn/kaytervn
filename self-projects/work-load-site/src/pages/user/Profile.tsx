/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
  USER_KIND_MAP,
} from "../../types/constant";
import Sidebar2 from "../../components/main/Sidebar2";
import { LoadingDialog } from "../../components/form/Dialog";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { ImageUploadField } from "../../components/form/OtherField";
import { InputField2 } from "../../components/form/InputTextField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { StaticSelectField } from "../../components/form/SelectTextField";

const Profile = () => {
  const navigate = useNavigate();
  const { setProfile, setToast } = useGlobalContext();
  const { user, loading } = useApi();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.fullName.trim()) {
      newErrors.fullName = "Invalid Name";
    }
    if (!form.oldPassword.trim()) {
      newErrors.oldPassword = "Invalid Password";
    }
    return newErrors;
  };

  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm({ avatarPath: "", fullName: "", oldPassword: "" }, validate);

  useEffect(() => {
    const fetchData = async () => {
      resetForm();
      const res = await user.profile();
      if (res.result) {
        const data = res.data;
        setForm({
          ...form,
          fullName: data.fullName,
          username: data.username,
          email: data.email,
          phone: data.phone,
          avatarPath: data.avatarPath,
          groupName: data.group?.name,
          kind: data.kind,
        });
      } else {
        navigate(PAGE_CONFIG.MSA_HOME.path);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!isValidForm()) {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
      return;
    }
    const res = await user.updateProfile(form);
    if (!res.result) {
      setToast(res.message, TOAST.ERROR);
      return;
    }
    const profile = await user.profile();
    if (profile.result) {
      handleChange("oldPassword", "");
      setProfile(profile.data);
      setToast(BASIC_MESSAGES.UPDATED, TOAST.SUCCESS);
    } else {
      setToast(profile.message, TOAST.ERROR);
    }
  };

  return (
    <Sidebar2
      breadcrumbs={[
        {
          label: PAGE_CONFIG.PROFILE.label,
        },
      ]}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.PROFILE.label}
            children={
              <div className="flex flex-col space-y-4">
                <ImageUploadField
                  title="Avatar"
                  value={form.avatarPath}
                  onChange={(value: any) => handleChange("avatarPath", value)}
                />
                <div className="flex flex-row space-x-2">
                  <InputField2
                    title="Full Name"
                    isRequired={true}
                    placeholder="Enter full name"
                    value={form.fullName}
                    onChangeText={(value: any) =>
                      handleChange("fullName", value)
                    }
                    error={errors.fullName}
                  />
                  <InputField2
                    disabled={true}
                    title="Username"
                    value={form.username}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField2
                    disabled={true}
                    title="Role"
                    value={form.groupName}
                  />
                  <StaticSelectField
                    title="Kind"
                    disabled={true}
                    dataMap={USER_KIND_MAP}
                    value={form.kind}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField2
                    title="Email"
                    disabled={true}
                    value={form.email}
                  />
                  <InputField2
                    isRequired={true}
                    title="Current Password"
                    placeholder="Enter current password"
                    value={form.oldPassword}
                    onChangeText={(value: any) =>
                      handleChange("oldPassword", value)
                    }
                    type="password"
                    error={errors.oldPassword}
                  />
                </div>
                <ActionSection
                  children={
                    <>
                      <CancelButton
                        text={BUTTON_TEXT.CANCEL}
                        onClick={() => navigate(PAGE_CONFIG.MSA_HOME.path)}
                      />
                      <SubmitButton
                        text={BUTTON_TEXT.UPDATE}
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

export default Profile;
