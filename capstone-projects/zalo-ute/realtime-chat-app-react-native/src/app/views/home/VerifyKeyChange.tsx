import React, { useEffect } from "react";
import useForm from "../../hooks/useForm";
import {
  EmailPattern,
  PhonePattern,
  StudentIdPattern,
} from "@/src/types/constant";
import useDialog from "../../hooks/useDialog";
import useFetch from "../../hooks/useFetch";
import Toast from "react-native-toast-message";
import { errorToast } from "@/src/types/toast";
import Intro from "@/src/components/Intro";
import { AlertDialog, LoadingDialog } from "@/src/components/Dialog";
import InputField from "@/src/components/InputField";
import {
  IdCard,
  IdCardIcon,
  KeyRoundIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react-native";
import Button from "@/src/components/Button";

const VerifyKeyChange = ({ navigation }: any) => {
  const { isDialogVisible, showDialog, hideDialog } = useDialog();
  const { get, post, loading } = useFetch();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.otp.trim()) {
      newErrors.otp = "Mã xác thực không được bỏ trống";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email không được bỏ trống";
    } else if (!EmailPattern.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Số điện thoại không được bỏ trống";
    } else if (!PhonePattern.test(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!form.studentId.trim()) {
      newErrors.studentId = "Mã sinh viên không được bỏ trống";
    } else if (!StudentIdPattern.test(form.studentId)) {
      newErrors.studentId = "Mã sinh viên không hợp lệ";
    }
    return newErrors;
  };
  const { form, errors, setForm, handleChange, isValidForm } = useForm(
    { otp: "", email: "", phone: "", studentId: "" },
    {},
    validate
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await get("/v1/user/profile");
      setForm({
        ...form,
        email: res.data.email,
        phone: res.data.phone,
        studentId: res.data.studentId,
      });
    };
    fetchData();
  }, []);
  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await post(`/v1/user/verify-key-change`, form);
      if (res.result) {
        showDialog();
      } else {
        Toast.show(errorToast(res.message));
      }
    } else {
      Toast.show(errorToast("Vui lòng kiểm tra lại thông tin"));
    }
  };
  const handleOK = () => {
    hideDialog();
    navigation.navigate("Home");
  };
  return (
    <Intro
      loading={<LoadingDialog isVisible={loading} />}
      color="royalblue"
      onBack={() => navigation.goBack()}
      title="CẬP NHẬT THÔNG TIN"
      header="Xác nhận cập nhật"
      subHeader="Xác nhận cập nhật thông tin đăng nhập mới"
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
        title="Mã xác thực"
        isRequire={true}
        placeholder="Nhập mã xác thực"
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
        message="Cập nhật thông tin đăng nhập thành công"
        onAccept={handleOK}
      />
    </Intro>
  );
};

export default VerifyKeyChange;
