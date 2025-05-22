import React, { useState, useEffect, useRef } from "react";
import { EmailPattern, remoteUrl } from "../../types/constant";
import UserIcon from "../../assets/user_icon.png";
import {
  X,
  Loader,
  CircleUserRoundIcon,
  MailIcon,
  InfoIcon,
  CameraIcon,
  PhoneIcon,
  IdCardIcon,
  LockIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { AlertDialog } from "../Dialog";
import InputField from "../InputField";
import useForm from "../../hooks/useForm";
import { getDate, uploadImage } from "../../types/utils";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import VerificationModal from "./VerificationModal";
import OTPModal from "./OTPModal";
import DatePickerField from "../DatePickerField";

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  onOpenProfileModal: () => void;
}

interface OTPVerificationFormData {
  otp: string;
}
interface ProfileFormData {
  displayName: string;
  email: string;
  phone: string;
  bio: string;
  studentId: string;
  avatarUrl: string;
  birthDate: string | null;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface VerificationFormData {
  currentPassword: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isVisible,
  onClose,
  onOpenProfileModal,
}) => {
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [sensitiveFieldToEdit, setSensitiveFieldToEdit] = useState<
    string | null
  >(null);
  const [tempSensitiveValue, setTempSensitiveValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [errorOTP, setErrorOTP] = useState<string | null>(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertLoginVisible, setIsAlertLoginVisible] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { post } = useFetch();
  const [showOTPModal, setShowOTPModal] = useState(false);
  // const [otpSent, setOtpSent] = useState(false);

  const {
    form: otpForm,
    handleChange: handleOTPChange,
    errors: otpErrors,
    isValidForm: isValidOTPForm,
  } = useForm({ otp: "" }, {}, (form: OTPVerificationFormData) => {
    const errors: any = {};
    if (!form.otp) errors.otp = "Vui lòng nhập mã OTP";
    return errors;
  });

  const validateProfile = (form: ProfileFormData) => {
    const newErrors: any = {};
    if (!form.displayName)
      newErrors.displayName = "Tên hiển thị không được bỏ trống";

    if (showPasswordFields) {
      if (!form.currentPassword) {
        newErrors.currentPassword = "Mật khẩu hiện tại không được bỏ trống";
      }
      if (!form.newPassword) {
        newErrors.newPassword = "Mật khẩu mới không được bỏ trống";
      } else if (form.newPassword.length < 6) {
        newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
      }
      if (!form.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không được bỏ trống";
      } else if (form.confirmPassword !== form.newPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
      }
    }

    return newErrors;
  };

  const validateVerification = (form: VerificationFormData) => {
    const newErrors: any = {};
    if (!form.currentPassword)
      newErrors.currentPassword = "Mật khẩu không được bỏ trống";
    return newErrors;
  };

  const { form, setForm, errors, handleChange, isValidForm } = useForm(
    {
      displayName: "",
      bio: "",
      birthDate: "",
      avatarUrl: "",
      email: "",
      phone: "",
      studentId: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    {},
    validateProfile
  );

  const {
    form: verificationForm,
    handleChange: handleVerificationChange,
    errors: verificationErrors,
    isValidForm: isValidVerificationForm,
  } = useForm({ currentPassword: "" }, {}, validateVerification);

  useEffect(() => {
    if (isVisible) {
      fetchCurrentProfile();
      console.log("Fetch current profile", form);
    }
  }, [isVisible]);

  const handleCancel = () => {
    onClose();
    onOpenProfileModal();
  };

  const fetchCurrentProfile = async () => {
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${remoteUrl}/v1/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }
      const data = await response.json();
      setForm({
        ...data.data,
        birthDate: data.data.birthDate ? getDate(data.data.birthDate) : null,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      console.log("Fetch current profile", form);
    } catch (error) {
      setError("Lỗi khi tải thông tin người dùng");
    }
  };

  const handleSensitiveFieldClick = async (fieldName: string) => {
    setSensitiveFieldToEdit(fieldName);
    setTempSensitiveValue(form[fieldName as keyof ProfileFormData] as string);
    setShowVerificationModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidForm()) return;

    setLoading(true);
    setError(null);
    try {
      if (image) {
        form.avatarUrl = await uploadImage(image, post);
      }

      // console.log("Form", form.avatarUrl);
      let dataToSend = {
        ...form,
        birthDate: form.birthDate ? `${form.birthDate} 07:00:00` : null,
      };

      if (showPasswordFields) {
        dataToSend = {
          ...dataToSend,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        };
      }

      delete dataToSend.confirmPassword;

      console.log("Data to send", dataToSend);
      const response = await fetch(`${remoteUrl}/v1/user/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }

      if (showPasswordFields) {
        setIsAlertLoginVisible(true);
      }
      setIsAlertVisible(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setErrorOTP(null);

      let requestBody: {
        email: string;
        password: string;
      };

      // TH: Đổi email
      if (sensitiveFieldToEdit === "email") {
        if (!tempSensitiveValue) {
          throw new Error("Email mới không được để trống!");
        }

        requestBody = {
          email: tempSensitiveValue,
          password: verificationForm.currentPassword,
        };
      } else {
        if (!form.email) {
          throw new Error("Email hiện tại không được để trống!");
        }

        requestBody = {
          email: form.email,
          password: verificationForm.currentPassword,
        };
      }

      console.log("Request body", requestBody);

      const response = await fetch(`${remoteUrl}/v1/user/request-key-change`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorOTP(data.message);
        return;
      }

      // setOtpSent(true);
      setErrorOTP(null);
      setShowVerificationModal(false);
      setShowOTPModal(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!isValidOTPForm()) return;
    try {
      setLoading(true);
      const response = await fetch(`${remoteUrl}/v1/user/verify-key-change`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          [sensitiveFieldToEdit as string]: tempSensitiveValue,
          otp: otpForm.otp,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorOTP(data.message);
        return;
      }

      setForm((prev: any) => ({
        ...prev,
        [sensitiveFieldToEdit as string]: tempSensitiveValue,
      }));
      setShowOTPModal(false);
      setIsAlertLoginVisible(true);
    } catch (error: any) {
      setErrorOTP(error.message);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleAlertAccept = () => {
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-11/12 md:w-[520px] p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
          onClick={onClose}
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">
          Chỉnh sửa thông tin cá nhân
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Avatar section */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <button
                type="button"
                onClick={pickImage}
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 border-2 border-gray-300"
              >
                <CameraIcon size={30} color="royalblue" />
              </button>

              <div>
                {image || form.avatarUrl ? (
                  <img
                    src={image ? URL.createObjectURL(image) : form.avatarUrl}
                    alt="Preview"
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <img
                    src={UserIcon}
                    alt="Avatar User"
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-100"
                  />
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Regular fields */}
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
            title="Tiểu sử"
            isRequire={false}
            placeholder="Đôi nét về bạn"
            onChangeText={(value: any) => handleChange("bio", value)}
            value={form.bio}
            icon={InfoIcon}
          />

          <DatePickerField
            title="Ngày sinh"
            value={form.birthDate}
            onChangeDate={(value: any) => handleChange("birthDate", value)}
            maxDate={new Date()}
            placeholder="Chọn ngày sinh"
          />

          {/* Sensitive fields */}
          <div
            className="cursor-pointer"
            onClick={() => handleSensitiveFieldClick("email")}
          >
            <InputField
              title="Email"
              isRequire={true}
              placeholder="Nhập địa chỉ email"
              value={form.email}
              icon={MailIcon}
              readOnly
              rightIcon={<LockIcon className="w-4 h-4 text-gray-400" />}
            />
          </div>

          <div
            className="cursor-pointer"
            onClick={() => handleSensitiveFieldClick("phone")}
          >
            <InputField
              title="Số điện thoại"
              isRequire={true}
              placeholder="Nhập số điện thoại"
              value={form.phone}
              icon={PhoneIcon}
              readOnly
              rightIcon={<LockIcon className="w-4 h-4 text-gray-400" />}
            />
          </div>

          <div
            className="cursor-pointer"
            onClick={() => handleSensitiveFieldClick("studentId")}
          >
            <InputField
              title="MSSV"
              isRequire={true}
              placeholder="Nhập MSSV"
              value={form.studentId}
              icon={IdCardIcon}
              readOnly
              rightIcon={<LockIcon className="w-4 h-4 text-gray-400" />}
            />
          </div>

          {/* Toggle to open change password side */}
          <div className="mb-4 flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={showPasswordFields}
                  onChange={() => setShowPasswordFields(!showPasswordFields)}
                />
                <div className="w-10 h-6 bg-gray-300 rounded-full shadow-inner"></div>
                <div
                  className={`absolute w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ease-in-out transform ${
                    showPasswordFields ? "translate-x-5" : "translate-x-1"
                  } top-1`}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                Đổi mật khẩu
              </span>
            </label>
          </div>

          {showPasswordFields && (
            <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
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
                onChangeText={(value: any) =>
                  handleChange("newPassword", value)
                }
                value={form.newPassword}
                icon={LockIcon}
                error={errors.newPassword}
                secureTextEntry={true}
              />
              <InputField
                title="Xác nhận mật khẩu mới"
                isRequire={true}
                placeholder="Nhập lại mật khẩu mới"
                onChangeText={(value: any) =>
                  handleChange("confirmPassword", value)
                }
                value={form.confirmPassword}
                icon={ShieldCheckIcon}
                error={errors.confirmPassword}
                secureTextEntry={true}
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                "Lưu thay đổi"
              )}
            </button>
          </div>
        </form>
      </div>

      <VerificationModal
        isVisible={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onSubmit={handleSendOTP}
        loading={loading}
        error={errorOTP}
        sensitiveFieldToEdit={sensitiveFieldToEdit}
        tempSensitiveValue={tempSensitiveValue}
        setTempSensitiveValue={setTempSensitiveValue}
        verificationForm={verificationForm}
        handleVerificationChange={handleVerificationChange}
        verificationErrors={verificationErrors}
      />

      <OTPModal
        isVisible={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onSubmit={handleVerifyOTP}
        loading={loading}
        error={errorOTP}
        sensitiveFieldToEdit={sensitiveFieldToEdit}
        tempSensitiveValue={tempSensitiveValue}
        form={form}
        otpForm={otpForm}
        handleOTPChange={handleOTPChange}
        otpErrors={otpErrors}
      />

      <AlertDialog
        isVisible={isAlertVisible}
        title="Thông báo"
        message="Thông tin cập nhật thành công!"
        onAccept={() => {
          setIsAlertVisible(false);
          onClose();
        }}
      />
      <AlertDialog
        isVisible={isAlertLoginVisible}
        title="Thông báo"
        message="Thông tin cập nhật thành công! Vui lòng đăng nhập lại để tiếp tục."
        onAccept={handleAlertAccept}
      />
    </div>
  );
};

export default EditProfileModal;
