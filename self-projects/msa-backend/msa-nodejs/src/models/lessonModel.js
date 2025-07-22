import mongoose from "mongoose";
import { addDateGetters, schemaOptions } from "../config/schemaConfig.js";

const LessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    document: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  schemaOptions
);

addDateGetters(LessonSchema);

const Lesson = mongoose.model("Lesson", LessonSchema);
export default Lesson;
