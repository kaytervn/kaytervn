import { useState, useEffect, useRef, useCallback } from "react";
import {
  CheckIcon,
  BellIcon,
  MailCheckIcon,
  TrashIcon,
  BellOffIcon,
  EyeIcon,
} from "lucide-react";
import useFetch from "../../hooks/useFetch";
import { ConfimationDialog } from "./Dialog";
import useDialog from "../../hooks/useDialog";
import PostDetail from "../post/pages/PostDetail";
import { PostModel } from "../../models/post/PostModel";
import { useLoading } from "../../hooks/useLoading";
import { useProfile } from "../../types/UserContext";
import { remoteUrl } from "../../types/constant";
import useSocketNotification from "../../hooks/useSocketNotification";

interface NotificationData {
  user?: {
    _id: string;
    displayName: string;
    avatarUrl: string;
  };
  post?: {
    _id: string;
  };
}

interface Notification {
  _id: string;
  message: string;
  status: 1 | 2; // 1 for unread, 2 for read
  createdAt: string;
  data?: NotificationData;
  kind?: number;
}

interface NotificationResponse {
  content: Notification[];
}

const NotificationPanel = () => {
  const { isDialogVisible, showDialog, hideDialog } = useDialog();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { get, put, del, loading } = useFetch();
  const [totalNotifications, setTotalNotifications] = useState();
  const [showModal, setShowModal] = useState(false);
  const [postItem, setPostItem] = useState<PostModel| null>(null);
  const { isLoading, showLoading, hideLoading } = useLoading();
  const observerTarget = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState(0);
  const { profile } = useProfile();
  const PAGE_SIZE = 10;

  const fetchNotifications = useCallback( async (pageNumber: number) => {
    try {
      setLoadingMore(true);
      const res = await get('/v1/notification/list', {
      
         page: pageNumber,
          size: PAGE_SIZE
        
      });
      
      const newNotifications = res.data.content;
      console.log("data noti", newNotifications)

      setTotalNotifications(res.data.totalElements);
      setTotalPages(res.data.totalPages);
      

      setNotifications(prev => 
        pageNumber === 0 
          ? newNotifications 
          : [...prev, ...newNotifications]
      );
      

      setHasMore(pageNumber < res.data.totalPages - 1);
      setLoadingMore(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoadingMore(false);
      setHasMore(false);
    }
  },[get]);


  useEffect(() => {
    fetchNotifications(0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchNotifications(nextPage);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, page, totalPages]);

  const markAsRead = async (id: string) => {
    await put(`/v1/notification/read/${id}`);
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif._id === id 
          ? { ...notif, status: 2 }
          : notif
      )
    );
  };

  const markAllAsRead = async () => {
    await put("/v1/notification/read-all");
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => ({
        ...notif,
        status: 2
      }))
    );
  };

  const deleteNotification = async (id: string) => {
    await del(`/v1/notification/delete/${id}`);
    setNotifications(prev => prev.filter(notif => notif._id !== id));
  };

  const deleteAllNotifications = async () => {
    await del("/v1/notification/delete-all");
    setNotifications([]);
    hideDialog();
  };
  const handleViewPost = async (postId: string) => {
    await getPostDetail(postId);
    setShowModal(true);
  };
  
  const getPostDetail = async (postId: string) => {
    try {
      const response = await get(`/v1/post/get/${postId}`);
      setPostItem(response.data);
      console.log("data post", response.data);
    } catch (error) {
      console.error('Error refreshing post detail:', error);
    }
  };
  const handleShowModal = () => {
    setShowModal(true);
    };
  const handleNewNotification = useCallback(() => {
      fetchNotifications(0);
    }, [fetchNotifications]);
  
  useSocketNotification({
    userId: profile?._id,
    remoteUrl,
    onNewNotification: handleNewNotification,

  })
  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-4">Thông báo</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && page === 1 ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <div key={notification._id} className="border-b last:border-b-0">
                <div className="flex items-start p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {notification.status === 1 ? (
                      <BellIcon className="h-5 w-5 text-blue-500" />
                    ) : (
                      <MailCheckIcon className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className={`text-sm ${notification.status === 1 ? 'font-bold' : 'font-normal'} text-gray-900`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.createdAt}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {notification.status === 1 && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition-colors duration-200"
                      >
                        <CheckIcon size={16} />
                      </button>
                    )}
                    {notification.data?.post && (
                      <button
                        onClick={() => handleViewPost(notification.data!.post!._id)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition-colors duration-200"
                      >
                        <EyeIcon size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {loadingMore && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            )}
            <div ref={observerTarget} className="h-4" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <BellOffIcon className="h-8 w-8 mb-2" />
            <p>Không có thông báo</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex justify-between items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {totalNotifications} thông báo
          </span>
          <div className="space-x-2">
            <button
              onClick={markAllAsRead}
              className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đánh dấu tất cả đã đọc
            </button>
            <button
              onClick={showDialog}
              className="px-3 py-1 text-xs font-medium text-white bg-red-600 border rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Xóa tất cả
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <PostDetail postItem={postItem} onClose={() => setShowModal(false)} />
      )}
      <ConfimationDialog
        isVisible={isDialogVisible}
        title="Xóa tất cả thông báo"
        message="Bạn có chắc muốn xóa tất cả thông báo?"
        onConfirm={deleteAllNotifications}
        confirmText="Xóa"
        onCancel={hideDialog}
        color="red"
      />
    </div>
  );
};

export default NotificationPanel;