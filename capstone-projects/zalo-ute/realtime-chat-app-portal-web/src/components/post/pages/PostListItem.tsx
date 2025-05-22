import React from "react";
import { Search, FileText, Users, Bookmark , MoreVertical } from "lucide-react";


const PostListItem = ({
  selectedPostSection,
  setSelectedPostSection
}: any) => {
  return (
    <div className="p-4 flex flex-col justify-start">
      {/* Ô tìm kiếm */}
      <h1 className="text-2xl font-bold mb-6 text-center">Quản lý bài đăng</h1>
  
    <div className="relative mb-6">
      {/* Các nội dung khác */}
    </div>

      {/* Điều hướng Bài đăng của tôi */}
      <div
        className={`mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md ${
          selectedPostSection === "myPosts" ? "bg-gray-300" : ""
        }`}
        onClick={() => setSelectedPostSection("myPosts")}
      >
        <FileText size={24} className="mr-2" />
        <p className="text-lg">Bài đăng của tôi</p>
      </div>

      {/* Điều hướng Bài đăng bạn bè */}
      <div
        className={`mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md ${
          selectedPostSection === "friendsPosts" ? "bg-gray-300" : ""
        }`}
        onClick={() => setSelectedPostSection("friendsPosts")}
      >
        <Users size={24} className="mr-2" />
        <p className="text-lg">Bài đăng bạn bè</p>
      </div>

      {/* Điều hướng Bài đăng đã lưu */}
      <div
        className={`mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md ${
          selectedPostSection === "communityPosts" ? "bg-gray-300" : ""
        }`}
        onClick={() => setSelectedPostSection("communityPosts")}
      >
        <Bookmark size={24} className="mr-2" />
        <p className="text-lg">Bài đăng cộng đồng</p>
      </div>
    </div>
  );
};

export default PostListItem;
