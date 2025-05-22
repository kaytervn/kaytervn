import mongoose from "mongoose";
import {
  addDateGetters,
  schemaOptions,
} from "../configurations/schemaConfig.js";
import Conversation from "./conversationModel.js";

const FriendshipSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: Number,
      enum: [1, 2], // 1: pending, 2: accepted
      default: 1,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  schemaOptions
);

addDateGetters(FriendshipSchema);

FriendshipSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const conversation = Conversation.findOne({ friendship: this._id });
      await conversation.deleteOne();
      next();
    } catch (error) {
      next(error);
    }
  }
);

const Friendship = mongoose.model("Friendship", FriendshipSchema);
export default Friendship;
