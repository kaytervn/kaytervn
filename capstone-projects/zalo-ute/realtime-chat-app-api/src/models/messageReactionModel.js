import mongoose from "mongoose";
import { schemaOptions } from "../configurations/schemaConfig.js";

const MessageReactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
  },
  schemaOptions
);

const MessageReaction = mongoose.model(
  "MessageReaction",
  MessageReactionSchema
);
export default MessageReaction;
