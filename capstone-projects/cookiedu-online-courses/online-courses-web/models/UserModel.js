import mongoose from "mongoose";
import Role from "./RoleEnum.js";

const UserSchema = new mongoose.Schema(
  {
    cloudinary: {
      type: String,
      default: "",
    },
    picture: {
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
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    otp: {
      type: Number,
      default: "",
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.STUDENT,
    },
    status: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
