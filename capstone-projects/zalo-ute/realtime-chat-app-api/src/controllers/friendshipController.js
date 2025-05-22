import ConversationMember from "../models/conversationMemberModel.js";
import Conversation from "../models/conversationModel.js";
import Friendship from "../models/friendshipModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import {
  isValidObjectId,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import {
  getFriends,
  getReceivedFriendRequests,
  getSentFriendRequests,
} from "../services/friendshipService.js";
import { validateMaxFriendRequests } from "../services/settingService.js";

const sendFriendRequest = async (req, res) => {
  try {
    const { user } = req.body;
    const currentUser = req.user;
    if (
      !user ||
      !isValidObjectId(user) ||
      currentUser._id.equals(user) ||
      !(await User.findById(user))
    ) {
      return makeErrorResponse({
        res,
        message: "Please provide a valid user ID",
      });
    }
    const isAllowed = await validateMaxFriendRequests(currentUser);
    if (!isAllowed) {
      return makeErrorResponse({
        res,
        message: "Bạn đã đạt giới hạn gửi lời mời kết bạn",
      });
    }
    const existingFriendship = await Friendship.findOne({
      $or: [
        { sender: currentUser._id, receiver: user },
        { sender: user, receiver: currentUser._id },
      ],
    });
    if (existingFriendship) {
      return makeErrorResponse({
        res,
        message: "Friend request exiists",
      });
    }
    const friendship = await Friendship.create({
      sender: currentUser._id,
      receiver: user,
      status: 1, // pending
    });
    await Notification.create({
      user,
      data: {
        user: {
          _id: currentUser._id,
        },
        friendship: {
          _id: friendship._id,
        },
      },
      message: `${currentUser.displayName} đã gửi lời mời kết bạn`,
    });
    return makeSuccessResponse({
      res,
      message: "Friend request sent",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { friendship } = req.body;
    const currentUser = req.user;

    if (!isValidObjectId(friendship)) {
      return makeErrorResponse({ res, message: "Invalid friendship" });
    }

    const getFriendship = await Friendship.findOne({
      _id: friendship,
    }).populate("sender receiver");
    if (!getFriendship) {
      return makeErrorResponse({ res, message: "Friendship not found" });
    }
    const { sender, receiver } = getFriendship;
    await getFriendship.updateOne({
      status: 2,
      followers: [sender._id, receiver._id],
    });

    const notificationData = {
      user: getFriendship.sender._id,
      data: {
        user: {
          _id: currentUser._id,
        },
        friendship: {
          _id: getFriendship._id,
        },
      },
      kind: 2,
      message: `${currentUser.displayName} đã chấp nhận lời mời kết bạn`,
    };

    const conversation = await Conversation.create({
      friendship: getFriendship,
      kind: 2,
    });
    const conversationMembers = [
      { conversation: conversation._id, user: getFriendship.sender._id },
      { conversation: conversation._id, user: getFriendship.receiver._id },
    ];

    await Promise.all([
      Notification.create(notificationData),
      ConversationMember.insertMany(conversationMembers),
    ]);

    return makeSuccessResponse({
      res,
      message: "Friend request accepted",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const { friendship } = req.body;
    const currentUser = req.user;
    if (!isValidObjectId(friendship)) {
      return makeErrorResponse({ res, message: "Invalid friendship" });
    }
    const getFriendship = await Friendship.findById(friendship).populate(
      "sender receiver"
    );
    await getFriendship.deleteOne();
    await Notification.create({
      user: getFriendship.sender._id,
      data: {
        user: {
          _id: currentUser._id,
        },
        friendship: {
          _id: getFriendship._id,
        },
      },
      kind: 3,
      message: `${currentUser.displayName} đã từ chối lời mời kết bạn`,
    });
    return makeSuccessResponse({
      res,
      message: "Friend request rejected",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteFriendRequest = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid friendship" });
    }
    const friendship = await Friendship.findById(id);
    await friendship.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Friend request deleted",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListFriendships = async (req, res) => {
  try {
    const { getListKind } = req.query;
    let result = [];
    if (getListKind === "1") {
      // Get received friend requests
      result = await getReceivedFriendRequests(req);
    } else if (getListKind === "2") {
      // Get sent friend requests
      result = await getSentFriendRequests(req);
    } else {
      // Get friends
      result = await getFriends(req);
    }
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const toggleFollowFriend = async (req, res) => {
  try {
    const { friendship } = req.body;
    const currentUser = req.user;
    if (!isValidObjectId(friendship)) {
      return makeErrorResponse({ res, message: "Invalid friendship id" });
    }
    const getFriendship = await Friendship.findById(friendship);
    if (!getFriendship) {
      return makeErrorResponse({ res, message: "Friendship not found" });
    }
    if (
      (!currentUser._id.equals(getFriendship.sender) &&
        !currentUser._id.equals(getFriendship.receiver)) ||
      getFriendship.status !== 2
    ) {
      return makeErrorResponse({ res, message: "Unauthorized action" });
    }
    const isFollowing = getFriendship.followers.includes(currentUser._id);
    if (isFollowing) {
      getFriendship.followers = getFriendship.followers.filter(
        (followerId) => !followerId.equals(currentUser._id)
      );
      await getFriendship.save();
      return makeSuccessResponse({
        res,
        message: "Friend unfollowed successfully",
      });
    } else {
      getFriendship.followers.push(currentUser._id);
      await getFriendship.save();
      return makeSuccessResponse({
        res,
        message: "Friend followed successfully",
      });
    }
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getListFriendships,
  deleteFriendRequest,
  toggleFollowFriend,
};
