import mongoose from "mongoose";
import { schemaOptions } from "../configurations/schemaConfig.js";

const StoryViewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },
  },
  schemaOptions
);

const StoryView = mongoose.model("StoryView", StoryViewSchema);
export default StoryView;
