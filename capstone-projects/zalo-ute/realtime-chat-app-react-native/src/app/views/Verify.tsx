import React from "react";
import { AlertDialog, LoadingDialog } from "@/src/components/Dialog";
import Intro from "@/src/components/Intro";
import InputField from "@/src/components/InputField";
import { KeyRoundIcon } from "lucide-react-native";
import Button from "@/src/components/Button";
import useForm from "../hooks/useForm";
import useDialog from "../hooks/useDialog";
import { useLoading } from "../hooks/useLoading";
import Toast from "react-native-toast-message";
import { remoteUrl } from "@/src/types/constant";
import { errorToast } from "@/src/types/toast";

const Verify = ({ navigation, route }: any) => {
  const { isLoading, showLoading, hideLoading } = useLoading();
  const { isDialogVisible, showDialog, hideDialog } = useDialog();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.otp.trim()) {
      newErrors.otp = "Mã OTP không được bỏ trống";
    }
    return newErrors;
  };
  const { form, errors, handleChange, isValidForm } = useForm(
    { otp: "" },
    { otp: "" },
    validate
  );
  const handleSubmit = async () => {
    if (isValidForm()) {
      showLoading();
      try {
        const response = await fetch(`${remoteUrl}/v1/user/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: route.params.email,
            otp: form.otp,
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
      header="Xác minh tài khoản"
      subHeader="Kiểm tra email của bạn để lấy mã OTP"
    >
      <InputField
        title="Mã OTP"
        isRequire={true}
        placeholder="Nhập mã OTP"
        onChangeText={(value: any) => handleChange("otp", value)}
        keyboardType="numeric"
        value={form.otp}
        icon={KeyRoundIcon}
        error={errors.otp}
      />
      <Button title="XÁC NHẬN" color="royalblue" onPress={handleSubmit} />
      <AlertDialog
        isVisible={isDialogVisible}
        title="Thành công"
        color="green"
        message="Xác minh tài khoản thành công"
        onAccept={handleOK}
      />
    </Intro>
  );
};

export default Verify;
