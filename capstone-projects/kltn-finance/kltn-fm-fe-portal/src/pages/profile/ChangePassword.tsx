import { useEffect } from "react";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
  VALID_PATTERN,
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { InputField } from "../../components/form/InputField";
import { SubmitButton } from "../../components/form/Button";
import { LoadingDialog } from "../../components/page/Dialog";
import { useGlobalContext } from "../../components/config/GlobalProvider";

const ChangePassword = () => {
  const { setToast } = useGlobalContext();
  const { auth, loading } = useApi();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.PASSWORD.test(form.oldPassword)) {
      newErrors.oldPassword = "Mật khẩu không hợp lệ";
    }
    if (!VALID_PATTERN.PASSWORD.test(form.newPassword)) {
      newErrors.newPassword = "Mật khẩu không hợp lệ";
    }
    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
    }
    return newErrors;
  };

  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    { oldPassword: "", newPassword: "", confirmPassword: "" },
    validate
  );

  useEffect(() => {
    resetForm();
  }, []);

  const handleSubmit = async () => {
    if (!isValidForm()) {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
      return;
    }
    const res = await auth.changePassword(form);
    if (!res.result) {
      setToast(res.message, TOAST.ERROR);
      return;
    }
    resetForm();
    setToast(BASIC_MESSAGES.UPDATED);
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: PAGE_CONFIG.CHANGE_PASSWORD.label,
        },
      ]}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.CHANGE_PASSWORD.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <InputField
                    isRequired={true}
                    title="Mật khẩu hiện tại"
                    placeholder="Nhập mật khẩu hiện tại"
                    value={form.oldPassword}
                    onChangeText={(value: any) =>
                      handleChange("oldPassword", value)
                    }
                    type="password"
                    error={errors.oldPassword}
                  />
                  <span className="flex-1" />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField
                    isRequired={true}
                    title="Mật khẩu mới"
                    placeholder="Nhập mật khẩu mới"
                    value={form.newPassword}
                    onChangeText={(value: any) =>
                      handleChange("newPassword", value)
                    }
                    type="password"
                    error={errors.newPassword}
                  />
                  <InputField
                    isRequired={true}
                    title="Mật khẩu xác nhận"
                    placeholder="Nhập mật khẩu xác nhận"
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

export default ChangePassword;
