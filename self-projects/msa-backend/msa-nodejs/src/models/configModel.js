import mongoose from "mongoose";

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
    enum: [1, 2],
    required: true,
  },
});

const Config = mongoose.model("Config", ConfigSchema);
export default Config;
