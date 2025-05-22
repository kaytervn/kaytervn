import mongoose from "mongoose";
import { schemaOptions } from "../configurations/schemaConfig.js";
import ConversationMember from "./conversationMemberModel.js";
import Message from "./messageModel.js";
import { deleteFileByUrl } from "../services/apiService.js";
import Friendship from "./friendshipModel.js";
import Notification from "./notificationModel.js";

const ConversationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null, // for group chats
    },
    avatarUrl: {
      type: String,
      default: null, // for group chats
    },
    kind: {
      type: Number,
      enum: [1, 2], // 1: group, 2: private (personal chat)
      required: true,
    },
    friendship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Friendship",
      required: false, // for direct chats
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // for group chats
      default: null,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    canMessage: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    canUpdate: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    canAddMember: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
  },
  schemaOptions
);

ConversationSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await deleteFileByUrl(this.avatarUrl);
      await ConversationMember.deleteMany({ conversation: this._id });
      if (this.friendship && this.kind === 2) {
        const friendship = await Friendship.findOne({
          _id: this.friendship,
        });
        friendship.deleteOne();
      }
      const messages = await Message.find({ conversation: this._id });
      for (const message of messages) {
        await message.deleteOne();
      }
      await Notification.deleteMany({
        "data.conversation._id": this._id,
      });
      next();
    } catch (error) {
      next(error);
    }
  }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);
export default Conversation;
