import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Calendar, Info, Briefcase, X } from "lucide-react";
import { Friends } from "../../models/profile/chat";
import useFetch from "../../hooks/useFetch";
import UserIcon from "../../assets/user_icon.png";
import { useProfile } from "../../types/UserContext"; 

const UserInfoPopup = ({
  user,
  onClose,
  onAddFriend,
  onCancelFriendRequest,
  onAcceptFriendRequest: parentAcceptCallback,
  onRejectFriendRequest,
  onFowardMessage,
}: any) => {
  if (!user) return null;

  const { get, post, put } = useFetch();
  const { profile } = useProfile();

  const [isLoading, setIsLoading] = useState(true);
  const [friendshipStatus, setFriendshipStatus] = useState({
    isFriend: false,
    isPendingSender: false,
    isPendingReceiver: false,
    isRequestSender: false,
    isRequestReceiver: false,
    friendObject: null as Friends | null,
  });

  useEffect(() => {
    const fetchFriendshipStatus = async () => {
      setIsLoading(true);
      try {
        // Fetch friends list (kind 0 - existing friends)
        const friendsResponse = await get("/v1/friendship/list", { getListKind: 0 });
        
        // Check if user is an existing friend
        const existingFriend = friendsResponse.result && 
          friendsResponse.data.content.find(
            (friend: any) => friend.friend._id === user._id && friend.status === 2
          );

        if (existingFriend) {
          setFriendshipStatus({
            isFriend: true,
            isPendingSender: false,
            isPendingReceiver: false,
            isRequestSender: false,
            isRequestReceiver: false,
            friendObject: existingFriend
          });
          setIsLoading(false);
          return;
        }

        // Fetch pending friend requests (kind 1)
        const pendingResponse = await get("/v1/friendship/list", { getListKind: 1 });
        
        // Check if user is in pending requests
        const pendingRequest = pendingResponse.result && 
          pendingResponse.data.content.find(
            (request: any) => 
              request.sender._id === user._id || 
              request.receiver._id === user._id
          );

        if (pendingRequest) {
          setFriendshipStatus({
            isFriend: false,
            isPendingSender: pendingRequest.sender._id === user._id,
            isPendingReceiver: pendingRequest.receiver._id === user._id,
            isRequestSender: false,
            isRequestReceiver: false,
            friendObject: pendingRequest
          });
          setIsLoading(false);
          return;
        }

        // Fetch sent friend requests (kind 2)
        const sentRequestsResponse = await get("/v1/friendship/list", { getListKind: 2 });
        
        // Check if user is in sent requests
        const sentRequest = sentRequestsResponse.result && 
          sentRequestsResponse.data.content.find(
            (request: any) => 
              request.sender._id === user._id || 
              request.receiver._id === user._id
          );

        if (sentRequest) {
          setFriendshipStatus({
            isFriend: false,
            isPendingSender: false,
            isPendingReceiver: false,
            isRequestSender: sentRequest.sender._id === profile?._id,
            isRequestReceiver: sentRequest.receiver._id === profile?._id,
            friendObject: sentRequest
          });
        } else {
          // No friendship exists
          setFriendshipStatus({
            isFriend: false,
            isPendingSender: false,
            isPendingReceiver: false,
            isRequestSender: false,
            isRequestReceiver: false,
            friendObject: null
          });
        }
      } catch (error) {
        console.error("Error fetching friendship status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriendshipStatus();
  }, [user._id, profile?._id]);

  const handleSendFriendRequest = async () => {
    try {
      const response = await post("/v1/friendship/send", {
        user: user._id,
      });

      if (response.result) {
        setFriendshipStatus({
          ...friendshipStatus,
          isRequestSender: true,
          friendObject: response.data
        });
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleAcceptFriendRequest = async () => {
    if (!friendshipStatus.friendObject) return;

    try {
      const response = await put("/v1/friendship/accept", {
        friendship: friendshipStatus.friendObject._id
      });

      if (response.result) {
        setFriendshipStatus({
          isFriend: true,
          isPendingSender: false,
          isPendingReceiver: false,
          isRequestSender: false,
          isRequestReceiver: false,
          friendObject: response.data
        });

        if (parentAcceptCallback) {
          parentAcceptCallback(user);
        }
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectFriendRequest = async () => {
    if (!friendshipStatus.friendObject) return;

    try {
      const response = await put("/v1/friendship/reject", {
        friendship: friendshipStatus.friendObject._id
      });

      if (response.result) {
        setFriendshipStatus({
          isFriend: false,
          isPendingSender: false,
          isPendingReceiver: false,
          isRequestSender: false,
          isRequestReceiver: false,
          friendObject: null
        });
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const renderFriendshipButton = () => {
    if (user._id === profile?._id) {
      return null;
    }

    if (isLoading) {
      return (
        <button
          className="bg-gray-400 text-white px-6 py-2 rounded-full shadow-md cursor-not-allowed"
          disabled
        >
          Đang tải...
        </button>
      );
    }

    const { isFriend, isPendingSender, isPendingReceiver, isRequestSender, isRequestReceiver } = friendshipStatus;

    if (isFriend) {
      return (
        <button
          className="bg-blue-100 text-blue-700 px-6 py-2 rounded-full shadow-md hover:bg-blue-200 transition-colors"
          onClick={() => onFowardMessage(friendshipStatus.friendObject)}
        >
          Nhắn tin
        </button>
      );
    }

    if (isPendingSender || isPendingReceiver) {
      return (
        <div className="flex space-x-2">
          <button
            className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-600 transition-colors"
            onClick={handleAcceptFriendRequest}
          >
            Chấp nhận
          </button>
          <button
            className="bg-red-100 text-red-700 px-6 py-2 rounded-full shadow-md hover:bg-red-200 transition-colors"
            onClick={handleRejectFriendRequest}
          >
            Từ chối
          </button>
        </div>
      );
    }

    if (isRequestSender) {
      return (
        <button
          className="bg-red-100 text-red-700 px-6 py-2 rounded-full shadow-md hover:bg-red-200 transition-colors"
          onClick={handleRejectFriendRequest}
        >
          Thu hồi lời mời
        </button>
      );
    }

    // Default state - No friendship
    return (
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-600 transition-colors"
        onClick={handleSendFriendRequest}
      >
        Kết bạn
      </button>
    );
  };


  // Rest of the component remains the same...
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
        >
          <X size={24} />
        </button>

        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img
              src={user.avatarUrl || UserIcon}
              alt={user.displayName}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
        </div>

        <div className="text-center mt-14 px-6">
          <h2 className="text-xl font-bold text-gray-800">
            {user.displayName}
          </h2>
        </div>

        <div className="mt-6 px-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Mail size={20} className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">nguyenvana@gmail.com</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Phone size={20} className="text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Số điện thoại</p>
              <p className="font-medium">0312345678</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar size={20} className="text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Ngày sinh</p>
              <p className="font-medium">12/06/2003</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Info size={20} className="text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Giới thiệu</p>
              <p className="font-medium text-gray-700">
                {user.bio || "Chưa có thông tin giới thiệu"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-6 mb-6 px-6">
          {renderFriendshipButton()}
        </div>
      </div>
    </div>
  );
};

export default UserInfoPopup;