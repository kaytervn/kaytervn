import mongoose from "mongoose";
import { schemaOptions } from "../configurations/schemaConfig.js";

const SettingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    keyName: {
      type: String,
      required: true,
    },
    roleKind: {
      type: Number,
      enum: [1, 2, 3], // 1: user, 2: manager, 3: admin
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  schemaOptions
);

const Setting = mongoose.model("Setting", SettingSchema);
export default Setting;
