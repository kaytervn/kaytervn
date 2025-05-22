import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    cloudinary: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: null,
    },
    otp: { type: String, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
