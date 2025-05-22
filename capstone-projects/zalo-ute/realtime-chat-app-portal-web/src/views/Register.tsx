import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { EmailPattern, PhonePattern, remoteUrl } from "../types/constant";
import { ToastContainer, toast } from "react-toastify";
import {
  LockIcon,
  MailIcon,
  PhoneIcon,
  ContactIcon,
  IdCardIcon,
} from "lucide-react";
import UTELogo from "../assets/ute_logo.png";
import RegisterPageLogo from "../assets/registerpage.png";
import { useLoading } from "../hooks/useLoading";
import { AlertDialog, LoadingDialog } from "../components/Dialog";
import { set } from "react-datepicker/dist/date_utils";

const Register = () => {
  const { isLoading, showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    phone: "",
    studentId: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    displayName: "",
    email: "",
    phone: "",
    studentId: "",
    password: "",
    confirmPassword: "",
  });

  const validate = (field: string, value: string) => {
    const newErrors = { ...errors };

    if (field === "email") {
      if (!value.trim()) {
        newErrors.email = "Email không được bỏ trống";
      } else if (!EmailPattern.test(value)) {
        newErrors.email = "Email không hợp lệ";
      } else {
        newErrors.email = "";
      }
    }

    if (field === "studentId") {
      if (!value.trim()) {
        newErrors.studentId = "Mã số sinh viên không được bỏ trống";
      } else {
        newErrors.studentId = "";
      }
    }

    if (field === "displayName") {
      if (!value.trim()) {
        newErrors.displayName = "Tên hiển thị không được bỏ trống";
      } else {
        newErrors.displayName = "";
      }
    }

    if (field === "phone") {
      if (!value.trim()) {
        newErrors.phone = "Số điện thoại không được bỏ trống";
      } else if (!PhonePattern.test(value)) {
        newErrors.phone = "Số điện thoại không hợp lệ";
      } else {
        newErrors.phone = "";
      }
    }

    if (field === "password") {
      if (!value.trim()) {
        newErrors.password = "Mật khẩu không được bỏ trống";
      } else if (value.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      } else {
        newErrors.password = "";
      }
    }

    if (field === "confirmPassword") {
      if (!value.trim()) {
        newErrors.confirmPassword = "Xác nhận mật khẩu không được bỏ trống";
      } else {
        newErrors.confirmPassword = "";
      }
    }

    setErrors(newErrors);
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    validate(field, value);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    Object.keys(form).forEach((field) => {
      if (!form[field as keyof typeof form].trim()) {
        newErrors[field as keyof typeof errors] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } không được bỏ trống`;
        isValid = false;
      } else {
        newErrors[field as keyof typeof errors] = "";
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    try {
      showLoading();
      const { confirmPassword, ...dataToSend } = form;

      const response = await fetch(`${remoteUrl}/v1/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        return;
      }

      setIsAlertVisible(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="min-h-screen flex bg-blue-500">
      <div className="w-1/3 flex items-center justify-center p-8">
        <div className="text-white">
          <img
            src={UTELogo}
            alt="UTE Zalo logo"
            className="w-full md:w-1/4 lg:w-1/6 mb-4"
          />
          <h1 className="text-4xl font-bold mb-4">UTE Zalo</h1>
          <img src={RegisterPageLogo} alt="Illustration" className="mb-4" />
        </div>
      </div>
      <div className="w-2/3 bg-white flex items-center justify-center p-8 rounded-s-3xl">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-center mb-6">
            Đăng ký tài khoản
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <InputField
            title="Email"
            isRequire={true}
            placeholder="Nhập địa chỉ email"
            onChangeText={(value: any) => handleChange("email", value)}
            value={form.email}
            icon={MailIcon}
            error={errors.email}
          />
          <InputField
            title="MSSV"
            isRequire={true}
            placeholder="Nhập mã số sinh viên"
            onChangeText={(value: any) => handleChange("studentId", value)}
            value={form.studentId}
            icon={IdCardIcon}
            error={errors.studentId}
          />

          <InputField
            title="Số điện thoại của bạn"
            isRequire={true}
            placeholder="Nhập số điện thoại"
            onChangeText={(value: any) => handleChange("phone", value)}
            icon={PhoneIcon}
            value={form.phone}
            error={errors.phone}
          />

          <InputField
            title="Tên của bạn"
            isRequire={true}
            placeholder="Nhập tên hiển thị"
            onChangeText={(value: any) => handleChange("displayName", value)}
            value={form.displayName}
            icon={ContactIcon}
            error={errors.displayName}
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
            placeholder="Nhập lại mật khẩu"
            onChangeText={(value: any) =>
              handleChange("confirmPassword", value)
            }
            value={form.confirmPassword}
            icon={LockIcon}
            secureTextEntry={true}
            error={errors.confirmPassword}
          />

          <Button
            title="Đăng ký tài khoản"
            color="royalblue"
            onPress={handleRegister}
          />
          <p className="mt-4 text-center">
            Bạn đã có tài khoản?{" "}
            <a href="/" className="text-blue-500 hover:underline">
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
      <ToastContainer />
      <LoadingDialog isVisible={isLoading} />
      <AlertDialog
        isVisible={isAlertVisible}
        title="Thông báo"
        message="Mã OTP đã được gửi đến email của bạn!"
        onAccept={() => {
          setIsAlertVisible(false);
          navigate(`/verify?email=${encodeURIComponent(form.email)}`);
        }}
      />
    </div>
  );
};

export default Register;
