import Comment from "../models/commentModel.js";
import Notification from "../models/notificationModel.js";
import Post from "../models/postModel.js";
import {
  deleteFileByUrl,
  isValidObjectId,
  isValidUrl,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import {
  formatCommentData,
  getListComments,
} from "../services/commentService.js";

const createComment = async (req, res) => {
  try {
    const { post, content, parent, imageUrl } = req.body;
    const errors = [];
    if (!post) {
      errors.push({ field: "post", message: "post cannot be null" });
    } else if (!isValidObjectId(post)) {
      errors.push({ field: "post", message: "post id is invalid" });
    }
    if (!content || !content.trim()) {
      errors.push({ field: "content", message: "content cannot be null" });
    }
    if (parent && !isValidObjectId(parent)) {
      errors.push({
        field: "parent",
        message: "parent id is invalid",
      });
    }
    if (errors.length > 0) {
      return makeErrorResponse({ res, message: "Invalid form", data: errors });
    }
    const currenttUser = req.user;
    let parentComment;
    if (parent) {
      parentComment = await Comment.findById(parent);
      if (!parentComment) {
        return makeErrorResponse({
          res,
          message: "Parent comment not found",
        });
      }
    }
    const getPost = await Post.findById(post);
    if (!getPost) {
      return makeErrorResponse({ res, message: "Post not found" });
    }
    const comment = await Comment.create({
      post: getPost._id,
      user: currenttUser._id,
      content,
      imageUrl: isValidUrl(imageUrl) ? imageUrl : null,
      parent: parentComment ? parentComment._id : null,
    });
    if (parentComment) {
      if (!currenttUser._id.equals(parentComment.user._id)) {
        await Notification.create({
          user: parentComment.user._id,
          data: {
            post: {
              _id: getPost._id,
            },
            comment: {
              _id: parentComment._id,
            },
            user: {
              _id: currenttUser._id,
            },
          },
          message: `${currenttUser.displayName} đã trả lời bình luận của bạn`,
        });
      }
    }
    if (!currenttUser._id.equals(getPost.user._id)) {
      await Notification.create({
        user: getPost.user._id,
        data: {
          post: {
            _id: getPost._id,
          },
          comment: {
            _id: comment._id,
          },
          user: {
            _id: currenttUser._id,
          },
        },
        message: `${currenttUser.displayName} đã bình luận vào bài viết của bạn`,
      });
    }
    return makeSuccessResponse({
      res,
      message: "Create comment success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id, content, imageUrl } = req.body;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const comment = await Comment.findById(id);
    if (comment.imageUrl !== imageUrl) {
      await deleteFileByUrl(comment.imageUrl);
    }
    await comment.updateOne({
      content,
      imageUrl: isValidUrl(imageUrl) ? imageUrl : null,
    });
    return makeSuccessResponse({ res, message: "Comment updated" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const comment = await Comment.findById(id);
    await comment.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete comment success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getComment = async (req, res) => {
  try {
    const id = req.params.id;
    const currentUser = req.user;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const comment = await Comment.findById(id).populate("user");
    return makeSuccessResponse({
      res,
      data: await formatCommentData(comment, currentUser),
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const result = await getListComments(req);
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { createComment, updateComment, deleteComment, getComment, getComments };
