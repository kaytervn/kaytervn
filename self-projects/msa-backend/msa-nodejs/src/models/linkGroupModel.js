import mongoose from "mongoose";

const LinkGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const LinkGroup = mongoose.model("LinkGroup", LinkGroupSchema);

export default LinkGroup;
