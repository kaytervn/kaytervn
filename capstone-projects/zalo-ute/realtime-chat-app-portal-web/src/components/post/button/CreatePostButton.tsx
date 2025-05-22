import React, { useState } from 'react';
import { Image, SmileIcon, X } from 'lucide-react';

const CreatePostButton = ({
  onCreatePost,
  avatarUrl = "/api/placeholder/32/32",
  displayName,
}: any) => {
  const [isEmotionPopupOpen, setIsEmotionPopupOpen] = useState(false);

  // Danh sách cảm xúc và biểu tượng
  const emotionsWithIcons = [
    { emotion: "Vui vẻ", icon: "😊" },
    { emotion: "Buồn", icon: "😢" },
    { emotion: "Hạnh phúc", icon: "😁" },
    { emotion: "Hào hứng", icon: "🤩" },
    { emotion: "Tuyệt vời", icon: "👍" },
    { emotion: "Biết ơn", icon: "🙏" },
    { emotion: "Được yêu", icon: "❤️" },
    { emotion: "Giận dữ", icon: "😡" },
    { emotion: "Mệt mỏi", icon: "😴" },
    { emotion: "Thư giãn", icon: "😌" },
    { emotion: "Lo lắng", icon: "😟" },
    { emotion: "Đáng yêu", icon: "😍" },
  ];

  const toggleEmotionPopup = () => {
    setIsEmotionPopupOpen(!isEmotionPopupOpen);
  };

  const handleEmotionSelect = (emotion: any) => {
    setIsEmotionPopupOpen(false); // Đóng popup cảm xúc
    onCreatePost(emotion); // Gọi hàm mở CreatePost và truyền cảm xúc
  };

  return (
    <div className="w-full bg-white shadow-sm rounded-lg mb-4">
      <div className="p-4">
        {/* Input area */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={avatarUrl}
            alt="User avatar"
            className="w-10 h-10 rounded-full"
          />
          <button
            className="w-full h-10 px-4 text-left text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full"
            onClick={() => onCreatePost(null)} // Mở CreatePost với nội dung trống
          >
            {displayName} ơi, Bạn đang nghĩ gì thế?
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 pt-2 border-t">
          <button
            className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => onCreatePost(null)} // Mở CreatePost với nội dung trống
          >
            <Image className="w-5 h-5 mr-2" />
            Ảnh/video
          </button>

          <button
            className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={toggleEmotionPopup} // Mở popup cảm xúc
          >
            <SmileIcon className="w-5 h-5 mr-2" />
            Cảm xúc/hoạt động
          </button>
        </div>
      </div>

      {/* Popup Cảm xúc/Hoạt động */}
      {isEmotionPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-96 p-4 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={toggleEmotionPopup}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Bạn đang cảm thấy thế nào?</h2>

            <div className="grid grid-cols-2 gap-3">
              {emotionsWithIcons.map((item, index) => (
                <button
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition"
                  onClick={() => handleEmotionSelect(item)} // Gọi hàm xử lý chọn cảm xúc
                >
                  <span className="text-2xl">{item.icon}</span> {/* Icon cảm xúc */}
                  {item.emotion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostButton;
