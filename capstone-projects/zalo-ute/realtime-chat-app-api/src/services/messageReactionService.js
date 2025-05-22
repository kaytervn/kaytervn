import mongoose from "mongoose";
import MessageReaction from "../models/messageReactionModel.js";

const formatMessageReactionData = (messageReaction) => {
  return {
    _id: messageReaction._id,
    user: {
      _id: messageReaction.user._id,
      displayName: messageReaction.user.displayName,
      avatarUrl: messageReaction.user.avatarUrl,
    },
    message: {
      _id: messageReaction.message,
    },
  };
};

const getListMessageReactions = async (req) => {
  const {
    message,
    isPaged,
    page = 0,
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  let query = {};
  if (mongoose.isValidObjectId(message)) {
    query.message = new mongoose.Types.ObjectId(message);
  }

  const [totalElements, messageReactions] = await Promise.all([
    MessageReaction.countDocuments(query),
    MessageReaction.find(query)
      .populate("user")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit),
  ]);

  const totalPages = Math.ceil(totalElements / limit);

  const result = messageReactions.map((messageReaction) => {
    return formatMessageReactionData(messageReaction);
  });

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

export { getListMessageReactions };
