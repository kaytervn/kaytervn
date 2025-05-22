import React, { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import { CustomModal } from "../Dialog";
import UserIcon from "../../assets/user_icon.png";
import { uploadImage } from "../../types/utils";
import useFetch from "../../hooks/useFetch";

const EditProfilePopup = ({
  conversation,
  onUpdate,
  isVisible,
  onClose,
}: any) => {
  const [name, setName] = useState(conversation.name);
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(conversation.avatarUrl || null);
  const { post, loading } = useFetch();

  const [form, setForm] = useState({
    id: conversation._id,
    name: conversation.name,
    avatarUrl: conversation.avatar,
  });

  useEffect(() => {
    setForm({
      id: conversation._id,
      name: name,
      avatarUrl: previewUrl,
    });
  }, [name, previewUrl, conversation._id]);

  const handleAvatarChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const updatedForm = { ...form };
    if (avatar) {
      const avatarUrl = await uploadImage(avatar, post);
      updatedForm.avatarUrl = avatarUrl;
    }

    console.log("Updated form data:", updatedForm);

    onUpdate(updatedForm);
    onClose();
  };

  return (
    <CustomModal
      isVisible={isVisible}
      title="Chỉnh sửa thông tin"
      message=""
      onClose={onClose}
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-24 h-24">
            <img
              src={previewUrl ? previewUrl : UserIcon}
              alt="Avatar preview"
              className="w-full h-full rounded-full object-cover"
            />
            <label
              htmlFor="avatar-input"
              className="absolute bottom-0 right-0 p-1 bg-white rounded-full cursor-pointer shadow-lg hover:bg-gray-100"
            >
              <Edit size={16} />
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên của bạn"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 w-full">
          <button
            onClick={onClose}
            className="p-3 rounded-md bg-gray-200 w-full text-gray-800 text-center text-lg font-semibold"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="p-3 rounded-md w-full text-white text-center text-lg font-semibold bg-blue-500"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default EditProfilePopup;
