import mongoose from "mongoose";
import BankNumber from "./bankNumberModel.js";

const BankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

BankSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await BankNumber.deleteMany({ bank: this._id });
      next();
    } catch (error) {
      next(error);
    }
  }
);

const Bank = mongoose.model("Bank", BankSchema);
export default Bank;
