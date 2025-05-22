import express from "express";
import auth from "../middlewares/authentication.js";
import {
  createPermission,
  getListPermissions,
} from "../controllers/permissionController.js";
const router = express.Router();

router.post("/create", auth("PER_C"), createPermission);
router.get("/list", auth("PER_L"), getListPermissions);

export { router as permissionRouter };
