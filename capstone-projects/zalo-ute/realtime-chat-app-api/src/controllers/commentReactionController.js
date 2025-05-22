import Comment from "../models/commentModel.js";
import CommentReaction from "../models/commentReactionModel.js";
import Notification from "../models/notificationModel.js";
import {
  isValidObjectId,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { getListCommentReactions } from "../services/commentReactionService.js";

const createCommentReaction = async (req, res) => {
  try {
    const { comment } = req.body;
    const { user } = req;
    if (!isValidObjectId(comment)) {
      return makeErrorResponse({ res, message: "Invalid comment" });
    }
    const getComment = await Comment.findById(comment);
    await CommentReaction.create({
      user: user._id,
      comment,
    });
    if (!user._id.equals(getComment.user)) {
      await Notification.create({
        user: getComment.user,
        data: {
          post: {
            _id: getComment.post,
          },
          comment: {
            _id: getComment._id,
          },
          user: {
            _id: user._id,
          },
        },
        message: `${user.displayName} đã thả tim tin nhắn của bạn`,
      });
    }
    return makeSuccessResponse({
      res,
      message: "Create comment reaction success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteCommentReaction = async (req, res) => {
  try {
    const commentId = req.params.id;
    const commentReaction = await CommentReaction.findOne({
      comment: commentId,
      user: req.user._id,
    });
    if (!commentReaction) {
      return makeErrorResponse({ res, message: "Comment reaction not found" });
    }
    await commentReaction.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete comment reaction success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getCommentReactions = async (req, res) => {
  try {
    const result = await getListCommentReactions(req);
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { createCommentReaction, deleteCommentReaction, getCommentReactions };
