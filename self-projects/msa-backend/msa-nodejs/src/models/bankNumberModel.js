import mongoose from "mongoose";

const BankNumberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  bank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bank",
    required: true,
  },
});

const BankNumber = mongoose.model("BankNumber", BankNumberSchema);

export default BankNumber;
