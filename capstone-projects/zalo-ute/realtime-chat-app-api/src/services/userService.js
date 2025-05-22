import mongoose from "mongoose";
import {
  formatDate,
  formatDistanceToNow,
} from "../configurations/schemaConfig.js";
import User from "../models/userModel.js";
import Friendship from "../models/friendshipModel.js";
import { isValidObjectId } from "./apiService.js";
import ConversationMember from "../models/conversationMemberModel.js";
import Notification from "../models/notificationModel.js";
import Message from "../models/messageModel.js";

const formatUserData = async (user) => {
  const [
    notifications,
    totalFriends,
    friendRequestsSent,
    friendRequestsReceived,
    userConversations,
  ] = await Promise.all([
    Notification.find({ user: user._id, status: 1 }),
    Friendship.find({
      $or: [{ sender: user._id }, { receiver: user._id }],
      status: 2,
    }),
    Friendship.find({ sender: user._id, status: 1 }),
    Friendship.find({ receiver: user._id, status: 1 }),
    ConversationMember.find({ user: user._id }).populate("lastReadMessage"),
  ]);
  const totalUnreadMessages = await Promise.all(
    userConversations.map(async (member) => {
      return Message.countDocuments({
        conversation: member.conversation,
        createdAt: {
          $gt: member.lastReadMessage?.createdAt || new Date(0),
        },
      });
    })
  );
  const totalUnreadMessagesCount = totalUnreadMessages.reduce(
    (acc, count) => acc + count,
    0
  );
  return {
    _id: user._id,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    email: user.email,
    studentId: user.studentId,
    phone: user.phone,
    birthDate: user.birthDate,
    bio: user.bio,
    status: user.status,
    secretKey: user.secretKey,
    role: {
      _id: user.role._id,
      name: user.role.name,
      kind: user.role.kind,
    },
    isSuperAdmin: user.isSuperAdmin,
    createdAt: formatDate(user.createdAt),
    lastLogin: formatDistanceToNow(user.lastLogin),
    totalFriends: totalFriends.length,
    totalFriendRequestsSent: friendRequestsSent.length,
    totalFriendRequestsReceived: friendRequestsReceived.length,
    totalUnreadMessages: totalUnreadMessagesCount,
    totalUnreadNotifications: notifications.length,
  };
};

const getListUsers = async (req) => {
  const {
    displayName,
    email,
    phone,
    studentId,
    status,
    role,
    isPaged,
    page = 0,
    ignoreFriendship = "0",
    ignoreConversation,
    getFriends = "0",
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;
  const currentUser = req.user;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  let userQuery = {};

  if (isValidObjectId(ignoreConversation)) {
    const [friendIds, conversationMemberIds] = await Promise.all([
      Friendship.find({
        $or: [{ sender: currentUser._id }, { receiver: currentUser._id }],
        status: 2,
      }),
      ConversationMember.find({
        conversation: new mongoose.Types.ObjectId(ignoreConversation),
      }),
    ]);
    const friendIdsMapped = friendIds.map((friendship) =>
      friendship.sender.equals(currentUser._id)
        ? friendship.receiver
        : friendship.sender
    );
    const conversationMemberIdsMapped = conversationMemberIds.map(
      (member) => member.user
    );
    userQuery._id = {
      $in: friendIdsMapped,
      $nin: [...conversationMemberIdsMapped, currentUser._id],
    };
  } else if (ignoreFriendship === "1") {
    const friendRelationIds = await Friendship.find({
      $or: [{ sender: currentUser._id }, { receiver: currentUser._id }],
    });
    const friendRelationIdsMapped = friendRelationIds.map((friendship) =>
      friendship.sender.equals(currentUser._id)
        ? friendship.receiver
        : friendship.sender
    );
    userQuery._id = {
      $nin: [...friendRelationIdsMapped, currentUser._id],
    };
  } else if (getFriends === "1") {
    const friendships = await Friendship.find({
      $or: [{ sender: currentUser._id }, { receiver: currentUser._id }],
      status: 2,
    });
    const friendIds = friendships.map((friendship) =>
      friendship.sender.equals(currentUser._id)
        ? friendship.receiver
        : friendship.sender
    );
    userQuery._id = {
      $in: [...friendIds],
    };
  }

  if (displayName) {
    userQuery.displayName = { $regex: displayName, $options: "i" };
  }
  if (email) {
    userQuery.email = { $regex: email, $options: "i" };
  }
  if (studentId) {
    userQuery.studentId = studentId;
  }
  if (phone) {
    userQuery.phone = phone;
  }
  if (status) {
    userQuery.status = Number(status);
  }
  if (mongoose.isValidObjectId(role)) {
    userQuery.role = new mongoose.Types.ObjectId(role);
  }

  const [totalElements, users] = await Promise.all([
    User.countDocuments(userQuery),
    User.find(userQuery)
      .populate("role")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit),
  ]);

  const totalPages = Math.ceil(totalElements / limit);

  const result = await Promise.all(
    users.map(async (user) => await formatUserData(user))
  );

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

export { formatUserData, getListUsers };
