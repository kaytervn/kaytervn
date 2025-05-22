import React from "react";
import {
  LockIcon,
  MailIcon,
  PhoneIcon,
  IdCardIcon,
  Loader,
} from "lucide-react";
import InputField from "../InputField";

interface VerificationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
  sensitiveFieldToEdit: string | null;
  tempSensitiveValue: string;
  setTempSensitiveValue: (value: string) => void;
  verificationForm: {
    currentPassword: string;
  };
  handleVerificationChange: (field: string, value: any) => void;
  verificationErrors: {
    currentPassword?: string;
  };
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  loading,
  error,
  sensitiveFieldToEdit,
  tempSensitiveValue,
  setTempSensitiveValue,
  verificationForm,
  handleVerificationChange,
  verificationErrors,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-96 p-6 relative">
        <h3 className="text-xl font-bold mb-4">Xác thực mật khẩu</h3>
        <p className="mb-4 text-gray-600">
          Để thay đổi thông tin này, vui lòng nhập mật khẩu của bạn
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <InputField
          title="Mật khẩu hiện tại"
          isRequire={true}
          placeholder="Nhập mật khẩu"
          onChangeText={(value: any) =>
            handleVerificationChange("currentPassword", value)
          }
          value={verificationForm.currentPassword}
          icon={LockIcon}
          error={verificationErrors.currentPassword}
          secureTextEntry={true}
        />

        <InputField
          title={`${
            sensitiveFieldToEdit === "email"
              ? "Email"
              : sensitiveFieldToEdit === "phone"
              ? "Số điện thoại"
              : "MSSV"
          } mới`}
          isRequire={true}
          placeholder={`Nhập ${sensitiveFieldToEdit} mới`}
          onChangeText={setTempSensitiveValue}
          value={tempSensitiveValue}
          icon={
            sensitiveFieldToEdit === "email"
              ? MailIcon
              : sensitiveFieldToEdit === "phone"
              ? PhoneIcon
              : IdCardIcon
          }
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
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              "Gửi mã OTP"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
