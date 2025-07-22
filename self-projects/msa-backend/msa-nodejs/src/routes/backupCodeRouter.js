import express from "express";
import { bearerAuth } from "../middlewares/auth.js";
import {
  createBackupCode,
  updateBackupCode,
  deleteBackupCode,
  getBackupCode,
  getListBackupCodes,
} from "../controllers/backupCodeController.js";

const router = express.Router();

router.post("/create", bearerAuth, createBackupCode);
router.put("/update", bearerAuth, updateBackupCode);
router.delete("/delete/:id", bearerAuth, deleteBackupCode);
router.get("/get/:id", bearerAuth, getBackupCode);
router.get("/list", bearerAuth, getListBackupCodes);

export { router as backupCodeRouter };
