import Conversation from "../models/conversationModel.js";
import ConversationMember from "../models/conversationMemberModel.js";
import {
  deleteFileByUrl,
  isValidObjectId,
  isValidUrl,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import Notification from "../models/notificationModel.js";
import {
  formatConversationData,
  getListConversations,
} from "../services/conversationService.js";
import { validateMaxConversations } from "../services/settingService.js";
import { io } from "../index.js";
import { createMessage } from "../services/messageService.js";
import { encrypt } from "../utils/utils.js";

const createConversation = async (req, res) => {
  try {
    const { name, avatarUrl, conversationMembers } = req.body;
    const currentUser = req.user;
    const errors = [];
    if (!name || !name.trim()) {
      errors.push({ field: "name", message: "name cannot be null" });
    }
    if (!conversationMembers) {
      errors.push({
        field: "conversationMembers",
        message: "conversationMembers cannot be null",
      });
    } else if (!Array.isArray(conversationMembers)) {
      errors.push({
        field: "conversationMembers",
        message: "conversationMembers must be an array",
      });
    } else {
      const validMembers = conversationMembers.filter(
        (item) => isValidObjectId(item) && !currentUser._id.equals(item)
      );
      if (validMembers.length < 2) {
        errors.push({
          field: "conversationMembers",
          message: "conversationMembers must have at least 2 members",
        });
      }
    }
    if (errors.length > 0) {
      return makeErrorResponse({ res, message: "Invalid form", data: errors });
    }
    const isAllowed = await validateMaxConversations(currentUser);
    if (!isAllowed) {
      return makeErrorResponse({
        res,
        message: "Bạn đã đạt giới hạn tạo nhóm hội thoại",
      });
    }
    const conversation = await Conversation.create({
      name,
      kind: 1,
      avatarUrl: isValidUrl(avatarUrl) ? avatarUrl : null,
      owner: currentUser._id,
    });
    // Add current user to conversation
    await ConversationMember.create({
      conversation: conversation._id,
      user: currentUser._id,
      canAddMember: 1,
      canUpdate: 1,
    });
    // Add members to conversation
    await ConversationMember.create(
      conversationMembers.map((member) => ({
        conversation: conversation._id,
        user: member,
      }))
    );
    const members = await ConversationMember.find({
      conversation: conversation._id,
      user: { $ne: currentUser._id },
    }).populate("user");
    await createMessage(
      currentUser,
      conversation,
      null,
      encrypt(
        `Chào mừng, ${members
          .map((member) => member.user.displayName)
          .join(", ")}`,
        currentUser.secretKey
      ),
      null
    );
    await Notification.create(
      conversationMembers.map((member) => ({
        message: `Bạn đã được ${currentUser.displayName} thêm vào cuộc trò chuyện "${conversation.name}"`,
        data: {
          conversation: {
            _id: conversation._id,
          },
          user: {
            _id: currentUser._id,
          },
        },
        user: member,
      }))
    );
    return makeSuccessResponse({
      res,
      message: "Create conversation success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateConversation = async (req, res) => {
  try {
    const { id, name, avatarUrl } = req.body;
    const currentUser = req.user;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return makeErrorResponse({ res, message: "Conversation not found" });
    }
    if (conversation.avatarUrl !== avatarUrl) {
      await deleteFileByUrl(conversation.avatarUrl);
    }
    await conversation.updateOne({ name, avatarUrl });
    const conversationMembers = await ConversationMember.find({
      conversation: id,
      user: { $ne: currentUser._id },
    });
    await Notification.create(
      conversationMembers.map((member) => ({
        message: `${currentUser.displayName} đã cập nhật thông tin nhóm`,
        data: {
          conversation: {
            _id: conversation._id,
          },
          user: {
            _id: currentUser._id,
          },
        },
        user: member.user,
      }))
    );
    io.to(conversation._id.toString()).emit(
      "UPDATE_CONVERSATION",
      conversation._id
    );
    return makeSuccessResponse({ res, message: "Conversation updated" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const id = req.params.id;
    const currentUser = req.user;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const conversation = await Conversation.findById(id);
    const conversationMembers = await ConversationMember.find({
      conversation,
      user: { $ne: currentUser._id },
    });
    await conversation.deleteOne();
    await Notification.create(
      conversationMembers.map((member) => ({
        message: `${currentUser.displayName} đã xóa cuộc trò chuyện`,
        data: {
          user: {
            _id: currentUser._id,
          },
        },
        user: member.user,
      }))
    );
    return makeSuccessResponse({
      res,
      message: "Delete conversation success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getConversation = async (req, res) => {
  try {
    const id = req.params.id;
    const currentUser = req.user;
    const conversation = await Conversation.findById(id)
      .populate({
        path: "friendship",
        populate: {
          path: "sender receiver",
        },
      })
      .populate({
        path: "lastMessage",
        populate: {
          path: "user",
        },
      });
    if (!conversation) {
      return makeErrorResponse({ res, message: "Conversation not found" });
    }
    return makeSuccessResponse({
      res,
      data: await formatConversationData(conversation, currentUser),
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const result = await getListConversations(req);
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateConversationPermission = async (req, res) => {
  try {
    const { id, canMessage, canUpdate, canAddMember } = req.body;
    const currentUser = req.user;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return makeErrorResponse({
        res,
        message: "Conversation not found",
      });
    }
    conversation.canMessage =
      canMessage !== undefined ? canMessage : conversation.canMessage;
    conversation.canUpdate =
      canUpdate !== undefined ? canUpdate : conversation.canUpdate;
    conversation.canAddMember =
      canAddMember !== undefined ? canAddMember : conversation.canAddMember;
    await conversation.save();
    const conversationMembers = await ConversationMember.find({
      conversation: id,
      user: { $ne: currentUser._id },
    });
    await Notification.create(
      conversationMembers.map((member) => ({
        message: `${currentUser.displayName} đã cập nhật quyền cho thành viên trong nhóm`,
        data: {
          conversation: {
            _id: conversation._id,
          },
          user: {
            _id: currentUser._id,
          },
        },
        user: member.user,
      }))
    );
    io.to(conversation._id.toString()).emit(
      "UPDATE_CONVERSATION",
      conversation._id
    );
    return makeSuccessResponse({
      res,
      message: "Permissions updated successfully",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export {
  createConversation,
  updateConversation,
  deleteConversation,
  getConversation,
  getConversations,
  updateConversationPermission,
};
