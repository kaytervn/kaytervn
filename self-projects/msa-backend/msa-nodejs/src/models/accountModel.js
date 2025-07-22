import mongoose from "mongoose";
import BackupCode from "./backupCodeModel.js";

const AccountSchema = new mongoose.Schema({
  kind: {
    type: Number,
    enum: [1, 2],
    required: true,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  note: {
    type: String,
  },
  ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  platform: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Platform",
    required: true,
  },
});

AccountSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await BackupCode.deleteMany({ account: this._id });
      next();
    } catch (error) {
      next(error);
    }
  }
);

const Account = mongoose.model("Account", AccountSchema);
export default Account;
