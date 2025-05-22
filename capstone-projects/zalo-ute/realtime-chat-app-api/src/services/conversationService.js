import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import { formatDistanceToNow } from "../configurations/schemaConfig.js";
import ConversationMember from "../models/conversationMemberModel.js";
import Friendship from "../models/friendshipModel.js";
import { decrypt, encrypt } from "../utils/utils.js";
import { secretKey } from "../static/constant.js";

const formatConversationData = async (conversation, currentUser) => {
  conversation.isOwner = currentUser._id.equals(conversation.owner) ? 1 : 0;
  const lastMessage = conversation.lastMessage;
  if (lastMessage) {
    const userKey = currentUser.secretKey;
    const decryptedContent = decrypt(lastMessage.content, secretKey);
    lastMessage.content = encrypt(decryptedContent, userKey);
  }
  if (conversation.kind === 2) {
    const isSender = conversation.friendship.sender._id.equals(currentUser._id);
    conversation.avatarUrl = isSender
      ? conversation.friendship.receiver.avatarUrl
      : conversation.friendship.sender.avatarUrl;
    conversation.name = isSender
      ? conversation.friendship.receiver.displayName
      : conversation.friendship.sender.displayName;
    conversation.lastLogin = isSender
      ? conversation.friendship.receiver.lastLogin
      : conversation.friendship.sender.lastLogin;
  }
  const currentMember = await ConversationMember.findOne({
    conversation: conversation._id,
    user: currentUser._id,
  }).populate("lastReadMessage");
  const totalMembers = await ConversationMember.countDocuments({
    conversation: conversation._id,
  });
  const totalUnreadMessages = await Message.countDocuments({
    conversation: conversation._id,
    createdAt: {
      $gt: currentMember?.lastReadMessage?.createdAt || new Date(0),
    },
  });
  return {
    _id: conversation._id,
    name: conversation.name,
    kind: conversation.kind,
    avatarUrl: conversation.avatarUrl,
    lastMessage: lastMessage
      ? {
          _id: lastMessage._id,
          user: {
            _id: lastMessage.user._id,
            displayName: lastMessage.user.displayName,
          },
          content: lastMessage.content,
          imageUrl: lastMessage.imageUrl,
          createdAt: formatDistanceToNow(lastMessage.createdAt),
        }
      : null,
    ...(conversation.kind === 2
      ? {
          lastLogin: formatDistanceToNow(conversation.lastLogin),
        }
      : {
          isOwner: conversation.isOwner,
          owner: {
            _id: conversation.owner,
          },
          canMessage: conversation.canMessage,
          canUpdate: conversation.canUpdate,
          canAddMember: conversation.canAddMember,
          totalMembers: totalMembers,
        }),
    totalUnreadMessages: totalUnreadMessages,
  };
};

const getListConversations = async (req) => {
  const {
    name,
    kind,
    isPaged,
    page = 0,
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;
  const currentUser = req.user;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  const friendships = await Friendship.find({
    $or: [{ sender: currentUser._id }, { receiver: currentUser._id }],
    status: 2,
  }).populate("sender receiver");
  const members = await ConversationMember.find({ user: currentUser._id });
  let query = {
    _id: { $in: members.map((m) => m.conversation) },
    $or: [
      { kind: 1 },
      { kind: 2, friendship: { $in: friendships.map((f) => f._id) } },
    ],
  };
  if (name) {
    query.$or = [{ name: { $regex: name, $options: "i" } }];
    const matchingFriendships = friendships.filter((friendship) => {
      const friend = friendship.sender._id.equals(currentUser._id)
        ? friendship.receiver
        : friendship.sender;
      return friend.displayName.match(new RegExp(name, "i"));
    });
    const friendIds = matchingFriendships.map((friendship) => friendship._id);
    query.$or.push({ friendship: { $in: friendIds } });
  }
  if (kind) {
    query.kind = Number(kind);
  }

  const [totalElements, conversations] = await Promise.all([
    Conversation.countDocuments(query),
    Conversation.find(query)
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
      })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit),
  ]);

  conversations.sort((a, b) => {
    if (a.lastMessage && b.lastMessage) {
      return (
        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
      );
    }
    if (a.lastMessage) return -1;
    if (b.lastMessage) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const totalPages = Math.ceil(totalElements / limit);

  const result = await Promise.all(
    conversations.map(async (conversation) => {
      return await formatConversationData(conversation, currentUser);
    })
  );

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

export { formatConversationData, getListConversations };
