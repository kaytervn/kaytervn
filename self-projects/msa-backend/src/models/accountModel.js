import mongoose from "mongoose";
import { ACCOUNT_KIND } from "../utils/constant.js";

const AccountSchema = new mongoose.Schema({
  kind: {
    type: Number,
    enum: [ACCOUNT_KIND.ROOT, ACCOUNT_KIND.LINKED],
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
  note: {
    type: String,
  },
  ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    reqquired: true,
  },
  platform: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Platform",
    reqquired: true,
  },
});

const Account = mongoose.model("Account", AccountSchema);
export default Account;
