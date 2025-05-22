import Intro from "@/src/components/Intro";
import InputField from "@/src/components/InputField";
import useForm from "../hooks/useForm";
import { MailIcon } from "lucide-react-native";
import Button from "@/src/components/Button";
import { useLoading } from "../hooks/useLoading";
import { remoteUrl } from "@/src/types/constant";
import Toast from "react-native-toast-message";
import { errorToast } from "@/src/types/toast";
import { LoadingDialog } from "@/src/components/Dialog";

const ForgotPassword = ({ navigation }: any) => {
  const { isLoading, showLoading, hideLoading } = useLoading();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.email.trim()) {
      newErrors.email = "Email không được bỏ trống";
    }
    return newErrors;
  };
  const { form, errors, handleChange, isValidForm } = useForm(
    { email: "" },
    { email: "" },
    validate
  );
  const handleSubmit = async () => {
    if (isValidForm()) {
      showLoading();
      try {
        const response = await fetch(`${remoteUrl}/v1/user/forgot-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          navigation.navigate("ResetPassword", { email: form.email });
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
  return (
    <Intro
      loading={<LoadingDialog isVisible={isLoading} />}
      color="royalblue"
      onBack={() => navigation.goBack()}
      title="QUAY LẠI ĐĂNG NHẬP"
      header="Quên mật khẩu?"
      subHeader="Nhập địa chỉ email để lấy lại mật khẩu"
    >
      <InputField
        title="Địa chỉ email"
        isRequire={true}
        placeholder="Nhập địa chỉ email"
        onChangeText={(value: any) => handleChange("email", value)}
        keyboardType="email-address"
        value={form.email}
        icon={MailIcon}
        error={errors.email}
      />
      <Button title="TIẾP TỤC" color="royalblue" onPress={handleSubmit} />
    </Intro>
  );
};

export default ForgotPassword;
