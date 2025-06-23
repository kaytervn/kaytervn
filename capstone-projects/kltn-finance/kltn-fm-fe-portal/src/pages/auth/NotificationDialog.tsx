import {
  BellIcon,
  CheckCheckIcon,
  InboxIcon,
  RefreshCwIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { NOTIFICATION_STATE } from "../../services/constant";
import { ModalForm } from "../../components/form/FormCard";

const NotificationDialog = ({ isOpen, onClose }: any) => {
  const { notification, loading } = useApi();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    const response = await notification.myNotification({ isPaged: 0 });
    setNotifications(response?.data?.content || []);
  };

  const handleReadNotification = async (notificationId: string) => {
    try {
      await notification.read(notificationId);
      setNotifications((prev: any) =>
        prev.map((notif: any) =>
          notif.id === notificationId
            ? { ...notif, state: NOTIFICATION_STATE.READ }
            : notif
        )
      );
    } catch (error) {
      console.error("Error reading notification:", error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    await notification.del(notificationId);
    setNotifications((prev: any) =>
      prev.filter((notif: any) => notif.id !== notificationId)
    );
  };

  const handleReadAll = async () => {
    await notification.readAll();
    setNotifications((prev: any) =>
      prev.map((notif: any) => ({ ...notif, state: NOTIFICATION_STATE.READ }))
    );
  };

  const handleDeleteAll = async () => {
    try {
      await notification.deleteAll();
      setNotifications([]);
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
  };

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter(
          (notif: any) => notif.state == NOTIFICATION_STATE.SENT
        )
      : notifications;

  if (!isOpen) return null;

  return (
    <>
      <ModalForm isVisible={isOpen} onClose={onClose} title={"Thông báo"}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "all"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
              onClick={() => setActiveTab("all")}
            >
              <span className="flex items-center gap-2">
                <BellIcon size={16} />
                Tất cả
              </span>
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "unread"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
              onClick={() => setActiveTab("unread")}
            >
              <span className="flex items-center gap-2">
                <BellIcon size={16} className="fill-current" />
                Chưa đọc
              </span>
            </button>
          </div>
          <button
            onClick={fetchNotifications}
            className="p-2 rounded-full hover:bg-gray-800 transition-all"
            title="Làm mới"
          >
            <RefreshCwIcon size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-4"></div>

        <div className="max-h-80 overflow-y-auto px-1 rounded-lg">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif: any) => (
              <div
                key={notif.id}
                className={`flex cursor-pointer items-center p-3 mb-2 rounded-lg transition-all ${
                  notif.state == NOTIFICATION_STATE.SENT
                    ? "bg-gray-800/50 hover:bg-gray-800"
                    : "hover:bg-gray-800/50"
                }`}
              >
                {notif.state == NOTIFICATION_STATE.SENT ? (
                  <div className="mr-3 h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                ) : (
                  <div className="mr-3 w-2"></div>
                )}
                <div
                  className="flex-1"
                  onClick={() =>
                    notif.state == NOTIFICATION_STATE.SENT &&
                    handleReadNotification(notif.id)
                  }
                >
                  <p
                    className={`text-sm ${
                      notif.state == NOTIFICATION_STATE.SENT
                        ? "font-medium text-white"
                        : "text-gray-300"
                    }`}
                  >
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {notif.createdAt}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteNotification(notif.id)}
                  className="ml-2 p-1 rounded-full hover:bg-red-900/50 text-gray-400 hover:text-red-300 transition-all"
                  title="Xóa thông báo"
                >
                  <Trash2Icon size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center py-12 text-gray-400 bg-gray-800/30 rounded-lg">
              <InboxIcon size={48} className="text-gray-600" />
              <p className="mt-4 text-gray-500">Không có thông báo nào</p>
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              className="flex items-center gap-2 rounded-lg bg-gray-800 hover:bg-gray-700 px-4 py-2 text-sm text-gray-300 transition-all"
              onClick={handleReadAll}
            >
              <CheckCheckIcon size={16} />
              Đọc tất cả
            </button>
            <button
              className="flex items-center gap-2 rounded-lg bg-red-900/50 hover:bg-red-900 px-4 py-2 text-sm text-red-300 hover:text-white transition-all"
              onClick={handleDeleteAll}
            >
              <Trash2Icon size={16} />
              Xóa tất cả
            </button>
          </div>
        )}
      </ModalForm>
    </>
  );
};

export default NotificationDialog;
