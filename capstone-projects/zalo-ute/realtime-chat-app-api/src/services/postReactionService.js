import mongoose from "mongoose";
import PostReaction from "../models/postReactionModel.js";

const formatPostReactionData = (postReaction) => {
  return {
    _id: postReaction._id,
    user: {
      _id: postReaction.user._id,
      displayName: postReaction.user.displayName,
      avatarUrl: postReaction.user.avatarUrl,
    },
    post: {
      _id: postReaction.post,
    },
  };
};

const getListPostReactions = async (req) => {
  const {
    post,
    isPaged,
    page = 0,
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  let query = {};
  if (mongoose.isValidObjectId(post)) {
    query.post = new mongoose.Types.ObjectId(post);
  }

  const [totalElements, postReactions] = await Promise.all([
    PostReaction.countDocuments(query),
    PostReaction.find(query)
      .populate("user")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit),
  ]);

  const totalPages = Math.ceil(totalElements / limit);

  const result = postReactions.map((postReaction) => {
    return formatPostReactionData(postReaction);
  });

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

export { getListPostReactions };
