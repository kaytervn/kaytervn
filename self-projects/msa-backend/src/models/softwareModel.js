import mongoose from "mongoose";
import { SOFTWARE_KIND } from "../utils/constant.js";

const SoftwareSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  kind: {
    type: Number,
    enum: Object.values(SOFTWARE_KIND),
    required: true,
  },
  link: {
    type: String,
  },
  note: {
    type: String,
  },
});

const Software = mongoose.model("Software", SoftwareSchema);

export default Software;
