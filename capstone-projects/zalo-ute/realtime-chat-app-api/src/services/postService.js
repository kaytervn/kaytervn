import mongoose from "mongoose";
import Friendship from "../models/friendshipModel.js";
import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";
import PostReaction from "../models/postReactionModel.js";
import { formatDistanceToNow } from "../configurations/schemaConfig.js";

const formatPostData = async (post, currentUser) => {
  const comments = await Comment.find({ post: post._id });
  const reactions = await PostReaction.find({ post: post._id });
  post.isOwner = post.user._id.equals(currentUser._id) ? 1 : 0;
  post.totalComments = comments.length;
  post.totalReactions = reactions.length;
  post.isReacted = (await PostReaction.exists({
    user: currentUser._id,
    post: post._id,
  }))
    ? 1
    : 0;

  return {
    _id: post._id,
    user: {
      _id: post.user._id,
      displayName: post.user.displayName,
      avatarUrl: post.user.avatarUrl,
      role: {
        _id: post.user.role._id,
        name: post.user.role.name,
        kind: post.user.role.kind,
      },
    },
    kind: post.kind,
    content: post.content,
    imageUrls: post.imageUrls,
    status: post.status,
    createdAt: formatDistanceToNow(post.createdAt),
    totalComments: post.totalComments,
    totalReactions: post.totalReactions,
    isOwner: post.isOwner,
    isUpdated: post.isUpdated,
    isReacted: post.isReacted,
  };
};

const getListPosts = async (req) => {
  const {
    content,
    status,
    user,
    kind,
    isPaged,
    page = 0,
    getListKind = "0",
    sortKind = "0",
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;
  const currentUser = req.user;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  const friendships = await Friendship.find({
    $or: [{ sender: currentUser._id }, { receiver: currentUser._id }],
    status: 2,
    followers: currentUser._id,
  });

  const friendIds = friendships.map((friendship) =>
    friendship.sender.equals(currentUser._id)
      ? friendship.receiver
      : friendship.sender
  );

  let postQuery = {};
  if (getListKind === "3") {
    // Get my posts
    postQuery.user = currentUser._id;
  } else if (getListKind === "2") {
    // Get my friends' posts
    postQuery.$or = [
      { kind: 1, user: { $in: [...friendIds, currentUser._id] } },
      { kind: 2, user: { $in: [...friendIds, currentUser._id] } },
    ];
    postQuery.status = 2;
  } else if (getListKind === "1") {
    // Get all posts
    postQuery.$or = [
      { kind: 1 },
      { kind: 2, user: { $in: [...friendIds, currentUser._id] } },
    ];
    postQuery.status = 2;
  }
  if (content) {
    postQuery.content = { $regex: content, $options: "i" };
  }
  if (kind) {
    postQuery.kind = Number(kind);
  }
  if (status) {
    postQuery.status = Number(status);
  }
  if (mongoose.isValidObjectId(user)) {
    postQuery.user = new mongoose.Types.ObjectId(user);
  }

  const sortCriteria =
    sortKind === "1" ? { status: 1, createdAt: -1 } : { createdAt: -1 };

  const [totalElements, posts] = await Promise.all([
    Post.countDocuments(postQuery),
    Post.find(postQuery)
      .populate({
        path: "user",
        populate: {
          path: "role",
        },
      })
      .sort(sortCriteria)
      .skip(offset)
      .limit(limit),
  ]);

  const totalPages = Math.ceil(totalElements / limit);

  const result = await Promise.all(
    posts.map(async (post) => {
      return await formatPostData(post, currentUser);
    })
  );

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

export { formatPostData, getListPosts };
