import React, { useState } from "react";
import { Search, UserPlus, Users } from "lucide-react";
import AddFriend from "./AddFriend";

interface FriendListItemProps {
  selectedFriendSection: string;
  setSelectedFriendSection: (section: string) => void;
}

const FriendListItem: React.FC<FriendListItemProps> = ({
  selectedFriendSection,
  setSelectedFriendSection,
}) => {
    const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);

//   // Hàm để mở/đóng thêm bạn bè
//   const toggleAddFriend = () => {
//     setIsAddFriendOpen(!isAddFriendOpen);
//   };
  return (
    <div className="p-4 flex flex-col justify-start">
    {/* Thêm tiêu đề */}
    <h1 className="text-2xl font-bold mb-6 text-center">Quản lý bạn bè</h1>
  
    <div className="relative mb-6">
      {/* Các nội dung khác */}
    </div>
  
    <div
      className={`mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md ${
        selectedFriendSection === "friends" ? "bg-gray-300" : ""
      }`}
      onClick={() => setSelectedFriendSection("friends")}
    >
      <Users size={24} className="mr-2" />
      <p className="text-lg">Danh sách bạn bè</p>
    </div>
    <div
      className={`mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md ${
        selectedFriendSection === "requests" ? "bg-gray-300" : ""
      }`}
      onClick={() => setSelectedFriendSection("requests")}
    >
      <UserPlus size={24} className="mr-2" />
      <p className="text-lg">Lời mời kết bạn</p>
    </div>
  </div>
  
    
  );
};

export default FriendListItem;