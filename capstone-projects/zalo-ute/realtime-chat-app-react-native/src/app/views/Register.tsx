import InputField from "@/src/components/InputField";
import {
  LockIcon,
  MailIcon,
  ShieldCheckIcon,
  CircleUserRoundIcon,
  PhoneIcon,
  IdCardIcon,
} from "lucide-react-native";
import Button from "@/src/components/Button";
import {
  EmailPattern,
  PhonePattern,
  remoteUrl,
  StudentIdPattern,
} from "@/src/types/constant";
import Intro from "@/src/components/Intro";
import useForm from "../hooks/useForm";
import Toast from "react-native-toast-message";
import { errorToast, successToast } from "@/src/types/toast";
import { LoadingDialog } from "@/src/components/Dialog";
import { useLoading } from "../hooks/useLoading";

const Register = ({ navigation }: any) => {
  const { isLoading, showLoading, hideLoading } = useLoading();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.displayName.trim()) {
      newErrors.displayName = "Tên hiển thị không được bỏ trống";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email không được bỏ trống";
    } else if (!EmailPattern.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!form.phone) {
      newErrors.phone = "Số điện thoại không được bỏ trống";
    } else if (!PhonePattern.test(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!form.studentId.trim()) {
      newErrors.studentId = "Mã sinh viên không được bỏ trống";
    } else if (!StudentIdPattern.test(form.studentId)) {
      newErrors.studentId = "Mã sinh viên không hợp lệ";
    }
    if (!form.password) {
      newErrors.password = "Mật khẩu không được bỏ trống";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không được bỏ trống";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    {
      displayName: "",
      email: "",
      phone: "",
      studentId: "",
      password: "",
      confirmPassword: "",
    },
    {},
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      showLoading();
      try {
        const response = await fetch(`${remoteUrl}/v1/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            displayName: form.displayName,
            email: form.email,
            studentId: form.studentId,
            password: form.password,
            phone: form.phone,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          Toast.show(successToast("Đăng ký thành công"));
          navigation.navigate("Verify", { email: form.email });
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
      header="Tạo tài khoản"
      subHeader="Mừng thành viên mới!"
    >
      <InputField
        title="Tên hiển thị"
        isRequire={true}
        placeholder="Nhập tên hiển thị"
        onChangeText={(value: any) => handleChange("displayName", value)}
        value={form.displayName}
        icon={CircleUserRoundIcon}
        error={errors.displayName}
      />
      <InputField
        title="Email đăng ký"
        isRequire={true}
        placeholder="Nhập địa chỉ email"
        onChangeText={(value: any) => handleChange("email", value)}
        keyboardType="email-address"
        value={form.email}
        icon={MailIcon}
        error={errors.email}
      />
      <InputField
        title="Số điện thoại"
        isRequire={true}
        placeholder="Nhập số điện thoại"
        onChangeText={(value: any) => handleChange("phone", value)}
        keyboardType="numeric"
        value={form.phone}
        icon={PhoneIcon}
        error={errors.phone}
      />
      <InputField
        title="Mã sinh viên"
        isRequire={true}
        placeholder="Nhập mã sinh viên"
        onChangeText={(value: any) => handleChange("studentId", value)}
        keyboardType="numeric"
        value={form.studentId}
        icon={IdCardIcon}
        error={errors.studentId}
      />
      <InputField
        title="Mật khẩu"
        isRequire={true}
        placeholder="Nhập mật khẩu"
        onChangeText={(value: any) => handleChange("password", value)}
        value={form.password}
        icon={LockIcon}
        secureTextEntry={true}
        error={errors.password}
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
      <Button title="ĐĂNG KÝ" color="royalblue" onPress={handleSubmit} />
    </Intro>
  );
};

export default Register;
