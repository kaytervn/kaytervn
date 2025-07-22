import express from "express";
import multer from "multer";
import {
  downloadBackupData,
  uploadBackupData,
} from "../controllers/dataBackupController.js";

const router = express.Router();
const upload = multer({ dest: "backup-uploads/" });

router.get("/download", downloadBackupData);
router.post("/upload", upload.single("file"), uploadBackupData);

export { router as dataBackupRouter };
