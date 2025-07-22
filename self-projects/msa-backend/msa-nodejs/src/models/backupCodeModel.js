import mongoose from "mongoose";

const BackupCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
});

const BackupCode = mongoose.model("BackupCode", BackupCodeSchema);

export default BackupCode;
