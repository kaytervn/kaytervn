import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  linkGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LinkGroup",
    reqquired: true,
  },
});

const Link = mongoose.model("Link", LinkSchema);
export default Link;
