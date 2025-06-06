import mongoose from "mongoose";
import { SOFTWARE_KIND } from "../utils/constant";

const SoftwareSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  kind: {
    type: Number,
    enum: [...SOFTWARE_KIND],
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
