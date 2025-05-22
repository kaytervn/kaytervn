import mongoose from "mongoose";
import { schemaOptions } from "../configurations/schemaConfig.js";
import { deleteFileByUrl } from "../services/apiService.js";
import StoryView from "./storyViewModel.js";
import Notification from "./notificationModel.js";

const StorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  schemaOptions
);

StorySchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await deleteFileByUrl(this.imageUrl);
      await StoryView.deleteMany({ story: this._id });
      await Notification.deleteMany({
        "data.story._id": this._id,
      });
      next();
    } catch (error) {
      next(error);
    }
  }
);

const Story = mongoose.model("Story", StorySchema);
export default Story;
