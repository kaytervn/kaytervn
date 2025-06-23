import { SubmitButton } from "../../components/form/Button";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { InputField } from "../../components/form/InputField";
import { ImageUploadField } from "../../components/form/OtherField";
import { LoadingDialog } from "../../components/page/Dialog";
import Sidebar from "../../components/page/Sidebar";
import { PAGE_CONFIG } from "../../components/PageConfig";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
  VALID_PATTERN,
} from "../../services/constant";
import { useEffect } from "react";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import { useGlobalContext } from "../../components/GlobalProvider";

const Profile = () => {
  const { setProfile, setToast } = useGlobalContext();
  const { auth, loading } = useApi();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.NAME.test(form.fullName)) {
      newErrors.fullName = "Họ và tên không hợp lệ";
    }
    if (!VALID_PATTERN.PASSWORD.test(form.oldPassword)) {
      newErrors.oldPassword = "Mật khẩu không hợp lệ";
    }
    return newErrors;
  };

  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm({ avatarPath: "", fullName: "", oldPassword: "" }, validate);

  useEffect(() => {
    const fetchData = async () => {
      resetForm();
      const res = await auth.profile();
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
        });
      } else {
        window.location.href = "/";
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!isValidForm()) {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
      return;
    }
    const res = await auth.updateProfile(form);
    if (!res.result) {
      setToast(res.message, TOAST.ERROR);
      return;
    }
    const profile = await auth.profile();
    if (profile.result) {
      setProfile(profile.data);
      setToast(BASIC_MESSAGES.UPDATED, TOAST.SUCCESS);
    } else {
      setToast(profile.message, TOAST.ERROR);
    }
  };

  return (
    <Sidebar
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
                  title="Ảnh đại diện"
                  value={form.avatarPath}
                  onChange={(value: any) => handleChange("avatarPath", value)}
                />
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Họ và tên"
                    isRequired={true}
                    placeholder="Nhập họ và tên"
                    value={form.fullName}
                    onChangeText={(value: any) =>
                      handleChange("fullName", value)
                    }
                    error={errors.fullName}
                  />
                  <InputField
                    disabled={true}
                    title="Tên tài khoản"
                    isRequired={true}
                    value={form.username}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Địa chỉ email"
                    disabled={true}
                    isRequired={true}
                    value={form.email}
                  />
                  <InputField
                    title="Số điện thoại"
                    disabled={true}
                    isRequired={true}
                    value={form.phone}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField
                    disabled={true}
                    title="Vai trò"
                    isRequired={true}
                    value={form.groupName}
                  />
                  <InputField
                    isRequired={true}
                    title="Mật khẩu hiện tại"
                    placeholder="Nhập mật khẩu"
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
