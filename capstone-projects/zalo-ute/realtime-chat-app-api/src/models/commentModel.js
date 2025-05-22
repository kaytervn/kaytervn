import mongoose from "mongoose";
import { schemaOptions } from "../configurations/schemaConfig.js";
import CommentReaction from "./commentReactionModel.js";
import { deleteFileByUrl } from "../services/apiService.js";

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  schemaOptions
);

CommentSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const commentId = this._id;
    try {
      await deleteFileByUrl(this.imageUrl);
      await CommentReaction.deleteMany({ comment: this._id });
      const childComments = await this.model("Comment").find({
        parent: commentId,
      });
      for (const childComment of childComments) {
        await childComment.deleteOne();
      }
      next();
    } catch (error) {
      next(error);
    }
  }
);

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
