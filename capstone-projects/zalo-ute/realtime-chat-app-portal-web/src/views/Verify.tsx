import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { remoteUrl } from "../types/constant";
import UTELogo from "../assets/ute_logo.png";
import VerifyLogo from "../assets/otp-page.png";
import { useLoading } from "../hooks/useLoading";
import { LoadingDialog } from "../components/Dialog";

interface OTPInputProps {
  value: string;
  onChange: (newValue: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ value, onChange }) => {
  const inputRefs = Array(6)
    .fill(0)
    .map(() => React.createRef<HTMLInputElement>());

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value;
    if (val.length <= 1) {
      const newValue = value.split("");
      newValue[index] = val;
      onChange(newValue.join(""));
      if (val && index < 5) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  return (
    <div className="flex justify-between mb-4">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value[index] || ""}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        ))}
    </div>
  );
};

const Verify: React.FC = () => {
  const { isLoading, showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailFromParams = queryParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
    } else {
      toast.error("Không tìm thấy email. Vui lòng đăng ký lại.");
      navigate("/register");
    }
  }, [location, navigate]);

  const handleVerify = async () => {
    try {
      showLoading();
      const response = await fetch(`${remoteUrl}/v1/user/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }
      hideLoading();
      toast.success("Xác thực thành công! Hãy đăng nhập.", {
        onClose: () => {
          navigate("/");
        },
        autoClose: 2000,
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleResendOTP = () => {
    handleVerify();
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
          <img src={VerifyLogo} alt="Illustration" className="mb-4" />
        </div>
      </div>
      <div className="w-2/3 bg-white flex items-center justify-center p-8 rounded-s-3xl">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-center mb-6">Xác thực OTP</h2>
          <p className="text-center mb-6">
            Vui lòng nhập mã OTP được gửi qua email{" "}
            {email.replace(/(.{3})(.*)(?=@)/, "$1***")}
          </p>
          <OTPInput value={otp} onChange={setOtp} />
          <button
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 mb-4"
            onClick={handleVerify}
          >
            Xác thực
          </button>
          <p className="text-center">
            Bạn chưa nhận được mã OTP?{" "}
            <button
              onClick={handleResendOTP}
              className="text-blue-500 hover:underline"
            >
              Gửi lại OTP
            </button>
          </p>
        </div>
      </div>
      <ToastContainer />
      <LoadingDialog isVisible={isLoading} />
    </div>
  );
};

export default Verify;
