import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import User from "../models/userModel.js";
import Role from "../models/roleModel.js";
import Notification from "../models/notificationModel.js";
import Friendship from "../models/friendshipModel.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import MessageReaction from "../models/messageReactionModel.js";
import Story from "../models/storyModel.js";
import StoryView from "../models/storyViewModel.js";
import Post from "../models/postModel.js";
import PostReaction from "../models/postReactionModel.js";
import Comment from "../models/commentModel.js";
import CommentReaction from "../models/commentReactionModel.js";
import { calculateAverageDailyCount } from "../utils/utils.js";

const monthNames = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const initializeMonthlyData = () =>
  monthNames.reduce((obj, month) => {
    obj[month] = 0;
    return obj;
  }, {});

const getUsersStatistic = async (req, res) => {
  try {
    const data = {
      roles: {},
      users: {
        active: 0,
        inactive: 0,
        avgDailyCount: {
          createdAt: 0,
          lastLogin: 0,
        },
      },
      notifications: {
        sent: {
          info: 0,
          success: 0,
          fail: 0,
        },
        read: {
          info: 0,
          success: 0,
          fail: 0,
        },
        avgDailyCount: 0,
      },
      birthDates: { ...initializeMonthlyData(), none: 0 },
    };
    const roles = await Role.find({});
    const roleMap = roles.reduce((map, role) => {
      map[role.kind] = role._id;
      return map;
    }, {});
    const userCount = await User.countDocuments({ role: roleMap[1] });
    const managerCount = await User.countDocuments({ role: roleMap[2] });
    const adminCount = await User.countDocuments({ role: roleMap[3] });
    data.roles = {
      user: userCount,
      manager: managerCount,
      admin: adminCount,
    };
    const birthDateAggregation = await User.aggregate([
      {
        $group: {
          _id: {
            $cond: [
              { $ifNull: ["$birthDate", false] },
              { $month: "$birthDate" },
              "none",
            ],
          },
          count: { $sum: 1 },
        },
      },
    ]);
    birthDateAggregation.forEach(({ _id, count }) => {
      if (_id === "none") {
        data.birthDates.none = count;
      } else {
        const monthName = monthNames[_id - 1];
        data.birthDates[monthName] = count;
      }
    });
    data.users.active = await User.countDocuments({ status: 1 });
    data.users.inactive = await User.countDocuments({ status: 0 });
    data.users.avgDailyCount.createdAt = await calculateAverageDailyCount(
      User,
      "createdAt"
    );
    data.users.avgDailyCount.lastLogin = await calculateAverageDailyCount(
      User,
      "lastLogin"
    );
    const notificationAggregation = await Notification.aggregate([
      {
        $group: {
          _id: { kind: "$kind", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);
    notificationAggregation.forEach(({ _id, count }) => {
      const { kind, status } = _id;
      const kindKey = kind === 1 ? "info" : kind === 2 ? "success" : "fail";
      const statusKey = status === 1 ? "sent" : "read";
      data.notifications[statusKey][kindKey] = count;
    });
    data.notifications.avgDailyCount = await calculateAverageDailyCount(
      Notification,
      "createdAt"
    );
    return makeSuccessResponse({
      res,
      data,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getConversationsStatistic = async (req, res) => {
  try {
    const data = {
      friendships: {
        pending: 0,
        accepted: 0,
        avgDailyCount: 0,
      },
      conversations: {
        private: 0,
        group: 0,
        avgDailyCount: 0,
      },
      messages: {
        total: 0,
        avgDailyCount: 0,
      },
      messageReactions: {
        total: 0,
        avgDailyCount: 0,
      },
      stories: {
        total: 0,
        avgDailyCount: 0,
      },
      storyViews: {
        total: 0,
        avgDailyCount: 0,
      },
    };
    const friendships = await Friendship.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    friendships.forEach(({ _id, count }) => {
      if (_id === 1) data.friendships.pending = count;
      if (_id === 2) data.friendships.accepted = count;
    });
    data.friendships.avgDailyCount = await calculateAverageDailyCount(
      Friendship,
      "createdAt"
    );
    const conversations = await Conversation.aggregate([
      {
        $group: {
          _id: "$kind",
          count: { $sum: 1 },
        },
      },
    ]);
    conversations.forEach(({ _id, count }) => {
      if (_id === 1) data.conversations.group = count;
      if (_id === 2) data.conversations.private = count;
    });
    data.conversations.avgDailyCount = await calculateAverageDailyCount(
      Conversation,
      "createdAt"
    );
    data.messages.total = await Message.countDocuments();
    data.messages.avgDailyCount = await calculateAverageDailyCount(
      Message,
      "createdAt"
    );
    data.messageReactions.total = await MessageReaction.countDocuments();
    data.messageReactions.avgDailyCount = await calculateAverageDailyCount(
      MessageReaction,
      "createdAt"
    );
    data.stories.total = await Story.countDocuments();
    data.stories.avgDailyCount = await calculateAverageDailyCount(
      Story,
      "createdAt"
    );
    data.storyViews.total = await StoryView.countDocuments();
    data.storyViews.avgDailyCount = await calculateAverageDailyCount(
      StoryView,
      "createdAt"
    );
    return makeSuccessResponse({
      res,
      data,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getPostsStatistic = async (req, res) => {
  try {
    const data = {
      posts: {
        primal: {
          public: 0,
          friend: 0,
          private: 0,
        },
        updated: {
          public: 0,
          friend: 0,
          private: 0,
        },
        pending: 0,
        accepted: 0,
        rejected: 0,
        avgDailyCount: 0,
      },
      postReactions: {
        total: 0,
        avgDailyCount: 0,
      },
      comments: {
        total: 0,
        avgDailyCount: 0,
      },
      commentReactions: {
        total: 0,
        avgDailyCount: 0,
      },
    };
    const posts = await Post.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    posts.forEach(({ _id, count }) => {
      if (_id === 1) data.posts.pending = count;
      if (_id === 2) data.posts.accepted = count;
      if (_id === 3) data.posts.rejected = count;
    });
    data.posts.avgDailyCount = await calculateAverageDailyCount(
      Post,
      "createdAt"
    );
    data.postReactions.total = await PostReaction.countDocuments();
    data.postReactions.avgDailyCount = await calculateAverageDailyCount(
      PostReaction,
      "createdAt"
    );
    data.comments.total = await Comment.countDocuments();
    data.comments.avgDailyCount = await calculateAverageDailyCount(
      Comment,
      "createdAt"
    );
    data.commentReactions.total = await CommentReaction.countDocuments();
    data.commentReactions.avgDailyCount = await calculateAverageDailyCount(
      CommentReaction,
      "createdAt"
    );
    const postAggregation = await Post.aggregate([
      {
        $group: {
          _id: { kind: "$kind", isUpdated: "$isUpdated" },
          count: { $sum: 1 },
        },
      },
    ]);
    postAggregation.forEach(({ _id, count }) => {
      const { kind, isUpdated } = _id;
      const kindKey = kind === 1 ? "public" : kind === 2 ? "friend" : "private";
      const isUpdatedKey = isUpdated === 1 ? "updated" : "primal";
      data.posts[isUpdatedKey][kindKey] = count;
    });
    return makeSuccessResponse({
      res,
      data,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { getUsersStatistic, getConversationsStatistic, getPostsStatistic };
