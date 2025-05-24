import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { remoteUrl, ZALO_UTE_PORTAL_ACCESS_TOKEN } from "../../types/constant";
import { toast } from "react-toastify";
import { useLoading } from "../../hooks/useLoading";
import { LoadingDialog } from "../Dialog";
import useFetch from "../../hooks/useFetch";

interface User {
  _id: string;
  displayName: string;
  email: string;
  studentId: string;
  phone: string;
  avatarUrl: string | null;
}

interface Friendship {
  _id: string;
  sender?: User;
  receiver?: User;
  friend?: User;
  status: number;
  kind?: number;
}

interface AddFriendProps {
  isOpen: boolean;
  onClose: () => void;
  updateFriendsList: () => void;
}

const AddFriend: React.FC<AddFriendProps> = ({
  isOpen,
  onClose,
  updateFriendsList,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [friendships2, setFriendships2] = useState<Friendship[]>([]);
  const [friendships3, setFriendships3] = useState<Friendship[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const { isLoading, showLoading, hideLoading } = useLoading();
  const { get, loading } = useFetch();
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [hasMore, setHasMore] = useState(true); // Kiểm tra còn dữ liệu không
  const [isFetching, setIsFetching] = useState(false); // Trạng thái tải dữ liệu

  const getUserIdFromToken = () => {
    const token = localStorage.getItem(ZALO_UTE_PORTAL_ACCESS_TOKEN);
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken?.userId;
    } catch (error) {
      console.error("Lỗi khi giải mã token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken();

  useEffect(() => {
    fetchFriendships(1);
    fetchFriendships(2);
    fetchFriendships(3);
  }, []);

  const fetchFriendships = async (kind: number) => {
    try {
      const response = await fetch(
        `${remoteUrl}/v1/friendship/list?getListKind=${kind}`,
        {
          method: "GET",
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
        toast.error(errorData.message);
        return;
      }

      const data = await response.json();

      setFriendships((prevFriendships) => [
        ...prevFriendships,
        ...data.data.content,
      ]);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi lấy danh sách bạn bè.");
    }
  };

  const fetchUsers = async () => {
    try {
      showLoading(); // Hiển thị trạng thái tải
      const response = await get(`/v1/user/list?&isPaged=0`); // API trả về toàn bộ user
      const allUsers = response.data.content || [];
      setUsers(allUsers); // Lưu toàn bộ user vào state
      setSearchResults(allUsers); // Hiển thị mặc định toàn bộ user
    } catch (error) {
      console.error("Lỗi khi tải danh sách user:", error);
      toast.error("Đã xảy ra lỗi khi lấy danh sách người dùng.");
    } finally {
      hideLoading(); // Ẩn trạng thái tải
    }
  };

  const handleSearch = async () => {
    showLoading(); // Hiển thị trạng thái tải
    try {
      // Gọi API, bao gồm nội dung tìm kiếm nếu có
      const query = searchQuery.trim()
        ? `/v1/user/list?isPaged=0&displayName=${encodeURIComponent(
            searchQuery.trim()
          )}`
        : `/v1/user/list?isPaged=0`;

      const response = await get(query);
      const fetchedUsers = response.data.content || []; // Lấy danh sách user trực tiếp từ API

      // Lọc user, loại bỏ user có id trùng với userId
      const filteredUsers = fetchedUsers.filter(
        (user: any) => user._id !== userId
      );

      setUsers(fetchedUsers); // Cập nhật state users (nếu cần tái sử dụng danh sách đầy đủ)
      setSearchResults(filteredUsers); // Hiển thị kết quả tìm kiếm (loại bỏ user có userId)

      console.log("Danh sách user sau tìm kiếm:", filteredUsers);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      toast.error("Đã xảy ra lỗi trong quá trình tìm kiếm.");
    } finally {
      hideLoading(); // Ẩn trạng thái tải
    }
  };

  const getFriendshipKind = (
    searchedUserId: string,
    friendships: Friendship[]
  ): number | undefined => {
    const friendship = friendships.find(
      (f) =>
        (f.sender &&
          f.sender._id === searchedUserId &&
          f.receiver &&
          f.receiver._id === userId) ||
        (f.receiver &&
          f.receiver._id === searchedUserId &&
          f.sender &&
          f.sender._id === userId) ||
        (f.friend && f.friend._id === searchedUserId && f.status === 2)
    );

    if (!friendship || !friendship.status) {
      return undefined;
    }

    if (friendship.sender?._id === searchedUserId && friendship.status === 1) {
      return 1;
    }

    if (
      friendship.receiver?._id === searchedUserId &&
      friendship.status === 1
    ) {
      return 2;
    }

    if (friendship.status === 2 && friendship.friend?._id === searchedUserId) {
      return 3;
    }

    return undefined;
  };

  const handleAddFriend = async (receiverId: string) => {
    showLoading();
    try {
      const response = await fetch(`${remoteUrl}/v1/friendship/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            ZALO_UTE_PORTAL_ACCESS_TOKEN
          )}`,
        },
        body: JSON.stringify({ user: receiverId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }

      const data = await response.json();
      toast.success("Lời mời kết bạn đã được gửi!");

      // Gọi hàm để lấy friendship mới
      await fetchNewFriendship(userId, receiverId);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi lời mời kết bạn.");
    } finally {
      hideLoading();
    }
  };

  const fetchNewFriendship = async (senderId: string, receiverId: string) => {
    try {
      const response = await fetch(
        `${remoteUrl}/v1/friendship/list?getListKind=2`,
        {
          method: "GET",
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
        toast.error(errorData.message);
        return;
      }

      const data = await response.json();
      const newFriendship = data.data.content.find(
        (friendship: Friendship) =>
          friendship.sender?._id === senderId &&
          friendship.receiver?._id === receiverId
      );

      if (newFriendship) {
        console.log("New friendship _id:", newFriendship._id);
        // Cập nhật state friendships với friendship mới
        setFriendships((prevFriendships) => [
          ...prevFriendships,
          newFriendship,
        ]);
      } else {
        console.log("Không tìm thấy friendship mới.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy friendship mới:", error);
    }
  };
  const handleAcceptFriendRequest = async (friendshipId: string) => {
    showLoading();
    try {
      const response = await fetch(`${remoteUrl}/v1/friendship/accept`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            ZALO_UTE_PORTAL_ACCESS_TOKEN
          )}`,
        },
        body: JSON.stringify({ friendship: friendshipId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }

      toast.success("Đã chấp nhận lời mời kết bạn!");

      // Cập nhật trạng thái friendship
      setFriendships((prevFriendships) =>
        prevFriendships.map((friendship) =>
          friendship._id === friendshipId
            ? { ...friendship, status: 2 }
            : friendship
        )
      );
      updateFriendsList();
    } catch (error) {
      console.error("Lỗi khi chấp nhận lời mời kết bạn:", error);
      toast.error("Đã xảy ra lỗi khi chấp nhận lời mời kết bạn.");
    } finally {
      hideLoading();
    }
  };

  const handleRejectFriendRequest = async (friendshipId: string) => {
    console.log("friendshipId:", friendshipId);
    showLoading();
    try {
      const response = await fetch(`${remoteUrl}/v1/friendship/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            ZALO_UTE_PORTAL_ACCESS_TOKEN
          )}`,
        },
        body: JSON.stringify({ friendship: friendshipId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }

      const data = await response.json();
      toast.success("Đã từ chối lời mời kết bạn.");

      // Cập nhật lại danh sách lời mời kết bạn sau khi từ chối
      setFriendships((prevFriendships) =>
        prevFriendships.filter((friendship) => friendship._id !== friendshipId)
      );
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi từ chối lời mời kết bạn.");
    } finally {
      hideLoading(); // Ẩn trạng thái tải sau khi hoàn tất yêu cầu
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Thêm bạn</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Tên"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>

          <div className="mb-4 max-h-60 overflow-y-auto">
            {searchResults.map((user) => {
              const friendship = friendships.find(
                (f) =>
                  (f.sender &&
                    f.sender._id === user._id &&
                    f.receiver &&
                    f.receiver._id === userId) ||
                  (f.receiver &&
                    f.receiver._id === user._id &&
                    f.sender &&
                    f.sender._id === userId)
              );

              const kind = getFriendshipKind(user._id, friendships);
              return (
                <div
                  key={user._id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center">
                    <img
                      src={user.avatarUrl || "/path/to/default-avatar.png"}
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <span>{user.displayName}</span>
                  </div>

                  {kind === 1 && friendship ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleAcceptFriendRequest(friendship._id)
                        }
                        className="px-3 py-1 bg-green-200 text-green-800 rounded-md hover:bg-green-300 transition"
                      >
                        Chấp nhận
                      </button>
                      <button
                        onClick={() =>
                          handleRejectFriendRequest(friendship._id)
                        }
                        className="px-3 py-1 bg-red-200 text-red-800 rounded-md hover:bg-red-300 transition"
                      >
                        Từ chối
                      </button>
                    </div>
                  ) : kind === 2 ? (
                    <button
                      onClick={() =>
                        handleRejectFriendRequest(friendship?._id || "")
                      }
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                    >
                      Đã gửi (Hủy)
                    </button>
                  ) : kind === 3 || (friendship && friendship.status === 2) ? (
                    <button className="px-3 py-1 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed">
                      Đã là bạn bè
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddFriend(user._id)}
                      className="px-3 py-1 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300 transition"
                    >
                      Kết bạn
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end space-x-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Tìm kiếm
          </button>
        </div>
        <LoadingDialog isVisible={isLoading} />
      </div>
    </div>
  );
};

export default AddFriend;
