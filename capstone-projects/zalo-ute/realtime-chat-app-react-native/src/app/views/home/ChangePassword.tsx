import React from "react";
import Intro from "@/src/components/Intro";
import InputField from "@/src/components/InputField";
import useForm from "../../hooks/useForm";
import Button from "@/src/components/Button";
import { KeyRoundIcon, LockIcon, ShieldCheckIcon } from "lucide-react-native";
import useDialog from "../../hooks/useDialog";
import { AlertDialog, LoadingDialog } from "@/src/components/Dialog";
import { useLoading } from "../../hooks/useLoading";
import { remoteUrl } from "@/src/types/constant";
import Toast from "react-native-toast-message";
import { errorToast } from "@/src/types/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangePassword = ({ navigation, route }: any) => {
  const { isLoading, showLoading, hideLoading } = useLoading();
  const { isDialogVisible, showDialog, hideDialog } = useDialog();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.currentPassword.trim()) {
      newErrors.currentPassword = "Mật khẩu hiện tại không được bỏ trống";
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
    { currentPassword: "", newPassword: "", confirmPassword: "" },
    { currentPassword: "", newPassword: "", confirmPassword: "" },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      showLoading();
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await fetch(`${remoteUrl}/v1/user/change-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: form.currentPassword,
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
    navigation.goBack();
  };
  return (
    <Intro
      onBack={() => navigation.goBack()}
      loading={<LoadingDialog isVisible={isLoading} />}
      color="royalblue"
      header="Thay đổi mật khẩu"
    >
      <InputField
        title="Mật khẩu hiện tại"
        isRequire={true}
        placeholder="Nhập mật khẩu hiện tại"
        onChangeText={(value: any) => handleChange("currentPassword", value)}
        value={form.currentPassword}
        icon={KeyRoundIcon}
        error={errors.currentPassword}
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

export default ChangePassword;
