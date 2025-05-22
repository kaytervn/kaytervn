import { formatDistanceToNow } from "../configurations/schemaConfig.js";
import Conversation from "../models/conversationModel.js";
import Friendship from "../models/friendshipModel.js";
import User from "../models/userModel.js";

const getFriendships = async (friendshipQuery) => {
  const friendships = await Friendship.find(friendshipQuery).populate(
    "sender receiver"
  );
  return friendships;
};

const formatFriendshipData = (friendship, user, conversation) => ({
  _id: friendship._id,
  status: friendship.status,
  ...(friendship.status === 2 && conversation
    ? {
        friend: {
          _id: user._id,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          birthDate: user.birthDate ? user.birthDate.slice(0, 10) : null,
          lastLogin: formatDistanceToNow(user.lastLogin),
        },
        conversation: {
          _id: conversation?._id,
        },
        isFollowed: friendship.isFollowed,
      }
    : {
        sender: {
          _id: friendship.sender._id,
          displayName: friendship.sender.displayName,
          avatarUrl: friendship.sender.avatarUrl,
        },
        receiver: {
          _id: friendship.receiver._id,
          displayName: friendship.receiver.displayName,
          avatarUrl: friendship.receiver.avatarUrl,
        },
      }),
});

const getFriends = async (req) => {
  const {
    displayName,
    isPaged,
    page = 0,
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;
  const currentUser = req.user;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  const friendships = await getFriendships({
    $or: [{ sender: currentUser._id }, { receiver: currentUser._id }],
    status: 2,
  });

  const friendIds = friendships.map((friendship) =>
    friendship.sender.equals(currentUser._id)
      ? friendship.receiver
      : friendship.sender
  );

  let userQuery = { _id: { $in: friendIds } };
  if (displayName) {
    userQuery.displayName = { $regex: displayName, $options: "i" };
  }

  const [totalElements, users] = await Promise.all([
    User.countDocuments(userQuery),
    User.find(userQuery).sort({ lastLogin: -1 }).skip(offset).limit(limit),
  ]);

  const totalPages = Math.ceil(totalElements / limit);

  const result = await Promise.all(
    users.map(async (user) => {
      const friendship = friendships.find(
        (f) => f.sender.equals(user._id) || f.receiver.equals(user._id)
      );
      const conversation = await Conversation.findOne({ friendship });
      if (
        friendship.status === 2 &&
        friendship.followers &&
        friendship.followers.includes(currentUser._id)
      ) {
        friendship.isFollowed = 1;
      } else {
        friendship.isFollowed = 0;
      }
      return formatFriendshipData(friendship, user, conversation);
    })
  );

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

const getSentFriendRequests = async (req) => {
  const {
    displayName,
    isPaged,
    page = 0,
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;
  const currentUser = req.user;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  const friendships = await getFriendships({
    sender: currentUser._id,
    status: 1,
  });

  const friendIds = friendships.map((friendship) => friendship.receiver);

  let userQuery = { _id: { $in: friendIds } };
  if (displayName) {
    userQuery.displayName = { $regex: displayName, $options: "i" };
  }

  const [totalElements, users] = await Promise.all([
    User.countDocuments(userQuery),
    User.find(userQuery).sort({ displayName: 1 }).skip(offset).limit(limit),
  ]);

  const totalPages = Math.ceil(totalElements / limit);

  const result = users.map((user) => {
    const friendship = friendships.find((f) => f.receiver.equals(user._id));
    return formatFriendshipData(friendship, user, null);
  });

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

const getReceivedFriendRequests = async (req) => {
  const {
    displayName,
    isPaged,
    page = 0,
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;
  const currentUser = req.user;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  const friendships = await getFriendships({
    receiver: currentUser._id,
    status: 1,
  });

  const friendIds = friendships.map((friendship) => friendship.sender);

  let userQuery = { _id: { $in: friendIds } };
  if (displayName) {
    userQuery.displayName = { $regex: displayName, $options: "i" };
  }

  const [totalElements, users] = await Promise.all([
    User.countDocuments(userQuery),
    User.find(userQuery).sort({ displayName: 1 }).skip(offset).limit(limit),
  ]);

  const totalPages = Math.ceil(totalElements / limit);

  const result = users.map((user) => {
    const friendship = friendships.find((f) => f.sender.equals(user._id));
    return formatFriendshipData(friendship, user, null);
  });

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

export { getFriends, getSentFriendRequests, getReceivedFriendRequests };
