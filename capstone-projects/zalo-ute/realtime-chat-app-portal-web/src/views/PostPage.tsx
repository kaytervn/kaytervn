// import React, { useState } from "react";
// import NavBar from "../components/NavBar";
// import MyPosts from "../components/post/MyPosts";
// import FriendsPosts from "../components/post/FriendsPosts";
// import SavedPosts from "../components/post/CommunityPosts";
// import Profile from "../components/modal/ProfileModal";
// import { Search, Bookmark, FileText, Users } from "lucide-react";

// const PostPage = () => {
//   const [selectedSection, setSelectedSection] = useState("myPosts");
//   const [isProfileVisible, setProfileVisible] = useState(false);

//   const renderContent = () => {
//     switch (selectedSection) {
//       case "myPosts":
//         return <MyPosts />;
//       case "friendsPosts":
//         return <FriendsPosts />;
//       case "savedPosts":
//         return <SavedPosts />;
//       default:
//         return <MyPosts />;
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       <NavBar setSelectedSection={setSelectedSection} />
//       <div className="w-1/5 bg-gray-200 p-4 flex flex-col justify-start h-screen sticky top-0">
//         <div className="relative mb-6">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Tìm kiếm bài đăng"
//             className="pl-10 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div
//           className="mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md"
//           onClick={() => setSelectedSection("myPosts")}
//         >
//           <FileText size={24} className="mr-2" />
//           <p className="text-lg">Bài đăng của tôi</p>
//         </div>
//         <div
//           className="mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md"
//           onClick={() => setSelectedSection("friendsPosts")}
//         >
//           <Users size={24} className="mr-2" />
//           <p className="text-lg">Bài đăng bạn bè</p>
//         </div>
//       </div>

//       <div className="w-4/5 bg-white p-4 overflow-auto">{renderContent()}</div>
//     </div>
//   );
// };

// export default PostPage;
