import mongoose from "mongoose";
import CommentReaction from "../models/commentReactionModel.js";

const formatCommentReactionData = (commentReaction) => {
  return {
    _id: commentReaction._id,
    user: {
      _id: commentReaction.user._id,
      displayName: commentReaction.user.displayName,
      avatarUrl: commentReaction.user.avatarUrl,
    },
    comment: {
      _id: commentReaction.comment,
    },
  };
};

const getListCommentReactions = async (req) => {
  const {
    comment,
    isPaged,
    page = 0,
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  let query = {};
  if (mongoose.isValidObjectId(comment)) {
    query.comment = new mongoose.Types.ObjectId(comment);
  }

  const [totalElements, commentReactions] = await Promise.all([
    CommentReaction.countDocuments(query),
    CommentReaction.find(query)
      .populate("user")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit),
  ]);

  const totalPages = Math.ceil(totalElements / limit);

  const result = commentReactions.map((commentReaction) => {
    return formatCommentReactionData(commentReaction);
  });

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

export { getListCommentReactions };
