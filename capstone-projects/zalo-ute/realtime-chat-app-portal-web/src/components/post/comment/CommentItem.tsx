import React, { useState } from 'react';
import { CommentModel } from '../../../models/comment/CommentModel';
import ChildComments from './ChildComments';
import useFetch from '../../../hooks/useFetch';
import { remoteUrl } from '../../../types/constant';
import { uploadImage } from '../../../types/utils';
import { toast } from 'react-toastify';
import { LoadingDialog } from '../../Dialog';
import CommentReplyInterface from './CommentReplyInterface';

const CommentItem = ({
  comment,
  isChild = false,
  childComments,
  onUpdate ,
  isLoading,
  onLoadMore,
}: {
  comment: CommentModel;
  isChild?: boolean;
  childComments?: CommentModel[];
  onUpdate: () => void
  isLoading?: boolean;
  onLoadMore?: (
    parentId: string,
    page: number
  ) => Promise<{ hasMore: boolean; totalRemaining: number }>;
}) => {
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [newReply, setNewReply] = useState('');
  const [selectedReplyImage, setSelectedReplyImage] = useState<File | null>(null);
  const { get, post, del, loading } = useFetch();
  const [comment1, setComment] = useState<CommentModel>(comment);
  const [isLiking, setIsLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);  
  const [editImage, setEditImage] = useState<File | null>(null); 
  const [editImagePreview, setEditImagePreview] = useState(comment.imageUrl || ""); 
  const [editContent, setEditContent] = useState<string>(comment.content || "");
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isRepliesVisible, setIsRepliesVisible] = useState(false);
  const [repliesVisible, setRepliesVisible] = useState(false);
  const [remainingReplies, setRemainingReplies] = useState(comment.totalChildren || 0);
  
  const handleLoadMoreReplies = async () => {
    if (!onLoadMore || remainingReplies === 0) return;

    const currentPage = Math.ceil((childComments?.length || 0) / 5); // Assuming 5 replies per page
    const result = await onLoadMore(comment._id, currentPage);

    if (result) {
      setRemainingReplies(result.totalRemaining); // Cập nhật số phản hồi còn lại
      setRepliesVisible(true);
    }
  };

  const handleReplySubmit = async (text: string, parentId: string) => {
    if (!text.trim() && !selectedReplyImage) {
      alert('Phản hồi phải có nội dung hoặc hình ảnh!');
      return;
    }
  
    setIsReplyLoading(true);
    try {
      const imageUrl = selectedReplyImage
        ? await uploadImage(selectedReplyImage, post)
        : '';
      const response = await fetch(`${remoteUrl}/v1/comment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          post: comment.post._id,
          content: text.trim(),
          parent: parentId,
          imageUrl,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể gửi phản hồi!');
      }
  
      const data = await response.json();
      console.log('Phản hồi đã gửi thành công:', data);
  
      setNewReply(''); // Reset trạng thái
      setSelectedReplyImage(null);
      setReplyTo(null);
    } catch (error) {
      console.error('Lỗi khi gửi phản hồi:', error);
      alert('Đã xảy ra lỗi khi gửi phản hồi. Vui lòng thử lại.');
    } finally {
      setIsReplyLoading(false);
    }
  };
  
  

  const handleImageSelect = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn tệp hình ảnh!');
        return;
      }
      setSelectedReplyImage(file);
    }
  };
  
  const handleLike = async (commentId: string) => {
    if (isLiking) return; 
    setIsLiking(true); 

    try {
      if (!isLiked) {
        const response = await fetch(`${remoteUrl}/v1/comment-reaction/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ comment: commentId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.message || 'Không thể thích bình luận!');
        }

        // Cập nhật giao diện sau khi thích
        setComment((prev) => ({
          ...prev,
          totalReactions: prev.totalReactions + 1,
        }));
        setIsLiked(true); // Đánh dấu đã thích
        console.log('Thích thành công');
      } else {
        // Gọi API để bỏ thích
        const response = await fetch(`${remoteUrl}/v1/comment-reaction/delete/${commentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.message || 'Không thể bỏ thích bình luận!');
        }

        // Cập nhật giao diện sau khi bỏ thích
        setComment((prev) => ({
          ...prev,
          totalReactions: Math.max(prev.totalReactions - 1, 0),
        }));
        setIsLiked(false); // Đánh dấu chưa thích
        console.log('Bỏ thích thành công');
      }
    } catch (error) {
      console.error('Lỗi khi xử lý thích:', error);
      alert('Đã xảy ra lỗi, vui lòng thử lại.');
    } finally {
      setIsLiking(false); // Kết thúc loading
    }
  };
  
  const removeReplyImage = () => {
    setSelectedReplyImage(null); // Xóa ảnh đã chọn
  };
  const toggleMenu = () => setMenuVisible((prev) => !prev);

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      setShowConfirm(false); // Ẩn pop-up xác nhận
      await del(`/v1/comment/delete/${comment._id}`); // Gọi API DELETE
      toast.success("Xóa bình luận thành công!");
      onUpdate();
    } catch (err) {
      console.error(err);
      toast.error("Không thể xóa bình luận. Vui lòng thử lại!");
    }finally {
      setIsDeleteLoading(false); 
    }
  };
  

  const handleUpdateComment = async () => {
    setIsUpdateLoading(true);
    try {
      let imageUrl = editImagePreview;
      if (editImage) {
        imageUrl = await uploadImage(editImage, post);
      }
      const response = await fetch(`${remoteUrl}/v1/comment/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          id: comment._id,
          content: editContent.trim(),
          imageUrl,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể cập nhật bình luận!");
      }
  
      // Cập nhật thành công
      const updatedComment = await response.json();
      setComment((prev) => ({ ...prev, ...updatedComment })); // Cập nhật state của comment
      toast.success("Cập nhật bình luận thành công!");
      setIsEditing(false); // Ẩn form chỉnh sửa
      onUpdate();
    } catch (err) {
      console.error(err);
      toast.error("Không thể cập nhật bình luận. Vui lòng thử lại!");
    }finally {
      setIsUpdateLoading(false); 
    }
  };

  return (
    <div className={`flex gap-2 ${isChild ? 'ml-8' : ''}`}>
      <LoadingDialog isVisible={isDeleteLoading} />
      {/* User Avatar */}
      <img
        src={comment.user.avatarUrl || '/default-avatar.png'}
        alt={comment.user.displayName}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex-1 relative">
        {/* Comment Content */}
        <div className="bg-gray-100 rounded-2xl px-4 py-2 inline-block">
          <p className="font-semibold">{comment.user.displayName}</p>
          <p>{comment.content}</p>
          {comment.imageUrl && (
            <img
              src={comment.imageUrl}
              alt="Comment Attachment"
              className="mt-2 rounded-lg max-w-full"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-1 text-sm items-center">
          {/* Like Button */}
          <button
            className="font-semibold hover:underline text-gray-500 flex items-center gap-2"
            disabled={isLiking}
            onClick={() => handleLike(comment._id)}
          >
            {isLiking ? (
              <span className="text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v4m0 0v4m0-4h4m-4 0H8m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            ) : isLiked ? 'Bỏ thích' : 'Thích'}
          </button>

          {/* Hiển thị trái tim nếu có like */}
          {comment1.totalReactions > 0 && (
            <div className="flex items-center gap-1 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>{comment1.totalReactions}</span>
            </div>
          )}

          {!isChild && (
            <button
              className="font-semibold hover:underline text-gray-500"
              onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
            >
              Phản hồi
            </button>
          )}
          
          <span className="text-gray-500">{comment.createdAt}</span>
        </div>
        {comment.isOwner === 1 && (
        <div className="absolute right-2 top-2">
      <button
        onClick={toggleMenu}
        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 12C6 13.1046 5.10457 14 4 14C2.89543 14 2 13.1046 2 12C2 10.8954 2.89543 10 4 10C5.10457 10 6 10.8954 6 12ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12ZM20 14C21.1046 14 22 13.1046 22 12C22 10.8954 21.1046 10 20 10C18.8954 10 18 10.8954 18 12C18 13.1046 18.8954 14 20 14Z" />
        </svg>
      </button>

      {menuVisible && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <button
            onClick={() => setIsEditing(true)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Chỉnh sửa
          </button>

          <button
            onClick={() => setShowConfirm(true)} // Hiển thị pop-up xác nhận
            disabled={loading}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Xóa bình luận
          </button>
        </div>
      )}
          {showConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-700">
                  Bạn có chắc chắn muốn xóa bình luận này?
                </h2>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={handleDelete} // Xác nhận xóa
                    disabled={isDeleteLoading}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50"
                  >
                    {isDeleteLoading ? "Đang xóa..." : "Xóa"}
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)} // Hủy
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>
        )}
        {isEditing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Chỉnh sửa bình luận
              </h2>
              <textarea
                value={editContent || ""}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 rounded-lg resize-none"
                rows={4}
                placeholder="Nhập nội dung mới..."
              />

              {editImagePreview && (
                <div className="relative mt-4">
                  <img
                    src={editImagePreview}
                    alt="Preview"
                    className="rounded-lg max-w-full"
                  />
                  <button
                    onClick={() => {
                      setEditImage(null);
                      setEditImagePreview("");
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                  >
                    X
                  </button>
                </div>
              )}
              <div className="mt-4">
                <label
                  htmlFor="edit-image-upload"
                  className="flex items-center gap-2 cursor-pointer text-blue-500 hover:underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Thay đổi hình ảnh</span>
                </label>
                <input
                  id="edit-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEditImage(file);
                      setEditImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={handleUpdateComment}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  disabled={isUpdateLoading}
                >
                  {isUpdateLoading ? 'Đang lưu...' : 'Lưu'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

      {!isChild && onLoadMore && (
          <ChildComments
            parentId={comment._id}
            childComments={childComments || []}
            isLoading={isLoading || false}
            onLoadMore={onLoadMore}
            totalChildren={comment.totalChildren}
          />
        )}

        {/* Reply Box (Di chuyển xuống dưới Child Comments) */}
        {!isChild && replyTo === comment._id && (
          <div className="mt-2">
            <CommentReplyInterface
              onSubmit={(text: string) => handleReplySubmit(text, comment._id)}
              isLoading={isReplyLoading}
              onImageSelect={handleImageSelect}
              selectedImage={selectedReplyImage}
              onRemoveImage={removeReplyImage}
              onRefreshPostDetail={onUpdate}
            />

            {/* Image Preview */}
            {selectedReplyImage && (
              <div className="relative mt-2">
                <img
                  src={URL.createObjectURL(selectedReplyImage)}
                  alt="Preview"
                  className="rounded-lg max-w-full"
                />
                <button
                  onClick={() => setSelectedReplyImage(null)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                >
                  X
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;