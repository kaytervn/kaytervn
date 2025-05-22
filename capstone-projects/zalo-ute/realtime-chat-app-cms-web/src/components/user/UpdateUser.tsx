import { useEffect, useState } from "react";
import {
  MailIcon,
  CircleUserRoundIcon,
  InfoIcon,
  PhoneIcon,
  ShieldEllipsisIcon,
  SparklesIcon,
  IdCardIcon,
} from "lucide-react";
import InputField from "../InputField";
import useForm from "../../hooks/useForm";
import {
  EmailPattern,
  PhonePattern,
  StudentIdPattern,
} from "../../types/constant";
import useFetch from "../../hooks/useFetch";
import UserIcon from "../../assets/user_icon.png";
import SelectField from "../SelectField";
import { getDate, uploadImage } from "../../types/utils";
import DatePickerField from "../DatePickerField";
import { toast } from "react-toastify";
import CustomModal from "../CustomModal";
import ChangePasswordAdmin from "./ChangePasswordAdmin";

const UpdateUser = ({
  isVisible,
  setVisible,
  userId,
  roles,
  profileRoleKind,
  onButtonClick,
}: any) => {
  const [isChecked, setIsChecked] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<any>(null);

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.displayName.trim())
      newErrors.displayName = "Tên người dùng không được bỏ trống";
    if (!form.email.trim()) newErrors.email = "Email không được bỏ trống";
    else if (!EmailPattern.test(form.email))
      newErrors.email = "Email không hợp lệ";
    if (!form.phone) newErrors.phone = "Số điện thoại không được bỏ trống";
    else if (!PhonePattern.test(form.phone))
      newErrors.phone = "Số điện thoại không hợp lệ";
    if (!form.studentId)
      newErrors.studentId = "Mã sinh viên không được bỏ trống";
    else if (!StudentIdPattern.test(form.studentId))
      newErrors.studentId = "Mã sinh viên không hợp lệ";
    if (!form.roleId.trim()) newErrors.roleId = "Vai trò không được bỏ trống";
    if (form.status != 0 && form.status != 1)
      newErrors.status = "Trạng thái không được bỏ trống";
    if (isChecked) {
      if (!form.password || form.password.length < 6)
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      if (form.confirmPassword !== form.password)
        newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
    }
    return newErrors;
  };

  const { form, errors, setForm, setErrors, handleChange, isValidForm } =
    useForm(
      {
        displayName: "",
        email: "",
        phone: "",
        birthDate: "",
        bio: "",
        studentId: "",
        avatarUrl: null,
        roleId: "",
        status: "",
        password: "",
        confirmPassword: "",
      },
      {},
      validate
    );

  const { get, put, post, loading } = useFetch();

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        setErrors({});
        setAvatarPreview(null);
        setIsChecked(false);
        const userRes = await get(`/v1/user/get/${userId}`);
        setForm({
          ...userRes.data,
          roleId: userRes.data.role,
          password: null,
          birthDate: userRes.data.birthDate
            ? getDate(userRes.data.birthDate)
            : null,
        });
      }
    };
    fetchData();
  }, [isVisible, userId]);

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (isValidForm()) {
      const updatedForm = {
        ...form,
        role: form.roleId,
        birthDate: form.birthDate ? `${form.birthDate} 07:00:00` : null,
        password: form.password || null,
        avatarUrl: avatarPreview
          ? await uploadImage(avatarPreview, post)
          : form.avatarUrl,
      };
      const res = await put("/v1/user/update", updatedForm);
      if (res.result) {
        toast.success("Cập nhật thành công");
        setVisible(false);
        onButtonClick();
      } else {
        toast.error(res.message);
      }
    } else {
      toast.error("Vui lòng kiểm tra lại thông tin");
    }
  };

  if (!isVisible) return null;

  return (
    <CustomModal
      onClose={() => setVisible(false)}
      title="Chỉnh sửa người dùng"
      topComponent={
        <div className="relative w-32 h-32 rounded-full border-4 overflow-hidden">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <img
            src={avatarPreview || form.avatarUrl || UserIcon}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      }
      bodyComponent={
        <>
          <InputField
            title="Tên hiển thị"
            isRequire
            placeholder="Nhập tên hiển thị"
            value={form.displayName}
            onChangeText={(value: any) => handleChange("displayName", value)}
            icon={CircleUserRoundIcon}
            error={errors.displayName}
          />
          <InputField
            title="Tiểu sử"
            placeholder="Nhập thông tin tiểu sử"
            value={form.bio}
            onChangeText={(value: any) => handleChange("bio", value)}
            icon={InfoIcon}
          />
          <InputField
            title="Email"
            isRequire
            placeholder="Nhập địa chỉ email"
            value={form.email}
            onChangeText={(value: any) => handleChange("email", value)}
            icon={MailIcon}
            error={errors.email}
          />
          <InputField
            title="Số điện thoại"
            isRequire
            placeholder="Nhập số điện thoại"
            value={form.phone}
            onChangeText={(value: any) => handleChange("phone", value)}
            icon={PhoneIcon}
            error={errors.phone}
          />
          <InputField
            title="Mã sinh viên"
            isRequire
            placeholder="Nhập mã sinh viên"
            value={form.studentId}
            onChangeText={(value: any) => handleChange("studentId", value)}
            icon={IdCardIcon}
            error={errors.studentId}
          />
          <DatePickerField
            title="Ngày sinh"
            value={form.birthDate}
            onChangeDate={(value: any) => handleChange("birthDate", value)}
            maxDate={new Date()}
            placeholder="Chọn ngày sinh"
          />
          <SelectField
            title="Vai trò"
            value={form.roleId}
            options={roles}
            isRequire
            disabled={profileRoleKind !== 3}
            onChange={(value: any) => handleChange("roleId", value)}
            icon={ShieldEllipsisIcon}
            error={errors.roleId}
            labelKey="name"
            valueKey="_id"
          />
          <SelectField
            title="Trạng thái"
            value={form.status}
            options={[
              { value: "0", name: "Chưa kích hoạt" },
              { value: "1", name: "Hoạt động" },
            ]}
            labelKey="name"
            valueKey="value"
            isRequire
            onChange={(value: any) => handleChange("status", value)}
            icon={SparklesIcon}
            error={errors.status}
          />
          {profileRoleKind === 3 && (
            <ChangePasswordAdmin
              form={form}
              errors={errors}
              handleChange={handleChange}
              isChecked={isChecked}
              setIsChecked={setIsChecked}
            />
          )}
        </>
      }
      buttonText="LƯU"
      onButtonClick={handleUpdate}
      loading={loading}
    />
  );
};

export default UpdateUser;
