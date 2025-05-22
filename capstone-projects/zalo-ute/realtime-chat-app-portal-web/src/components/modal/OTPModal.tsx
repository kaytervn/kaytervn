import React from "react";
import { Loader } from "lucide-react";
import InputField from "../InputField";

interface OTPModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
  sensitiveFieldToEdit: string | null;
  tempSensitiveValue: string;
  form: {
    email: string;
  };
  otpForm: {
    otp: string;
  };
  handleOTPChange: (field: string, value: any) => void;
  otpErrors: {
    otp?: string;
  };
}

const OTPModal: React.FC<OTPModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  loading,
  error,
  sensitiveFieldToEdit,
  tempSensitiveValue,
  form,
  otpForm,
  handleOTPChange,
  otpErrors,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-96 p-6 relative">
        <h3 className="text-xl font-bold mb-4">Xác thực OTP</h3>
        <p className="mb-4 text-gray-600">
          {sensitiveFieldToEdit === "email"
            ? `Vui lòng nhập mã OTP đã được gửi đến email mới: ${tempSensitiveValue}`
            : `Vui lòng nhập mã OTP đã được gửi đến email hiện tại: ${form.email}`}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <InputField
          title="Mã OTP"
          isRequire={true}
          placeholder="Nhập mã OTP"
          onChangeText={(value: any) => handleOTPChange("otp", value)}
          value={otpForm.otp}
          error={otpErrors.otp}
        />

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
