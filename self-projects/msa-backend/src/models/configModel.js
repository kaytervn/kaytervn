import mongoose from "mongoose";
import { CONFIG_KIND } from "../utils/constant.js";

const ConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  kind: {
    type: Number,
    enum: [CONFIG_KIND.SYSTEM, CONFIG_KIND.RAW],
    required: true,
  },
});

const Config = mongoose.model("Config", ConfigSchema);
export default Config;
