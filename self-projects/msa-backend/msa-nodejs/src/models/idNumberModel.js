import mongoose from "mongoose";

const IdNumberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
});

const IdNumber = mongoose.model("IdNumber", IdNumberSchema);

export default IdNumber;
