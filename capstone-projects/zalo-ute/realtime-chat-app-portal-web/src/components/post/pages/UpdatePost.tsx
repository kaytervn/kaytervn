import { useState, useEffect } from "react";
import { ImageUpIcon, X } from "lucide-react"; // Thêm icon X
import { toast } from "react-toastify";
import useForm from "../../../hooks/useForm";
import useFetch from "../../../hooks/useFetch";
import { uploadImage2 } from "../../../types/utils";
import TextareaField from "../../TextareaField";
import CustomModal from "../../CustomModal";
import UserImg from "../../../assets/user_icon.png";
import { Profile } from "../../../models/profile/Profile";
const UpdatePost = ({ isVisible, setVisible, profile, postId, onButtonClick }: any) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [kind, setKind] = useState<number>(1);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [user, setUser] = useState<Profile>();
  const validate = (form: any) => {
    const errors: any = {};
    if (!form.content.trim()) errors.content = "Nội dung không được bỏ trống";
    return errors;
  };

  const { form, errors, setForm, setErrors, handleChange, isValidForm } =
    useForm({ content: "", imageUrls: [], user, kind: 1 }, {}, validate);

  const { get, put, post, loading } = useFetch();

  useEffect(() => {
    const fetchData = async () => {
      if (postId) {
        setErrors({});
        setImagePreviews([]);
        const res = await get(`/v1/post/get/${postId}`);
        setForm({ ...res.data });
        setKind(res.data.kind || 1);
        setImageUrls(res.data.imageUrls || []);
        setUser(profile)
      }
    };
    fetchData();
  }, [isVisible, postId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const fileReaders: Promise<void>[] = [];

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

  const handleUpdate = async () => {
    if (isValidForm()) {
      const newImageUrls = await Promise.all(
        imagePreviews.map((imagePreview) => uploadImage2(imagePreview, post))
      );

      const updatedImageUrls = [...imageUrls, ...newImageUrls];

      const res = await put("/v1/post/update", {
        id: postId,
        content: form.content,
        imageUrls: updatedImageUrls,
        kind,
      });

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

  const removeImage = (index: number, isPreview: boolean) => {
    if (isPreview) {
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImageUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  if (!isVisible) return null;

  return (
    <CustomModal
      title="Chỉnh sửa bài đăng"
      onClose={() => setVisible(false)}
      bodyComponent={
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <img
                src={form.user?.avatarUrl || UserImg}
                className="w-12 h-12 rounded-full border-gray-300 border"
              />
              <div className="flex flex-col">
                <div className="flex space-x-2">
                  <p className="font-semibold">{form.user?.displayName}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {user?.role.name}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{form.createdAt}</p>
              </div>
            </div>

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

          <TextareaField
            title="Nội dung"
            isRequire
            placeholder="Nhập nội dung bài đăng"
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
              {imagePreviews.length > 0 || imageUrls.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {/* Hiển thị ảnh cũ */}
                  {imageUrls.map((url, index) => (
                    <div className="relative" key={`url-${index}`}>
                      <img
                        src={url}
                        className="max-w-full object-contain rounded-lg"
                      />
                      <button
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                        onClick={() => removeImage(index, false)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {/* Hiển thị preview ảnh mới */}
                  {imagePreviews.map((preview, index) => (
                    <div className="relative" key={`preview-${index}`}>
                      <img
                        src={preview}
                        className="max-w-full object-contain rounded-lg"
                      />
                      <button
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                        onClick={() => removeImage(index, true)}
                      >
                        <X size={16} />
                      </button>
                    </div>
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
      buttonText="LƯU"
      onButtonClick={handleUpdate}
      loading={loading}
    />
  );
};

export default UpdatePost;
