import mongoose from "mongoose";
import { schemaOptions } from "../configurations/schemaConfig.js";

const PostReactionSchema = new mongoose.Schema(
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
  },
  schemaOptions
);

const PostReaction = mongoose.model("PostReaction", PostReactionSchema);
export default PostReaction;
