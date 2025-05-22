import mongoose from "mongoose";
import { schemaOptions } from "../configurations/schemaConfig.js";
import MessageReaction from "./messageReactionModel.js";
import { deleteFileByUrl } from "../services/apiService.js";
import Conversation from "./conversationModel.js";
import ConversationMember from "./conversationMemberModel.js";

const MessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      default: null,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  schemaOptions
);

MessageSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await deleteFileByUrl(this.content);
      await MessageReaction.deleteMany({ message: this._id });
      const childMessages = await this.model("Message").find({
        parent: this._id,
      });
      for (const child of childMessages) {
        await child.deleteOne();
      }
      const previousMessage = await this.model("Message")
        .findOne({
          conversation: this.conversation,
          createdAt: { $lt: this.createdAt },
        })
        .sort({ createdAt: -1 });
      const newLastMessageId = previousMessage ? previousMessage._id : null;
      const conversation = await Conversation.findById(this.conversation);
      if (
        conversation.lastMessage &&
        this._id.equals(conversation.lastMessage)
      ) {
        await conversation.updateOne({
          lastMessage: newLastMessageId,
        });
      }
      const members = await ConversationMember.find({
        conversation: this.conversation,
      });
      for (const member of members) {
        if (this._id.equals(member.lastReadMessage)) {
          await member.updateOne({
            lastReadMessage: newLastMessageId,
          });
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  }
);

const Message = mongoose.model("Message", MessageSchema);
export default Message;
