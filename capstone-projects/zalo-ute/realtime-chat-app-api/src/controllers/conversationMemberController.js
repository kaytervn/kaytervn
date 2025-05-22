import ConversationMember from "../models/conversationMemberModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import {
  isValidObjectId,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { getListConversationMembers } from "../services/conversationMemberService.js";

const addMember = async (req, res) => {
  try {
    const { conversation, users } = req.body;
    const currentUser = req.user;
    if (!isValidObjectId(conversation) || !Array.isArray(users)) {
      return makeErrorResponse({ res, message: "Invalid input data" });
    }
    const validUsers = users.filter(isValidObjectId);
    if (validUsers.length === 0) {
      return makeErrorResponse({ res, message: "No valid user IDs provided" });
    }
    const newMembers = await User.find({ _id: { $in: validUsers } });
    if (newMembers.length === 0) {
      return makeErrorResponse({ res, message: "No users found" });
    }
    const existingMembers = await ConversationMember.find({
      conversation,
      user: { $in: validUsers },
    });
    const existingUserIds = existingMembers.map((member) =>
      member.user.toString()
    );
    const membersToAdd = newMembers.filter(
      (user) => !existingUserIds.includes(user._id.toString())
    );
    if (membersToAdd.length === 0) {
      return makeErrorResponse({
        res,
        message: "All users are already members",
      });
    }
    await ConversationMember.create(
      membersToAdd.map((user) => ({
        conversation,
        user: user._id,
      }))
    );
    const notificationData = {
      user: {
        _id: currentUser._id,
      },
      conversation: {
        _id: conversation,
      },
    };
    await Notification.create(
      membersToAdd.map((user) => ({
        user: user._id,
        data: notificationData,
        message: `${currentUser.displayName} đã thêm bạn vào cuộc trò chuyện`,
      }))
    );
    const otherMembers = await ConversationMember.find({
      conversation,
      user: {
        $nin: [currentUser._id, ...membersToAdd.map((user) => user._id)],
      },
    });
    await Notification.create(
      otherMembers.map((member) => ({
        user: member.user,
        data: notificationData,
        message: `${currentUser.displayName} đã thêm ${membersToAdd
          .map((user) => user.displayName)
          .join(", ")} vào cuộc trò chuyện`,
      }))
    );
    return makeSuccessResponse({
      res,
      message: "Members added to conversation",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const id = req.params.id;
    const currentUser = req.user;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const conversationMember = await ConversationMember.findById(id).populate(
      "user"
    );
    await conversationMember.deleteOne();
    await Notification.create({
      user: conversationMember.user,
      message: `${currentUser.displayName} đã xóa bạn khỏi cuộc trò chuyện`,
      data: {
        user: {
          _id: currentUser._id,
        },
      },
      kind: 3,
    });
    const conversationMembers = await ConversationMember.find({
      conversation: conversationMember.conversation,
      user: { $nin: [currentUser._id, conversationMember.user._id] },
    });
    await Notification.create(
      conversationMembers.map((member) => ({
        message: `${currentUser.displayName} đã xóa ${conversationMember.user.displayName} khỏi cuộc trò chuyện`,
        data: {
          user: {
            _id: currentUser._id,
          },
          conversation: {
            _id: conversationMember.conversation,
          },
        },
        user: member.user,
      }))
    );
    return makeSuccessResponse({
      res,
      message: "Member removed from conversation",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getConversationMembers = async (req, res) => {
  try {
    const result = await getListConversationMembers(req);
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { addMember, removeMember, getConversationMembers };
