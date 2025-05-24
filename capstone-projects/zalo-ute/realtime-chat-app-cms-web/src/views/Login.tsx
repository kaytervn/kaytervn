import { LockIcon, UserCircleIcon } from "lucide-react";
import InputField from "../components/InputField";
import { useState } from "react";
import useForm from "../hooks/useForm";
import { ToastContainer, toast } from "react-toastify";
import Button from "../components/Button";
import { LoadingDialog } from "../components/Dialog";
import useFetch from "../hooks/useFetch";
import { ZALO_UTE_CMS_ACCESS_TOKEN } from "../types/constant";

const Login = () => {
  const { post, loading } = useFetch();
  const [showPassword, setShowPassword] = useState(false);

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.username.trim()) {
      newErrors.username = "Tài khoản không được bỏ trống";
    }
    if (!form.password) {
      newErrors.password = "Mật khẩu không được bỏ trống";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    { username: "", password: "" },
    { username: "", password: "" },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await post("/v1/user/login-admin", form);
      if (res.result) {
        await localStorage.setItem(
          ZALO_UTE_CMS_ACCESS_TOKEN,
          res.data.accessToken
        );
        toast.success("Đăng nhập thành công");
        window.location.reload();
      } else {
        toast.error(res.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
        <InputField
          title="Tài khoản đăng nhập"
          isRequire={true}
          placeholder="Nhập email, SĐT hoặc MSSV"
          onChangeText={(value: any) => handleChange("username", value)}
          value={form.username}
          icon={UserCircleIcon}
          error={errors.username}
        />
        <InputField
          title="Mật khẩu"
          isRequire={true}
          placeholder="Nhập mật khẩu"
          onChangeText={(value: any) => handleChange("password", value)}
          value={form.password}
          icon={LockIcon}
          secureTextEntry={!showPassword}
          togglePassword={() => setShowPassword(!showPassword)}
          showPassword={showPassword}
          error={errors.password}
        />
        <Button title="ĐĂNG NHẬP" color="royalblue" onPress={handleSubmit} />
      </div>
      <LoadingDialog isVisible={loading} />
      <ToastContainer />
    </div>
  );
};

export default Login;
