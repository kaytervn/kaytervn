import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  TrashIcon,
  XCircleIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ThumbsUpIcon,
  MessageSquareIcon,
  PencilIcon,
  HeartIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import userImg from "../../assets/user_icon.png";
import useFetch from "../../hooks/useFetch";
import { ConfimationDialog, LoadingDialog } from "../Dialog";
import useDialog2 from "../../hooks/useDialog2";

const getKindTag = (kind: any) => {
  const tags: any = {
    1: ["bg-green-100 text-green-800", "Công khai"],
    2: ["bg-blue-100 text-blue-800", "Bạn bè"],
    3: ["bg-purple-100 text-purple-800", "Chỉ mình tôi"],
  };
  return tags[kind] ? (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full ${tags[kind][0]}`}
    >
      {tags[kind][1]}
    </span>
  ) : null;
};

const getStatusTag = (status: any) => {
  const tags: any = {
    1: ["bg-yellow-100 text-yellow-800", "Đang chờ"],
    2: ["bg-green-100 text-green-800", "Đã chấp nhận"],
    3: ["bg-red-100 text-red-800", "Đã từ chối"],
  };
  return tags[status] ? (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full ${tags[status][0]}`}
    >
      {tags[status][1]}
    </span>
  ) : null;
};

const ImageCarousel = ({ images, onImageClick }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = (e: any) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e: any) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full" style={{ height: "400px" }}>
      <div className="absolute inset-0">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-contain cursor-pointer rounded-lg bg-slate-50"
          style={{ height: "400px" }}
          onClick={() => onImageClick(currentIndex)}
        />
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-75"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-75"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_: any, idx: any) => (
              <button
                key={idx}
                className={`h-2 w-2 rounded-full ${
                  idx === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ImageViewer = ({ image, onClose }: any) => {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white hover:text-gray-300"
        onClick={onClose}
      >
        <XIcon className="h-8 w-8" />
      </button>
      <img
        src={image}
        alt="Full size"
        className="h-[90vh] w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

const PostReview = ({ isVisible, setVisible, postId, onButtonClick }: any) => {
  const [mode, setMode] = useState("view");
  const [reason, setReason] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [post, setPost] = useState<any>(null);
  const { get, put, del, loading } = useFetch();
  const { isDialogVisible, showDialog, hideDialog, dialogConfig } =
    useDialog2();

  useEffect(() => {
    hideDialog();
    setPost(null);
    setMode("view");
    setReason("");
    const fetchPost = async () => {
      const res = await get(`/v1/post/get/${postId}`);
      setPost(res.data);
    };
    if (postId) {
      fetchPost();
    }
  }, [postId, isVisible]);

  const handleUpdate = async (action: string) => {
    if (action === "reject" && !reason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    const actionMap: any = {
      accept: { status: 2, message: "Xét duyệt bài đăng thành công" },
      reject: { status: 3, message: "Từ chối bài đăng thành công" },
      delete: { message: "Xóa bài đăng thành công" },
    };

    if (action === "delete") {
      showDialog({
        title: "Xóa bài đăng",
        message: "Bạn có chắc muốn xóa bài đăng này?",
        confirmText: "Xóa",
        color: "red",
        onConfirm: async () => {
          const res = await del(`/v1/post/delete/${postId}`);
          hideDialog();
          if (res?.result) {
            toast.success(actionMap.delete.message);
            setVisible(false);
            onButtonClick();
          }
        },
        onCancel: hideDialog,
      });
    } else {
      showDialog({
        title: action == "accept" ? "Xét duyệt bài đăng" : "Từ chối bài đăng",
        message:
          action == "accept"
            ? "Bạn có chắc muốn chấp nhận bài đăng này?"
            : "Bạn có chắc muốn từ chối bài đăng này?",
        confirmText: action == "accept" ? "Chấp nhận" : "Từ chối",
        color: action == "accept" ? "green" : "red",
        onConfirm: async () => {
          const res = await put(`/v1/post/change-state`, {
            id: postId,
            status: actionMap[action].status,
            reason: action === "reject" ? reason : "",
          });
          hideDialog();
          if (res?.result) {
            toast.success(actionMap[action].message);
            setVisible(false);
            onButtonClick();
          }
        },
        onCancel: hideDialog,
      });
    }
  };

  if (loading || !post) {
    return <LoadingDialog isVisible={loading} />;
  } else if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-40 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                    src={post?.user.avatarUrl || userImg}
                    alt=""
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {post?.user.displayName}
                    </h3>
                    <p className="text-sm text-gray-500">{post?.createdAt}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {getKindTag(post?.kind)}
                  {getStatusTag(post?.status)}
                </div>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="flex flex-row text-base text-gray-900 whitespace-pre-wrap mb-4">
                {post.isUpdated === 1 && (
                  <PencilIcon className="text-blue-500 mr-2 w-5" />
                )}
                {post?.content}
              </div>
              {post.imageUrls.length > 0 && (
                <div className="mb-6">
                  <ImageCarousel
                    images={post.imageUrls}
                    onImageClick={(index: any) =>
                      setSelectedImage(post.imageUrls[index])
                    }
                  />
                </div>
              )}

              <div className="flex items-center space-x-6 text-gray-500">
                <div className="flex items-center">
                  <HeartIcon className="h-5 w-5 mr-2" />
                  <span>{post.totalReactions} lượt thích</span>
                </div>
                <div className="flex items-center">
                  <MessageSquareIcon className="h-5 w-5 mr-2" />
                  <span>{post.totalComments} bình luận</span>
                </div>
              </div>

              {post.status === 1 && mode === "reject" && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lý do từ chối
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Nhập lý do từ chối bài đăng..."
                  />
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              {post.status === 1 ? (
                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    onClick={() => setVisible(false)}
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      mode === "reject"
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "text-red-600 bg-white border border-red-600 hover:bg-red-50"
                    }`}
                    onClick={() => {
                      if (mode === "reject") {
                        handleUpdate("reject");
                      } else {
                        setMode("reject");
                      }
                    }}
                  >
                    <XCircleIcon className="h-5 w-5 mr-2" />
                    Từ chối
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      mode === "accept"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "text-green-600 bg-white border border-green-600 hover:bg-green-50"
                    }`}
                    onClick={() => {
                      if (mode === "accept") {
                        handleUpdate("accept");
                      } else {
                        setMode("accept");
                      }
                    }}
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Chấp nhận
                  </button>
                </div>
              ) : (
                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    onClick={() => setVisible(false)}
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                    onClick={() => handleUpdate("delete")}
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Xóa bài đăng
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <ConfimationDialog
          isVisible={isDialogVisible}
          title={dialogConfig.title}
          message={dialogConfig.message}
          onConfirm={dialogConfig.onConfirm}
          onCancel={dialogConfig.onCancel}
          confirmText={dialogConfig.confirmText}
          color={dialogConfig.color}
        />
      </div>
      <ImageViewer
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
};

export default PostReview;
