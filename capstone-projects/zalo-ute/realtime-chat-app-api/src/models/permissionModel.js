import mongoose from "mongoose";
import { schemaOptions } from "../configurations/schemaConfig.js";

const PermissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },
    permissionCode: {
      type: String,
      required: true,
    },
  },
  schemaOptions
);

const Permission = mongoose.model("Permission", PermissionSchema);
export default Permission;
