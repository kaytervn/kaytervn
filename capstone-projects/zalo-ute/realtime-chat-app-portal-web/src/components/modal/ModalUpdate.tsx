import { ArrowLeft, CalendarIcon, PenIcon, User, UserIcon } from "lucide-react";
import Button from "../Button";
import InputField from "../InputField";
import useForm from "../../hooks/useForm";
import { useLoading } from "../../hooks/useLoading";
import { remoteUrl } from "../../types/constant";
import { toast } from "react-toastify";
import { formatBirthDate, formatDateFormToString } from "../../utils/DateUtils";

const ModalUpdate = ({ isOpen, onClose, profile }: any) => {
  const { showLoading, hideLoading } = useLoading();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.displayName.trim()) {
      newErrors.displayName = "Tên đăng nhập không được bỏ trống";
    }
    return newErrors;
  };

  const initialForm = {
    displayName: profile.displayName,
    birthDate: formatBirthDate(profile.birthDate), // Ensure it's formatted correctly
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    initialForm,
    { displayName: "", birthDate: "", bio: "", avatarUrl: "" },
    validate
  );

  const onUpdateProfile = async () => {
    if (isValidForm()) {
      showLoading();
      try {
        const response = await fetch(`${remoteUrl}/v1/user/update-profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            displayName: form.displayName,
            birthDate: formatDateFormToString(form.birthDate + " 00:00:00"),
            bio: form.bio,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message);
          return;
        }
        toast.success("Cập nhật thông tin thành công");
        onClose();
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        hideLoading();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex items-center mb-5">
          <ArrowLeft size={24} className="cursor-pointer" onClick={onClose} />
          <h2 className="text-xl font-semibold ms-5">
            Cập nhật thông tin cá nhân
          </h2>
        </div>
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
            <User size={48} className="text-gray-500" />
          </div>
        )}

        <InputField
          title="Tên tài khoản"
          isRequire={true}
          placeholder="Nhập tên đăng nhập"
          onChangeText={(value: any) => handleChange("displayName", value)}
          value={form.displayName}
          icon={UserIcon}
          error={errors.displayName}
        />
        <InputField
          title="Giới thiệu"
          isRequire={false}
          placeholder="Nhập giới thiệu"
          onChangeText={(value: any) => handleChange("bio", value)}
          value={form.bio}
          icon={PenIcon}
          error={undefined}
        />
        <div className="mb-4">
          <label className="text-base font-semibold text-gray-800 mb-2 block text-left">
            Ngày sinh
          </label>
          <div className="relative">
            <CalendarIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="date"
              className="pl-10 w-full p-2 border rounded-md"
              value={form.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
            />
          </div>
          {errors.birthDate && (
            <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>
          )}
        </div>

        <Button title="Cập nhật" color="royalblue" onPress={onUpdateProfile} />
      </div>
    </div>
  );
};

export default ModalUpdate;
