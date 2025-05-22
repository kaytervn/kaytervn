import { useState, useEffect } from "react";
import { ImageUpIcon } from "lucide-react";
import { toast } from "react-toastify";
import useForm from "../../hooks/useForm";
import useFetch from "../../hooks/useFetch";
import { isAdminRole, uploadImage } from "../../types/utils";
import TextareaField from "../TextareaField";
import CustomModal from "../CustomModal";
import UserImg from "../../assets/user_icon.png";

const CreatePost = ({ isVisible, setVisible, profile, onButtonClick }: any) => {
  const [imagePreview, setImagePreview] = useState<any>(null);

  const validate = (form: any) => {
    const errors: any = {};
    if (!form.content.trim()) errors.content = "Nội dung không được bỏ trống";
    return errors;
  };

  const { form, errors, setForm, setErrors, handleChange, isValidForm } =
    useForm({ content: "", imageUrl: null }, {}, validate);

  const { post, loading } = useFetch();

  useEffect(() => {
    setForm({ content: "", imageUrl: null });
    setErrors({});
    setImagePreview(null);
  }, [isVisible, setErrors]);

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (isValidForm()) {
      const imageUrl = imagePreview
        ? await uploadImage(imagePreview, post)
        : form.imageUrl;
      const res = await post("/v1/post/create", { ...form, imageUrl });
      if (res.result) {
        toast.success("Thêm thành công");
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
      title="Thêm bài đăng mới"
      color="gray"
      onClose={() => setVisible(false)}
      bodyComponent={
        <>
          <div className="flex items-center space-x-2 mb-4">
            <img
              src={profile?.avatarUrl || UserImg}
              alt="Profile"
              className="w-12 h-12 rounded-full border-gray-300 border"
            />
            <p className="font-semibold">{profile.displayName}</p>
            {isAdminRole(profile.role.name) && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {profile.role.name}
              </span>
            )}
          </div>
          <TextareaField
            title="Nội dung"
            isRequire
            placeholder={`Bạn đang nghĩ về điều gì vậy, ${profile.displayName}?`}
            value={form.content}
            onChangeText={(value: any) => handleChange("content", value)}
            error={errors.content}
            multiline={true}
            rows={5}
            maxLength={1000}
            className="mb-4"
          />
          <div className="border border-gray-300 rounded-lg p-4 mb-4 relative hover:border-blue-500">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  className="max-w-full object-contain rounded-lg"
                />
              ) : (
                <div className="flex items-center justify-center">
                  <ImageUpIcon className="text-gray-400" size={20} />
                  <p className="ml-2 text-gray-400">Thêm hình ảnh</p>
                </div>
              )}
            </div>
          </div>
        </>
      }
      buttonText="THÊM"
      onButtonClick={handleCreate}
      loading={loading}
    />
  );
};

export default CreatePost;
