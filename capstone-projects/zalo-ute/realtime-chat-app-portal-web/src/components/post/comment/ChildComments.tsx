import React, { useState } from 'react';
import { CommentModel } from '../../../models/comment/CommentModel';

const EmojiPicker = ({ onEmojiSelect }:any) => {
  const emojis = ['😊', '😂', '😍', '👍', '😮'];
  
  return (
    <div className="flex gap-2 p-2 bg-white rounded-lg shadow-lg">
      {emojis.map((emoji, index) => (
        <button
          key={index}
          onClick={() => onEmojiSelect(emoji)}
          className="hover:bg-gray-100 p-1 rounded"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

const ChildComments = ({
  parentId,
  childComments,
  isLoading,
  onLoadMore,
  totalChildren
}: {
  parentId: string;
  childComments: CommentModel[];
  isLoading: boolean;
  onLoadMore: (parentId: string, page: number) => Promise<{ hasMore: boolean; totalRemaining: number }>;
  totalChildren: number;
}) => {
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [remainingComments, setRemainingComments] = useState(totalChildren);
  const [showComments, setShowComments] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleLoadMore = async () => {
    if (!showComments) {
      setShowComments(true);
    }
    
    const result = await onLoadMore(parentId, page);
    setHasMore(result.hasMore);
    setRemainingComments(result.totalRemaining);
    setPage(prev => prev + 1);
  };

  const handleEmojiSelect = (emoji: string) => {
    setReplyText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="mt-2">
      {totalChildren > 0 && (
        <>
          <button
            type="button"
            onClick={handleLoadMore}
            className="text-gray-500 hover:underline text-sm"
            disabled={isLoading}
          >
            {isLoading ? 'Đang tải...' : 
              (showComments 
                ? `Xem tất cả ${totalChildren} phản hồi`
                : `Xem tất cả ${totalChildren} phản hồi`)}
          </button>

          {showComments && childComments && childComments.length > 0 && (
            <div className="space-y-3 mt-3">
              {childComments.map(comment => (
                <div key={comment._id} className="flex items-start gap-2">
                  <img
                    src={comment.user.avatarUrl || '/default-avatar.png'}
                    alt={comment.user.displayName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl px-4 py-2">
                      <p className="font-semibold">{comment.user.displayName}</p>
                      <p>{comment.content}</p>
                    </div>
                    <div className="flex gap-4 mt-1 text-sm">
                      <button className="text-gray-500 hover:underline">
                        Thích
                      </button>
                      <button className="text-gray-500 hover:underline">
                        Phản hồi
                      </button>
                      <span className="text-gray-500">{comment.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showComments && (
            <div className="mt-3 flex gap-2">
              <img
                src="/default-avatar.png"
                alt="Current user"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 relative">
                <div className="flex items-center bg-gray-100 rounded-full pr-3">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Viết phản hồi..."
                    className="flex-1 bg-transparent px-4 py-1.5 focus:outline-none"
                  />
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    😊
                  </button>
                </div>
                {showEmojiPicker && (
                  <div className="absolute right-0 top-full mt-2 z-10">
                    <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChildComments;