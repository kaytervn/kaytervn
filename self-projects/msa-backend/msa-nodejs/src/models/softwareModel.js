import mongoose from "mongoose";

const SoftwareSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  kind: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7],
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
