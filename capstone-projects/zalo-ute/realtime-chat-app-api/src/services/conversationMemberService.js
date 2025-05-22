import mongoose from "mongoose";
import ConversationMember from "../models/conversationMemberModel.js";

const formatConversationMemberData = (conversationMember) => {
  return {
    _id: conversationMember._id,
    user: {
      _id: conversationMember.user._id,
      displayName: conversationMember.user.displayName,
      avatarUrl: conversationMember.user.avatarUrl,
    },
    conversation: {
      _id: conversationMember.conversation._id,
    },
    isOwner: conversationMember.user._id.equals(
      conversationMember.conversation.owner
    )
      ? 1
      : 0,
  };
};

const getListConversationMembers = async (req) => {
  const {
    conversation,
    isPaged,
    page = 0,
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  let query = {};
  if (mongoose.isValidObjectId(conversation)) {
    query.conversation = new mongoose.Types.ObjectId(conversation);
  }

  const [totalElements, conversationMembers] = await Promise.all([
    ConversationMember.countDocuments(query),
    ConversationMember.find(query)
      .populate("user conversation")
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit),
  ]);

  const totalPages = Math.ceil(totalElements / limit);

  const result = conversationMembers.map((conversationMember) => {
    return formatConversationMemberData(conversationMember);
  });

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

export { getListConversationMembers };
