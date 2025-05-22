import React, { useState, useEffect } from "react";
import { UserProfile } from "../../models/profile/chat";
import useFetch from "../../hooks/useFetch";
import { Friends } from "../../models/profile/chat";
import { AlertDialog, AlertErrorDialog } from "../Dialog";
import useDialog from "../../hooks/useDialog";
import { uploadImage } from "../../types/utils";
import { Edit } from "lucide-react";
import UserIcon from "../../assets/user_icon.png";

interface CreateGroupModalProps {
  onClose: () => void;
  userCurrent: UserProfile | null;
  handleConversationCreated: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  onClose,
  userCurrent,
  handleConversationCreated,
}) => {
  const [groupName, setGroupName] = useState("");
  const [friendsList, setFriendsList] = useState<Friends[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isDialogVisible, showDialog, hideDialog } = useDialog();
  const [isSuccessDialogVisible, setSuccessDialogVisible] = useState(false);
  const { get, post } = useFetch();
  const [searchFriendQuery, setSearchFriendQuery] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const filteredFriends = friendsList.filter((friend) =>
    friend.friend.displayName
      .toLowerCase()
      .includes(searchFriendQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoadingFriends(true);
        const response = await get("/v1/friendship/list", { getListKind: 0 });
        console.log("response get list friends:", response);
        if (response.result) {
          setFriendsList(response.data.content);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bạn bè:", error);
      } finally {
        setLoadingFriends(false);
      }
    };

    fetchFriends();
  }, []);

  // Thêm hoặc loại bỏ thành viên khỏi danh sách chọn
  const toggleMember = (userId: string) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.includes(userId)
        ? prevMembers.filter((id) => id !== userId)
        : [...prevMembers, userId]
    );
  };

  console.log("friendsList:", friendsList);
  console.log("Tạo nhóm thành công:", isSuccessDialogVisible);

  // Xử lý tạo nhóm mới
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError("Vui lòng nhập tên nhóm");
      showDialog();
      return;
    }
    if (selectedMembers.length < 2) {
      setError("Vui lòng chọn ít nhất 2 thành viên");
      showDialog();
      return;
    }

    try {
      setLoading(true);

      let avatarUrl = null;
      if (avatar) {
        avatarUrl = await uploadImage(avatar, post);
      }

      const payload = {
        name: groupName,
        conversationMembers: selectedMembers,
        avatarUrl: avatarUrl,
      };

      const response = await post("/v1/conversation/create", payload);
      console.log("response create group:", response);
      if (response.result) {
        setSuccessDialogVisible(true);
        handleConversationCreated();
      } else {
        // const message = response.data.message;
        setError("Đã xảy ra lỗi khi tạo nhóm nè");
        showDialog();
      }
    } catch (error) {
      setError("Đã xảy ra lỗi khi tạo nhóm");
      showDialog();
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    setError("");
    hideDialog();
  };

  const handleAccept = () => {
    setSuccessDialogVisible(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Tạo nhóm mới</h2>

        <input
          type="text"
          placeholder="Nhập tên nhóm..."
          className="w-full p-2 mb-4 border rounded focus:outline-none"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <div className="flex flex-col items-center gap-4 mb-4">
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

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Chọn thành viên</h3>

          {/* Tìm kiếm bạn bè */}
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Tìm kiếm bạn bè..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchFriendQuery}
              onChange={(e) => setSearchFriendQuery(e.target.value)}
            />
          </div>

          {loadingFriends ? (
            <p>Đang tải danh sách bạn bè...</p>
          ) : (
            <div className="max-h-40 overflow-y-auto">
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend) => (
                  <div
                    key={friend.friend._id}
                    className="flex items-center mb-2"
                  >
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedMembers.includes(friend.friend._id)}
                      onChange={() => toggleMember(friend.friend._id)}
                    />
                    <span>{friend.friend.displayName}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Không tìm thấy bạn bè nào</p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={() => handleCreateGroup()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Đang tạo nhóm..." : "Tạo nhóm"}
          </button>
        </div>
      </div>
      <AlertErrorDialog
        isVisible={isDialogVisible}
        title="Lỗi"
        color="red"
        message={error}
        onAccept={handleConfirm}
      />
      <AlertDialog
        isVisible={isSuccessDialogVisible}
        title="Thông báo"
        message="Tạo nhóm thành công"
        onAccept={handleAccept}
      />
    </div>
  );
};

export default CreateGroupModal;
