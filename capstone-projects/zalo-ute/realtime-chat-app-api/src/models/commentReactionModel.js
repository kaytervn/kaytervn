import mongoose from "mongoose";
import { schemaOptions } from "../configurations/schemaConfig.js";

const CommentReactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
  },
  schemaOptions
);

const CommentReaction = mongoose.model(
  "CommentReaction",
  CommentReactionSchema
);
export default CommentReaction;
