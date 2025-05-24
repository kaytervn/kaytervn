import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { remoteUrl, ZALO_UTE_PORTAL_ACCESS_TOKEN } from "../../types/constant";
import { jwtDecode } from "jwt-decode";
import { useLoading } from "../../hooks/useLoading";
import { LoadingDialog } from "../Dialog";

interface User {
  _id: string;
  displayName: string;
  avatarUrl: string | null;
}

interface Friendship {
  _id: string;
  sender: User;
  receiver: User;
  status: number;
}

const FriendRequests: React.FC = () => {
  const [friendRequests, setFriendRequests] = useState<Friendship[]>([]);
  const { isLoading, showLoading, hideLoading } = useLoading();

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

  const fetchFriendRequests = async () => {
    showLoading();
    try {
      const response = await fetch(
        `${remoteUrl}/v1/friendship/list?getListKind=1`,
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

      const data = await response.json();
      if (data.result) {
        const filteredRequests = data.data.content.filter(
          (request: Friendship) => request.receiver._id === userId
        );
        setFriendRequests(filteredRequests);
      } else {
        toast.error("Không thể tải danh sách lời mời kết bạn.");
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách lời mời kết bạn.");
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const handleAcceptRequest = async (friendshipId: string) => {
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

      const data = await response.json();
      if (data.result) {
        toast.success("Đã chấp nhận lời mời kết bạn");
        setFriendRequests(
          friendRequests.filter((request) => request._id !== friendshipId)
        );
      } else {
        toast.error(data.message || "Không thể chấp nhận lời mời kết bạn");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Có lỗi xảy ra khi chấp nhận lời mời kết bạn");
    } finally {
      hideLoading();
    }
  };

  const handleRejectRequest = async (friendshipId: string) => {
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

      const data = await response.json();
      if (data.result) {
        toast.success("Đã từ chối lời mời kết bạn");
        setFriendRequests(
          friendRequests.filter((request) => request._id !== friendshipId)
        );
      } else {
        toast.error(data.message || "Không thể từ chối lời mời kết bạn");
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast.error("Có lỗi xảy ra khi từ chối lời mời kết bạn");
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Lời mời kết bạn</h2>
      {friendRequests.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {friendRequests.map((request) => (
            <div
              key={request._id}
              className="flex items-center justify-between border p-4 rounded-md shadow-sm"
            >
              <div className="flex items-center">
                <img
                  src={
                    request.sender.avatarUrl || "/path/to/default-avatar.png"
                  }
                  alt={request.sender.displayName}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <span>{request.sender.displayName}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRejectRequest(request._id)}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Từ chối
                </button>
                <button
                  onClick={() => handleAcceptRequest(request._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Chấp nhận
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Không có lời mời kết bạn nào.</p>
      )}
      <LoadingDialog isVisible={isLoading} />
    </div>
  );
};

export default FriendRequests;
