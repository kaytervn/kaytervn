import Notification from "../models/notificationModel.js";
import { formatDistanceToNow } from "../configurations/schemaConfig.js";
import User from "../models/userModel.js";

const formatNotificationData = async (notification) => {
  let formattedData = { ...notification.data };
  if (formattedData.user) {
    const user = await User.findById(formattedData.user._id);
    if (user) {
      formattedData.user.displayName = user.displayName;
      formattedData.user.avatarUrl = user.avatarUrl;
    }
  }
  return {
    _id: notification._id,
    status: notification.status,
    kind: notification.kind,
    message: notification.message,
    data: formattedData,
    createdAt: formatDistanceToNow(notification.createdAt),
  };
};

const getListNotifications = async (req) => {
  const {
    message,
    status,
    isPaged,
    kind,
    page = 0,
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;
  const currentUser = req.user;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  let query = { user: currentUser._id };
  if (message) {
    query.message = { $regex: message, $options: "i" };
  }
  if (kind) {
    query.kind = Number(kind);
  }
  if (status) {
    query.status = Number(status);
  }

  const [totalElements, notifications] = await Promise.all([
    Notification.countDocuments(query),
    Notification.find(query).sort({ createdAt: -1 }).skip(offset).limit(limit),
  ]);

  const totalPages = Math.ceil(totalElements / limit);

  const result = await Promise.all(
    notifications.map(async (notification) => {
      return await formatNotificationData(notification);
    })
  );

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

export { getListNotifications };
