import Notification from "../models/notificationModel.js";
import Post from "../models/postModel.js";
import PostReaction from "../models/postReactionModel.js";
import {
  isValidObjectId,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { getListPostReactions } from "../services/postReactionService.js";

const createPostReaction = async (req, res) => {
  try {
    const { post } = req.body;
    const { user } = req;
    if (!isValidObjectId(post)) {
      return makeErrorResponse({ res, message: "Invalid post" });
    }
    const getPost = await Post.findById(post);
    await PostReaction.create({
      user: user._id,
      post,
    });
    if (!user._id.equals(getPost.user)) {
      await Notification.create({
        user: getPost.user,
        data: {
          post: {
            _id: getPost._id,
          },
          user: {
            _id: user._id,
          },
        },
        message: `${user.displayName} đã thả tim bài đăng của bạn`,
      });
    }
    return makeSuccessResponse({
      res,
      message: "Create post reaction success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deletePostReaction = async (req, res) => {
  try {
    const postId = req.params.id;
    const postReaction = await PostReaction.findOne({
      post: postId,
      user: req.user._id,
    });
    if (!postReaction) {
      return makeErrorResponse({ res, message: "Post reaction not found" });
    }
    await postReaction.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete post reaction success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getPostReactions = async (req, res) => {
  try {
    const result = await getListPostReactions(req);
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { createPostReaction, deletePostReaction, getPostReactions };
