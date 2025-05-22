import mongoose from "mongoose";
import { formatDate, schemaOptions } from "../configurations/schemaConfig.js";
import Message from "./messageModel.js";
import ConversationMember from "./conversationMemberModel.js";
import Conversation from "./conversationModel.js";
import Comment from "./commentModel.js";
import MessageReaction from "./messageReactionModel.js";
import PostReaction from "./postReactionModel.js";
import Post from "./postModel.js";
import Notification from "./notificationModel.js";
import CommentReaction from "./commentReactionModel.js";
import Friendship from "./friendshipModel.js";
import Story from "./storyModel.js";
import { deleteFileByUrl } from "../services/apiService.js";

const UserSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    birthDate: {
      type: Date,
      default: null,
      get: formatDate,
    },
    otp: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    status: {
      type: Number,
      enum: [0, 1], // 0: inactive, 1: active
      default: 0,
    },
    secretKey: {
      type: String,
      default: null,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      reqquired: true,
    },
    isSuperAdmin: {
      type: Number,
      enum: [0, 1], // 0: inactive, 1: active
      default: 0,
    },
    lastLogin: {
      type: Date,
      default: new Date(),
    },
  },
  schemaOptions
);

UserSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await deleteFileByUrl(this.avatarUrl);
      const conversations = await Conversation.find({ owner: this._id });
      for (const conversation of conversations) {
        await conversation.deleteOne();
      }
      const messages = await Message.find({ user: this._id });
      for (const message of messages) {
        await message.deleteOne();
      }
      const comments = await Comment.find({ user: this._id });
      for (const comment of comments) {
        await comment.deleteOne();
      }
      const posts = await Post.find({ user: this._id });
      for (const post of posts) {
        await post.deleteOne();
      }
      const stories = await Story.find({ user: this._id });
      for (const story of stories) {
        await story.deleteOne();
      }
      const friendships = await Friendship.find({
        $or: [{ sender: this._id }, { receiver: this._id }],
      });
      for (const friendship of friendships) {
        await friendship.deleteOne();
      }
      await Notification.deleteMany({
        "data.user._id": this._id,
      });
      await Notification.deleteMany({ user: this._id });
      await ConversationMember.deleteMany({ user: this._id });
      await MessageReaction.deleteMany({ user: this._id });
      await PostReaction.deleteMany({ user: this._id });
      await CommentReaction.deleteMany({ user: this._id });
      next();
    } catch (error) {
      next(error);
    }
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
