import { io } from "../index.js";
import ConversationMember from "../models/conversationMemberModel.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import Notification from "../models/notificationModel.js";
import {
  deleteFileByUrl,
  isValidObjectId,
  isValidUrl,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import {
  formatMessageData,
  getListMessages,
  createMessage as createMessageService,
} from "../services/messageService.js";
import { formatUserData } from "../services/userService.js";
import { secretKey } from "../static/constant.js";
import { decrypt, encrypt } from "../utils/utils.js";

const createMessage = async (req, res) => {
  try {
    const { conversation, content, parent, imageUrl } = req.body;
    const currentUser = req.user;
    const getConversation = await Conversation.findById(conversation);
    if (!getConversation) {
      return makeErrorResponse({ res, message: "Conversation not found" });
    }
    let parentMessage = null;
    if (isValidObjectId(parent)) {
      parentMessage = await Message.findById(parent);
      if (!parentMessage) {
        return makeErrorResponse({
          res,
          message: "Parent message not found",
        });
      }
    }
    await createMessageService(
      currentUser,
      getConversation,
      parentMessage,
      content,
      imageUrl
    );
    return makeSuccessResponse({
      res,
      message: "Create message success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateMessage = async (req, res) => {
  try {
    const { id, content, imageUrl } = req.body;
    const currentUser = req.user;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const message = await Message.findById(id);
    if (!message) {
      return makeErrorResponse({ res, message: "Message not found" });
    }
    if (message.imageUrl !== imageUrl) {
      await deleteFileByUrl(message.imageUrl);
    }
    const decryptedContent = decrypt(content, currentUser.secretKey);
    message.content = encrypt(decryptedContent, secretKey);
    message.imageUrl = isValidUrl(imageUrl) ? imageUrl : null;
    await message.save();
    io.to(message.conversation.toString()).emit("UPDATE_MESSAGE", message._id);
    const members = await ConversationMember.find({
      conversation: message.conversation,
    }).populate({
      path: "user",
      populate: {
        path: "role",
      },
    });
    await Promise.all(
      members.map(async (member) => {
        const formattedUserData = await formatUserData(member.user);
        io.to(member.user._id.toString()).emit(
          "NEW_NOTIFICATION",
          formattedUserData
        );
      })
    );
    return makeSuccessResponse({ res, message: "Message updated" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const id = req.params.id;
    const currentUser = req.user;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const message = await Message.findById(id);
    if (!message) {
      return makeErrorResponse({ res, message: "Message not found" });
    }
    const conversationMembers = await ConversationMember.find({
      conversation: message.conversation,
      user: { $ne: currentUser._id },
    });
    await message.deleteOne();
    await Notification.create(
      conversationMembers.map((member) => ({
        message: `${currentUser.displayName} đã đã thu hồi tin nhắn`,
        data: {
          user: {
            _id: currentUser._id,
          },
          conversation: {
            _id: member.conversation,
          },
        },
        user: member.user,
      }))
    );
    io.to(message.conversation.toString()).emit("DELETE_MESSAGE", message._id);
    const members = await ConversationMember.find({
      conversation: message.conversation,
    }).populate({
      path: "user",
      populate: {
        path: "role",
      },
    });
    await Promise.all(
      members.map(async (member) => {
        const formattedUserData = await formatUserData(member.user);
        io.to(member.user._id.toString()).emit(
          "NEW_NOTIFICATION",
          formattedUserData
        );
      })
    );
    return makeSuccessResponse({
      res,
      message: "Delete message success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getMessage = async (req, res) => {
  try {
    const id = req.params.id;
    const currentUser = req.user;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const message = await Message.findById(id).populate("user parent");
    return makeSuccessResponse({
      res,
      data: await formatMessageData(message, currentUser),
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const result = await getListMessages(req);
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { createMessage, updateMessage, deleteMessage, getMessage, getMessages };
