import { io } from "../index.js";
import Notification from "../models/notificationModel.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { getListNotifications } from "../services/notificationService.js";
import { formatUserData } from "../services/userService.js";

const getMyNotifications = async (req, res) => {
  try {
    const result = await getListNotifications(req);
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const readNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: user._id },
      { status: 2 },
      { new: true }
    );
    if (!notification) {
      return makeErrorResponse({ res, message: "Notification not found" });
    }
    io.to(user._id.toString()).emit(
      "NEW_NOTIFICATION",
      await formatUserData(user)
    );
    const result = await Notification.find({ user: user._id }).sort({
      createdAt: -1,
    });
    return makeSuccessResponse({
      res,
      message: "Notification marked as read",
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const readAllNotifications = async (req, res) => {
  try {
    const { user } = req;
    await Notification.updateMany({ user: user._id, status: 1 }, { status: 2 });
    const result = await Notification.find({ user: user._id }).sort({
      createdAt: -1,
    });
    io.to(user._id.toString()).emit(
      "NEW_NOTIFICATION",
      await formatUserData(user)
    );
    return makeSuccessResponse({
      res,
      message: "All notifications marked as read",
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: user._id,
    });
    if (!notification) {
      return makeErrorResponse({ res, message: "Notification not found" });
    }
    io.to(user._id.toString()).emit(
      "NEW_NOTIFICATION",
      await formatUserData(user)
    );
    const result = await Notification.find({ user: user._id }).sort({
      createdAt: -1,
    });
    return makeSuccessResponse({
      res,
      message: "Notification deleted successfully",
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteAllNotifications = async (req, res) => {
  try {
    const { user } = req;
    await Notification.deleteMany({ user: user._id });
    io.to(user._id.toString()).emit(
      "NEW_NOTIFICATION",
      await formatUserData(user)
    );
    const result = await Notification.find({ user: user._id }).sort({
      createdAt: -1,
    });
    return makeSuccessResponse({
      res,
      message: "All notifications deleted successfully",
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export {
  getMyNotifications,
  readNotification,
  readAllNotifications,
  deleteNotification,
  deleteAllNotifications,
};
