import React, { useState, useEffect } from "react";
import { ImageUpIcon } from "lucide-react";
import { toast } from "react-toastify";
import useForm from "../../../hooks/useForm";
import useFetch from "../../../hooks/useFetch";
import { uploadImage2 } from "../../../types/utils";
import TextareaField from "../../TextareaField";
import CustomModal from "../../CustomModal";
import UserImg from "../../../assets/user_icon.png";

const CreatePost = ({
  isVisible,
  setVisible,
  profile,
  onButtonClick,
  selectedEmotion,
}: any) => {
  const [imagePreviews, setImagePreviews] = useState<any[]>([]);
  const [kind, setKind] = useState<number>(1); 

  const validate = (form: any) => {
    const errors: any = {};
    if (!form.content.trim()) errors.content = "Nội dung không được bỏ trống";
    return errors;
  };

  const { form, errors, setForm, setErrors, handleChange, isValidForm } =
    useForm(
      {
        content: selectedEmotion
          ? `Đang cảm thấy ${selectedEmotion.emotion} ${selectedEmotion.icon}`
          : "",
        imageUrls: [],
      },
      {},
      validate
    );

  const { post, loading } = useFetch();

  useEffect(() => {
    if (selectedEmotion) {
      setForm({
        content: `Đang cảm thấy ${selectedEmotion.emotion} ${selectedEmotion.icon}`,
        imageUrls: [],
      });
    } else {
      setForm({ content: "", imageUrls: [] });
    }
    setErrors({});
    setImagePreviews([]);
  }, [selectedEmotion, setErrors]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const fileReaders: Promise<any>[] = [];

    files.forEach((file: File) => {
      const reader = new FileReader();
      const readerPromise = new Promise<void>((resolve) => {
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
          resolve();
        };
      });
      reader.readAsDataURL(file);
      fileReaders.push(readerPromise);
    });

    Promise.all(fileReaders).catch(() => {
      toast.error("Lỗi khi tải hình ảnh");
    });
  };

  const handleCreate = async () => {
    if (isValidForm()) {
      const imageUrls = await Promise.all(
        imagePreviews.map((imagePreview) => uploadImage2(imagePreview, post))
      );

      const res = await post("/v1/post/create", {
        ...form,
        imageUrls,
        status: 1,
        kind,
      });

      if (res.result) {
        toast.success("Thêm bài viết thành công");
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
      onClose={() => setVisible(false)}
      bodyComponent={
        <>
          <div className="flex items-center space-x-2 mb-4 justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={profile?.avatarUrl || UserImg}
                alt="Profile"
                className="w-12 h-12 rounded-full border-gray-300 border"
              />
              <p className="font-semibold">{profile.displayName}</p>
              {
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {profile.role.name}
                </span>
              }
            </div>

            <div className="relative">
              <select
                value={kind}
                onChange={(e) => setKind(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none"
              >
                <option value={1}>Cộng đồng</option>
                <option value={2}>Bạn bè</option>
                <option value={3}>Chỉ mình tôi</option>
              </select>
            </div>
          </div>

          <TextareaField
            title="Nội dung"
            isRequire
            placeholder={`Bạn đang nghĩ gì, ${profile.displayName}?`}
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
              multiple
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center">
              {imagePreviews.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      className="max-w-full object-contain rounded-lg"
                    />
                  ))}
                </div>
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
