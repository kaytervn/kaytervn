import Button from "@/src/components/Button";
import { LoadingDialog } from "@/src/components/Dialog";
import InputField from "@/src/components/InputField";
import Intro from "@/src/components/Intro";
import { EmailPattern, remoteUrl } from "@/src/types/constant";
import { LockIcon, MailIcon } from "lucide-react-native";
import React from "react";
import useForm from "../../hooks/useForm";
import useFetch from "../../hooks/useFetch";
import Toast from "react-native-toast-message";
import { errorToast } from "@/src/types/toast";

const RequestKeyChange = ({ navigation }: any) => {
  const { post, loading } = useFetch();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.email.trim()) {
      newErrors.email = "Email không được bỏ trống";
    } else if (!EmailPattern.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!form.password.trim()) {
      newErrors.password = "Mật khẩu không được bỏ trống";
    }
    return newErrors;
  };
  const { form, errors, handleChange, isValidForm } = useForm(
    { email: "", password: "" },
    {},
    validate
  );
  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await post(`/v1/user/request-key-change`, form);
      if (res.result) {
        navigation.navigate("VerifyKeyChange");
      } else {
        Toast.show(errorToast(res.message));
      }
    } else {
      Toast.show(errorToast("Vui lòng kiểm tra lại thông tin"));
    }
  };
  return (
    <Intro
      loading={<LoadingDialog isVisible={loading} />}
      color="royalblue"
      onBack={() => navigation.goBack()}
      title="GỬI YÊU CẦU CẬP NHẬT"
      header="Cập thật thông tin"
      subHeader="Nhập địa chỉ email bất kỳ bạn đang sử dụng"
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

      <InputField
        title="Mật khẩu hiện tại"
        isRequire={true}
        placeholder="Nhập mật khẩu hiện tại"
        onChangeText={(value: any) => handleChange("password", value)}
        value={form.password}
        icon={LockIcon}
        secureTextEntry={true}
        error={errors.password}
      />
      <Button title="TIẾP TỤC" color="royalblue" onPress={handleSubmit} />
    </Intro>
  );
};

export default RequestKeyChange;
