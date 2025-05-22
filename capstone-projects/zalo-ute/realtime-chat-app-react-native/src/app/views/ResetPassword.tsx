import React from "react";
import Intro from "@/src/components/Intro";
import InputField from "@/src/components/InputField";
import useForm from "../hooks/useForm";
import Button from "@/src/components/Button";
import { KeyRoundIcon, LockIcon, ShieldCheckIcon } from "lucide-react-native";
import useDialog from "../hooks/useDialog";
import { AlertDialog, LoadingDialog } from "@/src/components/Dialog";
import { useLoading } from "../hooks/useLoading";
import { remoteUrl } from "@/src/types/constant";
import Toast from "react-native-toast-message";
import { errorToast } from "@/src/types/toast";

const ResetPassword = ({ navigation, route }: any) => {
  const { isLoading, showLoading, hideLoading } = useLoading();
  const { isDialogVisible, showDialog, hideDialog } = useDialog();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.otp.trim()) {
      newErrors.otp = "Mã xác thực không được bỏ trống";
    }
    if (!form.newPassword) {
      newErrors.newPassword = "Mật khẩu mới không được bỏ trống";
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không được bỏ trống";
    } else if (form.confirmPassword !== form.newPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
    }
    return newErrors;
  };
  const { form, errors, handleChange, isValidForm } = useForm(
    { otp: "", newPassword: "", confirmPassword: "" },
    { otp: "", newPassword: "", confirmPassword: "" },
    validate
  );
  const handleSubmit = async () => {
    if (isValidForm()) {
      showLoading();
      try {
        const response = await fetch(`${remoteUrl}/v1/user/reset-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: route.params.email,
            otp: form.otp,
            newPassword: form.newPassword,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          showDialog();
        } else {
          Toast.show(errorToast(data.message));
        }
      } catch (error: any) {
        Toast.show(errorToast(error.message));
      } finally {
        hideLoading();
      }
    }
  };
  const handleOK = () => {
    hideDialog();
    navigation.navigate("Login");
  };
  return (
    <Intro
      loading={<LoadingDialog isVisible={isLoading} />}
      color="royalblue"
      header="Đặt lại mật khẩu"
      subHeader="Kiểm tra email của bạn để lấy mã OTP"
    >
      <InputField
        title="Mã xác thực"
        isRequire={true}
        placeholder="Nhập mã xác thực"
        onChangeText={(value: any) => handleChange("otp", value)}
        keyboardType="numeric"
        value={form.otp}
        icon={KeyRoundIcon}
        error={errors.otp}
      />
      <InputField
        title="Mật khẩu mới"
        isRequire={true}
        placeholder="Nhập mật khẩu mới"
        onChangeText={(value: any) => handleChange("newPassword", value)}
        value={form.newPassword}
        icon={LockIcon}
        secureTextEntry={true}
        error={errors.newPassword}
      />
      <InputField
        title="Xác nhận mật khẩu"
        isRequire={true}
        placeholder="Nhập mật khẩu xác nhận"
        onChangeText={(value: any) => handleChange("confirmPassword", value)}
        value={form.confirmPassword}
        icon={ShieldCheckIcon}
        secureTextEntry={true}
        error={errors.confirmPassword}
      />
      <Button title="XÁC NHẬN" color="royalblue" onPress={handleSubmit} />
      <AlertDialog
        isVisible={isDialogVisible}
        title="Thành công"
        color="green"
        message="Đặt lại mật khẩu mới thành công"
        onAccept={handleOK}
      />
    </Intro>
  );
};

export default ResetPassword;
