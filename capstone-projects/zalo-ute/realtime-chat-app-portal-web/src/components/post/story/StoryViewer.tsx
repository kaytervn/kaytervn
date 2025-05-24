import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { StoryModel } from "../../../models/story/StoryModel";
import {
  remoteUrl,
  ZALO_UTE_PORTAL_ACCESS_TOKEN,
} from "../../../types/constant";
import { toast } from "react-toastify";
import { useLoading } from "../../../hooks/useLoading";
import { LoadingDialog } from "../../Dialog";
import CreateStory from "./CreateStory";
import { useProfile } from "../../../types/UserContext";

const StoryViewer = () => {
  const [stories, setStories] = useState<
    (StoryModel | { id: string; type: string; displayName: string })[]
  >([
    {
      id: "create",
      type: "create",
      displayName: "Tạo tin",
    },
  ]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentStory, setCurrentStory] = useState<StoryModel | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { isLoading, showLoading, hideLoading } = useLoading();
  const [isCreateVisible, setCreateVisible] = useState(false);
  const { profile } = useProfile();

  const storiesPerPage = 4;
  const autoTransitionTime = 5000;
  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex + storiesPerPage < stories.length;

  useEffect(() => {
    fetchInitialStories();
  }, []);

  useEffect(() => {
    if (isPopupVisible && currentStory && !isPaused) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 100 / (autoTransitionTime / 100);
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            handleNextStory();
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(progressInterval);
    }
  }, [isPopupVisible, currentStory?._id, isPaused]);

  const fetchInitialStories = async () => {
    try {
      const response = await fetch(`${remoteUrl}/v1/story/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            ZALO_UTE_PORTAL_ACCESS_TOKEN
          )}`,
        },
      });
      const data = await response.json();
      if (data.result) {
        const storiesFromAPI = data.data.content;
        setStories([
          { id: "create", type: "create", displayName: "Tạo tin" }, // Luôn thêm phần tử "Tạo tin" ở đầu
          ...storiesFromAPI,
        ]);
      }
    } catch (error) {
      toast.error("Không thể tải stories");
    }
  };

  const deleteStory = async (storyId: string) => {
    showLoading();
    try {
      const response = await fetch(`${remoteUrl}/v1/story/delete/${storyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            ZALO_UTE_PORTAL_ACCESS_TOKEN
          )}`,
        },
      });
      const data = await response.json();
      if (data.result) {
        toast.success("Xóa story thành công");
        handleNextStory();
        fetchInitialStories();
      } else {
        toast.error("Không thể xóa story");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa story");
    } finally {
      hideLoading();
    }
  };

  const fetchStoryById = async (storyId: string) => {
    try {
      const response = await fetch(`${remoteUrl}/v1/story/get/${storyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            ZALO_UTE_PORTAL_ACCESS_TOKEN
          )}`,
        },
      });
      const data = await response.json();
      if (data.result) {
        return data.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching story:", error);
      return null;
    }
  };
  const handleDeleteClick = () => {
    setIsPaused(true); // Tạm dừng story khi hiển thị dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (currentStory) {
      await deleteStory(currentStory._id);
      setShowConfirmDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setIsPaused(false); // Tiếp tục story khi đóng dialog
  };
  const openStoryViewer = async (story: StoryModel) => {
    const fullStory = await fetchStoryById(story._id);
    if (fullStory) {
      setCurrentStory(fullStory);
      setIsPopupVisible(true);
      setProgress(0);
      setIsPaused(false);
    }
  };

  const handleNextStory = async () => {
    setIsTransitioning(true);
    setProgress(0); // Reset progress ngay lập tức

    if (!currentStory?.nextStory) {
      setIsPopupVisible(false); // Đóng viewer nếu không có story tiếp theo
      setIsTransitioning(false);
      return;
    }

    const nextStory = await fetchStoryById(currentStory.nextStory);
    if (nextStory) {
      setCurrentStory(nextStory); // Đặt story mới
      setIsPaused(false); // Tiếp tục nếu đang tạm dừng
      setIsTransitioning(false);
    }
  };

  const handlePrevStory = async () => {
    if (!currentStory?.previousStory) {
      return;
    }

    setIsTransitioning(true);
    setProgress(0);

    const prevStory = await fetchStoryById(currentStory.previousStory);
    if (prevStory) {
      setCurrentStory(prevStory);
      setIsPaused(false);
      setIsTransitioning(false);
    }
  };

  const nextStories = () => {
    if (canScrollRight) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const prevStories = () => {
    if (canScrollLeft) {
      setStartIndex((prev) => prev - 1);
    }
  };
  const isCreateType = (
    story: StoryModel | { id: string; type: string; displayName: string }
  ): story is { id: string; type: string; displayName: string } => {
    return "type" in story;
  };
  const handleStoryCreated = () => {
    fetchInitialStories(); // Làm mới danh sách stories sau khi tạo tin mới
  };
  const sortedStories = [
    ...stories.filter(isCreateType), // Luôn giữ phần tử "Tạo tin" trước
    ...stories.filter((story) => !isCreateType(story)), // Các story khác
  ];

  const visibleStories = sortedStories.slice(
    startIndex,
    startIndex + storiesPerPage
  );

  return (
    <div className="flex justify-center relative space-x-4 w-full">
      {/* Navigation Buttons */}
      {canScrollLeft && (
        <button
          onClick={prevStories}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
      )}

      {/* Stories Grid */}
      <div className="flex justify-center space-x-4 overflow-hidden">
        {visibleStories.map((story) => (
          <div
            key={"id" in story ? story.id : story._id}
            className="flex-shrink-0 w-32"
          >
            {isCreateType(story) ? (
              // Create Story Button
              <div
                className="relative h-48 rounded-xl bg-gray-100 flex flex-col items-center justify-between pb-4 cursor-pointer hover:bg-gray-200"
                onClick={() => setCreateVisible(true)}
              >
                <div
                  className="w-full h-36 bg-white rounded-t-xl flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${
                      profile?.avatarUrl || "/default-avatar.png"
                    })`,
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                </div>
                <span className="text-sm font-medium text-center">
                  {story.displayName}
                </span>
              </div>
            ) : (
              // Story Item
              <div
                className="relative h-48 rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => openStoryViewer(story as StoryModel)}
              >
                <img
                  src={story.imageUrl || "/placeholder-image.png"}
                  alt={story.user?.displayName || "Story Image"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <div className="w-10 h-10 rounded-full border-4 border-blue-500 overflow-hidden">
                    <img
                      src={story.user?.avatarUrl || "/default-avatar.png"}
                      alt={story.user?.displayName || "User Avatar"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white text-xs font-medium leading-tight">
                    {story.user?.displayName || "Anonymous"}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Next Button */}
      {canScrollRight && (
        <button
          onClick={nextStories}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      )}
      {isPopupVisible && currentStory && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setIsPopupVisible(false)}
            className="absolute top-4 right-4 text-white text-2xl z-50 hover:bg-white/10 rounded-full p-2"
          >
            ×
          </button>
          {showConfirmDialog && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center">
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={handleCancelDelete}
              />

              {/* Dialog */}
              <div className="relative bg-white rounded-lg p-6 min-w-[300px] z-[61]">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Xác nhận xóa
                </h3>
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn xóa story này không?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancelDelete}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Container with Border */}
          <div className="relative w-[33vw] h-screen bg-black border-x-2 border-white">
            {/* Top Section with Progress Bars */}
            <div className="p-4 space-y-4">
              {/* Progress Bars */}
              <div className="flex space-x-1 z-40">
                {Array.from({ length: currentStory.totalStories }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-1 flex-1 bg-gray-600 rounded-full overflow-hidden"
                    >
                      <div
                        className="h-full bg-white transition-all duration-100"
                        style={{
                          width: `${
                            index === currentStory.position
                              ? progress
                              : index < currentStory.position
                              ? 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  )
                )}
              </div>

              {/* Controls Row */}
              <div className="flex justify-between items-center">
                {/* Left Side - User Info */}
                <div className="flex items-center space-x-2 text-white">
                  <img
                    src={currentStory.user.avatarUrl}
                    alt={currentStory.user.displayName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                  />
                  <div>
                    <p className="font-semibold text-sm">
                      {currentStory.user.displayName}
                    </p>
                    <p className="text-xs opacity-75">
                      {currentStory.createdAt}
                    </p>
                  </div>
                </div>

                {/* Right Side - Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="text-white p-2 hover:bg-white/10 rounded-full"
                  >
                    {isPaused ? <Play size={20} /> : <Pause size={20} />}
                  </button>

                  {currentStory.isOwner === 1 && (
                    <button
                      onClick={handleDeleteClick}
                      className="text-white p-2 hover:bg-red-600/20 rounded-full"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Story Content */}
            <div className="relative h-[calc(100vh-116px)]">
              {" "}
              {/* Adjust height based on header size */}
              <img
                src={currentStory.imageUrl}
                alt={currentStory.user.displayName}
                className="w-full h-full object-contain"
              />
              {/* Navigation Buttons */}
              {currentStory.previousStory && (
                <button
                  onClick={handlePrevStory}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 z-50 rounded-full transition-colors"
                >
                  <ChevronLeft size={30} />
                </button>
              )}
              {currentStory.nextStory && (
                <button
                  onClick={handleNextStory}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 z-50 rounded-full transition-colors"
                >
                  <ChevronRight size={30} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <CreateStory
        isVisible={isCreateVisible}
        setVisible={setCreateVisible}
        profile={null} // Thay bằng thông tin profile nếu cần
        onButtonClick={handleStoryCreated}
      />
      <LoadingDialog isVisible={isLoading} />
    </div>
  );
};

export default StoryViewer;
