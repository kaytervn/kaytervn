import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { remoteUrl } from "../types/constant";
import { ToastContainer, toast } from "react-toastify";
import { MailIcon, LockIcon } from "lucide-react";
import { useLoading } from "../hooks/useLoading";
import { AlertDialog, LoadingDialog } from "../components/Dialog";
import UTELogo from "../assets/ute_logo.png";
import ForgotPwLogo from "../assets/forgot-pw-page.png";
import { set } from "react-datepicker/dist/date_utils";

type FormFields = {
  email: string;
  otp: string;
  newPassword: string;
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormFields>({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormFields>({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const { isLoading, showLoading, hideLoading } = useLoading();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertSuccessVisible, setIsAlertSuccessVisible] = useState(false);

  const validate = (field: keyof FormFields, value: string) => {
    const newErrors = { ...errors };
    if (field === "email" && !value.trim()) {
      newErrors.email = "Email không được bỏ trống";
    } else if (field === "otp" && !value.trim()) {
      newErrors.otp = "OTP không được bỏ trống";
    } else if (field === "newPassword" && !value.trim()) {
      newErrors.newPassword = "Mật khẩu mới không được bỏ trống";
    } else if (field === "newPassword" && value.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    } else {
      newErrors[field] = "";
    }
    setErrors(newErrors);
  };

  const handleChange = (field: keyof FormFields, value: string) => {
    setForm({ ...form, [field]: value });
    validate(field, value);
  };

  const handleSubmitEmail = async () => {
    if (!form.email.trim()) {
      toast.error("Vui lòng nhập địa chỉ email");
      return;
    }

    showLoading();
    try {
      const response = await fetch(`${remoteUrl}/v1/user/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }
      setIsAlertVisible(true);
      setStep(2);
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      hideLoading();
    }
  };

  const handleResetPassword = async () => {
    if (!form.otp.trim() || !form.newPassword.trim()) {
      toast.error("Vui lòng nhập OTP và mật khẩu mới");
      return;
    }

    showLoading();
    try {
      const response = await fetch(`${remoteUrl}/v1/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          newPassword: form.newPassword,
          otp: form.otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Có lỗi xảy ra khi đặt lại mật khẩu.");
        return;
      }

      setIsAlertSuccessVisible(true);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      hideLoading();
    }
  };

  const handleResendOTP = () => {
    handleResetPassword();
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
          <img src={ForgotPwLogo} alt="Illustration" className="mb-4" />
        </div>
      </div>
      <div className="w-2/3 bg-white flex items-center justify-center p-8 rounded-s-3xl">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-3xl font-bold text-center mb-6">Quên mật khẩu</h2>
          {step === 1 && (
            <>
              <InputField
                title="Email"
                isRequire={true}
                placeholder="Nhập địa chỉ email"
                onChangeText={(value: string) => handleChange("email", value)}
                value={form.email}
                icon={MailIcon}
                error={errors.email}
              />
              <Button
                title="Gửi OTP"
                color="blue"
                onPress={handleSubmitEmail}
              />
            </>
          )}
          {step === 2 && (
            <>
              <InputField
                title="OTP"
                isRequire={true}
                placeholder="Nhập mã OTP"
                onChangeText={(value: string) => handleChange("otp", value)}
                value={form.otp}
                error={errors.otp}
              />
              <InputField
                title="Mật khẩu mới"
                isRequire={true}
                placeholder="Nhập mật khẩu mới"
                onChangeText={(value: string) =>
                  handleChange("newPassword", value)
                }
                value={form.newPassword}
                icon={LockIcon}
                secureTextEntry={!showNewPassword}
                togglePassword={() => setShowNewPassword(!showNewPassword)}
                showPassword={showNewPassword}
                error={errors.newPassword}
              />
              <Button
                title="Đặt lại mật khẩu"
                color="green"
                onPress={handleResetPassword}
              />
              <p className="text-center">
                Bạn chưa nhận được mã OTP?{" "}
                <button
                  onClick={handleResendOTP}
                  className="text-blue-500 hover:underline"
                >
                  Gửi lại OTP
                </button>
              </p>
            </>
          )}
        </div>
        <LoadingDialog isVisible={isLoading} />
        <AlertDialog
          isVisible={isAlertVisible}
          title="Thông báo"
          message="OTP đã được gửi đến email của bạn!"
          onAccept={() => {
            setIsAlertVisible(false);
            navigate(
              `/forgot-password?email=${encodeURIComponent(form.email)}`
            );
          }}
        />
        <AlertDialog
          isVisible={isAlertSuccessVisible}
          title="Thông báo"
          message="Mật khẩu đã được đặt lại thành công!"
          onAccept={() => {
            setIsAlertVisible(false);
            navigate(`/`);
          }}
        />
        <ToastContainer />
      </div>
    </div>
  );
};

export default ForgotPassword;
