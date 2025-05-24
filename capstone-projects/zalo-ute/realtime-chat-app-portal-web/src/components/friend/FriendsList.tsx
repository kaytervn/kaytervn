import React, { useState, useEffect } from "react";
import { useLoading } from "../../hooks/useLoading";
import { remoteUrl, ZALO_UTE_PORTAL_ACCESS_TOKEN } from "../../types/constant";
import { toast } from "react-toastify";
import InputField from "../InputField";
import {
  Search,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Info,
  Trash2,
  UserPlus,
} from "lucide-react";
import { LoadingDialog } from "../Dialog";
import useFetch from "../../hooks/useFetch";
import AddFriend from "./AddFriend";
import ProfileModal from "./friendProfile";
import { FriendModel } from "../../models/friend/friendModel";
import { Profile } from "../../models/profile/Profile";
// export interface Friend {
//   _id: string;
//   displayName: string;
//   avatarUrl: string;
//   lastLogin: string;
//   status: string;
//   friend: Profile;
// }

const FriendsList = () => {
  const { isLoading, showLoading, hideLoading } = useLoading();
  const [friends, setFriends] = useState<FriendModel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { get, put } = useFetch();
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("messages");
  const [profileData, setProfileData] = useState<Profile | null>(null);

  const defaultAvatar = "https://via.placeholder.com/150";

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    showLoading();
    try {
      const response = await get(`/v1/friendship/list`, {
        getListKind: 3,
      });
      if (response.result) {
        console.log("Content data:", response.data.content);
        const formattedFriends = response.data.content;
        setFriends(formattedFriends);
      }
    } catch (error: any) {
      console.log("Error fetching friends:", error);
      toast.error(error.message);
    } finally {
      hideLoading();
    }
  };

  const filteredFriends = friends
    .filter((friend) =>
      friend.friend.displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.friend.displayName.localeCompare(b.friend.displayName);
      } else {
        return b.friend.displayName.localeCompare(a.friend.displayName);
      }
    });

  const groupedFriends: { [key: string]: FriendModel[] } =
    filteredFriends.reduce((acc, friend) => {
      const firstLetter =
        friend.friend.displayName.charAt(0).toUpperCase() || "#";
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(friend);
      return acc;
    }, {} as { [key: string]: FriendModel[] });

  const toggleMenu = (friendId: string) => {
    setOpenMenu(openMenu === friendId ? null : friendId);
  };

  const handleViewInfo = async (friendId: string) => {
    const selectedFriend = friends.find((friend) => friend._id === friendId);
    showLoading();
    if (selectedFriend) {
      try {
        // Lấy user ID từ friend object
        const userId = selectedFriend.friend._id;

        // Gọi API lấy danh sách user để tìm thông tin chi tiết
        const response = await get("/v1/user/list", {
          isPaged: 0,
          //ignoreFriendship: 1
        });
        console.log("Full User:", userId);
        if (response.result) {
          // Tìm user trong danh sách trả về
          const userDetails = response.data.content.find(
            (user: any) => user._id === userId
          );
          console.log("Full User222:", userDetails);
          if (userDetails) {
            // Cập nhật profile data với thông tin chi tiết từ /v1/user/list
            setProfileModalVisible(true);
            setProfileData({
              ...selectedFriend.friend,
              ...userDetails, // Ghi đè thông tin từ API user list
            });

            console.log("Full User Details:", userDetails);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Nếu lỗi, vẫn hiển thị thông tin ban đầu
        setProfileModalVisible(true);
        setProfileData(selectedFriend.friend);
      } finally {
        hideLoading();
      }
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    try {
      showLoading();
      const response = await fetch(
        `${remoteUrl}/v1/friendship/delete/${friendshipId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(
              ZALO_UTE_PORTAL_ACCESS_TOKEN
            )}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Có lỗi xảy ra khi xóa bạn bè");
        return;
      }

      toast.success("Đã xóa bạn bè thành công");
      setFriends(friends.filter((friend) => friend._id !== friendshipId));
    } catch (error) {
      console.error("Lỗi khi xóa bạn bè:", error);
      toast.error("Có lỗi xảy ra khi xóa bạn bè");
    } finally {
      hideLoading();
      setOpenMenu(null);
    }
  };
  const updateFriendsList = async () => {
    await fetchFriends();
  };
  const handleProfileClick = () => {
    setProfileModalVisible(true);
    setActiveSection("profile");
  };
  const handleFollowToggle = async (
    friendshipId: string,
    isFollowed: number
  ) => {
    showLoading();
    try {
      // Gửi API với friendshipId
      const response = await put("/v1/friendship/follow", {
        friendship: friendshipId, // Truyền friendshipId thay vì friendId
      });

      if (response.result) {
        toast.success(isFollowed === 0 ? "Đã follow" : "Đã unfollow");
        fetchFriends(); // Reload friends list
      }
    } catch (error) {
      toast.error("Có lỗi khi thực hiện hành động");
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Bạn bè ({filteredFriends.length})
        </h2>
      </div>

      <div className="flex items-center mb-4 space-x-2">
        <div className="flex-grow">
          <InputField
            placeholder="Tìm kiếm bạn bè"
            icon={Search}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="h-10"
          />
        </div>

        <div className="flex-shrink-0 -mt-2">
          <button
            className="flex items-center border border-gray-300 px-2 py-2 rounded-md focus:outline-none hover:bg-gray-100 h-10"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? (
              <>
                <ChevronUp className="mr-1" /> Tên (A-Z)
              </>
            ) : (
              <>
                <ChevronDown className="mr-1" /> Tên (Z-A)
              </>
            )}
          </button>
        </div>
        <button
          className="flex items-center border border-gray-300 px-2 py-2 rounded-md focus:outline-none hover:bg-gray-100 h-10"
          onClick={() => setIsAddFriendOpen(true)}
        >
          <UserPlus className="mr-1" /> Thêm bạn bè
        </button>
      </div>

      {Object.keys(groupedFriends).length > 0 ? (
        Object.keys(groupedFriends)
          .sort()
          .map((letter) => (
            <div key={letter} className="mb-6">
              <h3 className="text-lg font-semibold">{letter}</h3>
              {groupedFriends[letter].map((friend) => (
                <div
                  key={friend._id}
                  className="flex items-center justify-between mb-4"
                >
                  <div className="flex items-center">
                    <img
                      src={friend.friend.avatarUrl}
                      alt={friend.friend.displayName}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold">
                        {friend.friend.displayName}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Lần đăng nhập cuối: {friend.friend.lastLogin}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        handleFollowToggle(friend._id, friend.isFollowed)
                      }
                      className={`ml-4 px-4 py-2 rounded-md ${
                        friend.isFollowed === 0
                          ? "bg-blue-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {friend.isFollowed === 0 ? "Follow" : "Unfollow"}
                    </button>
                    <button
                      onClick={() => toggleMenu(friend._id)}
                      className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {openMenu === friend._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        <button
                          onClick={() => handleViewInfo(friend._id)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Info size={16} className="mr-2" />
                          Xem thông tin
                        </button>
                        <button
                          onClick={() => handleRemoveFriend(friend._id)}
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Xóa bạn bè
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))
      ) : (
        <p className="text-gray-500">Không tìm thấy bạn bè</p>
      )}
      <ProfileModal
        isVisible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        profileData={profileData} // Pass the profileData here
      />

      <AddFriend
        isOpen={isAddFriendOpen}
        onClose={() => setIsAddFriendOpen(false)}
        updateFriendsList={updateFriendsList}
      />
      <LoadingDialog isVisible={isLoading} />
    </div>
  );
};

export default FriendsList;
