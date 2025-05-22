import InputField from "../InputField";
import { LockIcon, ShieldCheckIcon } from "lucide-react";

const ChangePassword = ({
  form,
  errors,
  handleChange,
  isChecked,
  setIsChecked,
}: any) => {
  const togglePassword = () => setIsChecked((prev: boolean) => !prev);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          className="flex items-center space-x-2 focus:outline-none"
          onClick={togglePassword}
        >
          <div
            className={`w-10 h-4 flex items-center rounded-full p-0.5 duration-300 ease-in-out ${
              isChecked ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${
                isChecked ? "translate-x-6" : ""
              }`}
            ></div>
          </div>
          <span className="text-base font-semibold text-gray-800">
            Đổi mật khẩu
          </span>
        </button>
      </div>
      {isChecked && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <InputField
            title="Mật khẩu hiện tại"
            isRequire={true}
            placeholder="Nhập mật khẩu hiện tại"
            onChangeText={(value: any) =>
              handleChange("currentPassword", value)
            }
            value={form.currentPassword}
            icon={LockIcon}
            error={errors.currentPassword}
            secureTextEntry={true}
          />
          <InputField
            title="Mật khẩu mới"
            isRequire={true}
            placeholder="Nhập mật khẩu mới"
            onChangeText={(value: any) => handleChange("newPassword", value)}
            value={form.newPassword}
            icon={LockIcon}
            error={errors.newPassword}
            secureTextEntry={true}
          />
          <InputField
            title="Xác nhận mật khẩu"
            isRequire={true}
            placeholder="Nhập mật khẩu xác nhận"
            onChangeText={(value: any) =>
              handleChange("confirmPassword", value)
            }
            value={form.confirmPassword}
            icon={ShieldCheckIcon}
            secureTextEntry={true}
            error={errors.confirmPassword}
          />
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
