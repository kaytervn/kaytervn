import mongoose from "mongoose";
import { schemaOptions } from "../configurations/schemaConfig.js";

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    kind: {
      type: Number,
      enum: [1, 2, 3], // 1: user, 2: manager, 3: admin
      default: 1,
    },
  },
  schemaOptions
);

const Role = mongoose.model("Role", RoleSchema);
export default Role;
