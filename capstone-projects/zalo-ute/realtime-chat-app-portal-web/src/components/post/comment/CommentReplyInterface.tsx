import React, { useState } from 'react';
import { useProfile } from "../../../types/UserContext";

const CommentReplyInterface = ({ 
  onSubmit, 
  isLoading = false,
  onImageSelect,
  selectedImage,
  onRemoveImage,
  onRefreshPostDetail,
}: any) => {
  const [replyText, setReplyText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { profile } = useProfile();

  const emojis = ['😀', '😊', '😂', '❤️', '👍'];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (replyText.trim() || selectedImage) {
      try {
        await onSubmit(replyText); // Gửi phản hồi
        setReplyText(''); // Reset nội dung
        if (onRefreshPostDetail) {
          await onRefreshPostDetail(); // Gọi hàm refresh
        }
      } catch (error) {
        console.error('Lỗi khi gửi phản hồi:', error);
      }
    }
  };

  return (
    <div className="flex items-start gap-2 p-2 bg-gray-100 rounded-lg">
    <img 
      src={profile?.avatarUrl}
      alt="User avatar"
      className="w-8 h-8 rounded-full"
    />
    
    <form onSubmit={handleSubmit} className="flex-1">
      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Viết phản hồi..."
            className="w-full px-4 py-2 bg-white rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3.975 3.975 0 015.542 0 1 1 0 001.415-1.415 5.975 5.975 0 00-8.372 0 1 1 0 000 1.415z" clipRule="evenodd" />
              </svg>
            </button>

            <label className="p-1 hover:bg-gray-100 rounded-full cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => onImageSelect(e.target.files)}
              />
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || (!replyText.trim() && !selectedImage)}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            isLoading || (!replyText.trim() && !selectedImage)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Đang gửi...' : 'Gửi'}
        </button>
      </div>

      {showEmojiPicker && (
        <div className="absolute mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 flex gap-2">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setReplyText((prev) => prev + emoji);
                setShowEmojiPicker(false);
              }}
              className="hover:bg-gray-100 p-1 rounded"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </form>
  </div>
);
};

export default CommentReplyInterface;