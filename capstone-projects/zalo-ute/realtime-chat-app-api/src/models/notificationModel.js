import mongoose, { Schema } from "mongoose";
import { schemaOptions } from "../configurations/schemaConfig.js";
import User from "./userModel.js";
import { io } from "../index.js";
import { formatUserData } from "../services/userService.js";

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: false,
      default: null,
    },
    kind: {
      type: Number,
      enum: [1, 2, 3], // 1: info, 2: success, 3: fail
      default: 1,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      enum: [1, 2], // 1: sent, 2: read
      default: 1,
    },
  },
  schemaOptions
);

NotificationSchema.post(
  "save",
  { document: true, query: false },
  async function (doc) {
    try {
      const user = await User.findById(doc.user).populate("role");
      const formattedUserData = await formatUserData(user);
      io.to(user._id.toString()).emit("NEW_NOTIFICATION", formattedUserData);
    } catch (ignored) {}
  }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
