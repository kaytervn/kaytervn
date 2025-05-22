import { io } from "../index.js";
import Message from "../models/messageModel.js";
import MessageReaction from "../models/messageReactionModel.js";
import Notification from "../models/notificationModel.js";
import {
  isValidObjectId,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { getListMessageReactions } from "../services/messageReactionService.js";

const createMessageReaction = async (req, res) => {
  try {
    const { message } = req.body;
    const { user } = req;
    if (!isValidObjectId(message)) {
      return makeErrorResponse({ res, message: "Invalid message" });
    }
    const getMessage = await Message.findById(message);
    await MessageReaction.create({
      user: user._id,
      message,
    });
    if (!user._id.equals(getMessage.user)) {
      await Notification.create({
        user: getMessage.user,
        data: {
          conversation: {
            _id: getMessage.conversation,
          },
          message: {
            _id: getMessage._id,
          },
          user: {
            _id: user._id,
          },
        },
        message: `${user.displayName} đã thả tim tin nhắn của bạn`,
      });
    }
    io.to(getMessage.conversation.toString()).emit(
      "UPDATE_MESSAGE",
      getMessage._id
    );
    return makeSuccessResponse({
      res,
      message: "Create message reaction success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteMessageReaction = async (req, res) => {
  try {
    const messageId = req.params.id;
    const { user } = req;
    const messageReaction = await MessageReaction.findOne({
      message: messageId,
      user: req.user._id,
    });
    if (!messageReaction) {
      return makeErrorResponse({ res, message: "Message reaction not found" });
    }
    await messageReaction.deleteOne();
    const message = await Message.findById(messageId);
    io.to(message.conversation.toString()).emit("UPDATE_MESSAGE", message._id);
    return makeSuccessResponse({
      res,
      message: "Delete message reaction success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getMessageReactions = async (req, res) => {
  try {
    const result = await getListMessageReactions(req);
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { createMessageReaction, deleteMessageReaction, getMessageReactions };
