import React, { useEffect, useState } from "react";
import {
  XCircle,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Send,
  Image as IconImage,
} from "lucide-react";
import { Profile } from "../../../models/profile/Profile";
import CommentsSection from "../comment/CommentsSection";
import { toast } from "react-toastify";
import {
  remoteUrl,
  ZALO_UTE_PORTAL_ACCESS_TOKEN,
} from "../../../types/constant";
import { uploadImage } from "../../../types/utils";
import useFetch from "../../../hooks/useFetch";
import { useProfile } from "../../../types/UserContext";
import { LoadingDialog } from "../../Dialog";
import { CommentModel } from "../../../models/comment/CommentModel";

const PostDetail = ({ postItem, onClose }: any) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { get, post } = useFetch();
  const { profile } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<CommentModel[]>([]);
  // const [totalComments, setTotalComments] = useState(postItem.totalComments);
  // const [totalReactions, setTotalReactions] = useState(postItem.totalReactions);
  const [totalComments, setTotalComments] = useState(
    postItem?.totalComments || 0
  );
  const [totalReactions, setTotalReactions] = useState(
    postItem?.totalReactions || 0
  );
  useEffect(() => {
    const loadPostDetails = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPostDetails();
  }, [postItem]);

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return null;

    const imageUrl = await uploadImage(selectedImage, post);
    if (!imageUrl) {
      toast.error("Không thể tải lên hình ảnh");
    }
    return imageUrl;
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && !selectedImage) return;
    setIsLoading(true);
    try {
      const imageUrl = await handleImageUpload();

      const response = await fetch(`${remoteUrl}/v1/comment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            ZALO_UTE_PORTAL_ACCESS_TOKEN
          )}`,
        },
        body: JSON.stringify({
          post: postItem._id,
          content: newComment,
          imageUrl,
        }),
      });

      const data = await response.json();

      if (data.result) {
        setNewComment("");
        setSelectedImage(null);
        toast.success("Bình luận đã được gửi!");
      } else {
        toast.error("Không thể đăng bình luận");
      }
      setTotalComments((prev: any) => prev + 1);
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Đã có lỗi xảy ra khi đăng bình luận");
    } finally {
      setIsLoading(false);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === postItem.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? postItem.imageUrls.length - 1 : prev - 1
    );
  };

  const refreshPostDetail = async () => {
    try {
      setIsLoading(true);
      const response = await get("/v1/comment/list", { post: postItem._id });
      if (response.result) {
        setComments(response.data.content);
        console.log("commet", response.data.totalElements);
        setTotalComments(response.data.totalElements);
      }
    } catch (error) {
      console.error("Error refreshing post detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPostDetail();
  }, [postItem]);
  return (
    <div className="relative">
      {/* Loading Dialog */}
      <LoadingDialog isVisible={isLoading} />
      {!isLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl rounded-lg my-4 flex flex-col h-[90vh]">
            {/* Header - Sticky */}
            <div className="flex justify-between items-center p-4 border-b bg-white">
              <h2 className="text-xl font-semibold">
                Bài viết của {postItem.user.displayName}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>

            {/* Main Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                {/* Author Info */}
                <div className="flex items-center mb-4">
                  <img
                    src={postItem.user.avatarUrl}
                    alt={postItem.user.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-2">
                    <p className="font-semibold">{postItem.user.displayName}</p>
                    <p className="text-sm text-gray-500">
                      {postItem.createdAt}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <p className="mb-4">{postItem.content}</p>

                {/* Images */}
                {postItem.imageUrls.length > 0 && (
                  <div className="relative">
                    <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
                      <img
                        src={postItem.imageUrls[currentImageIndex]}
                        alt={`Post Image ${currentImageIndex + 1}`}
                        className="w-full h-full object-contain"
                      />
                      {postItem.imageUrls.length > 1 && (
                        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                          {currentImageIndex + 1} / {postItem.imageUrls.length}
                        </div>
                      )}
                    </div>
                    {postItem.imageUrls.length > 1 && (
                      <>
                        <button
                          onClick={previousImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                          aria-label="Next image"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="flex justify-between items-center py-2 border-y mt-4 text-gray-500 text-sm">
                  <div className="flex items-center gap-1">
                    {postItem.totalReactions > 0 && (
                      <span className="flex items-center gap-1">
                        <div className="bg-blue-500 p-1 rounded-full">
                          <Heart size={12} className="text-white" />
                        </div>
                        {postItem.totalReactions}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <span>{totalComments} bình luận</span>
                  </div>
                </div>

                {/* Comments List */}
                <div className="mt-4 pb-4">
                  <CommentsSection
                    postId={postItem._id}
                    totalComments={postItem.totalComments}
                    onRefresh={refreshPostDetail}
                  />
                </div>
              </div>
            </div>

            {/* Comment Input - Fixed at bottom */}
            {/* Form bình luận */}
            <div className="border-t bg-white p-4 mt-auto">
              <form
                onSubmit={handleSubmitComment}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={profile?.avatarUrl}
                    className="w-8 h-8 rounded-full"
                    alt="Current user"
                  />
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết bình luận..."
                    className="w-full px-4 py-2 bg-gray-100 rounded-full"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                      onChange={handleImageSelection}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <IconImage
                        size={20}
                        className="text-gray-500 hover:text-blue-500"
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-full gap-2"
                  >
                    <Send size={16} />
                    <span>Gửi</span>
                  </button>
                </div>

                {selectedImage && (
                  <div className="mt-2 flex items-center gap-4">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Preview"
                      className="w-16 h-16 rounded object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="text-red-500 text-sm font-semibold"
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
