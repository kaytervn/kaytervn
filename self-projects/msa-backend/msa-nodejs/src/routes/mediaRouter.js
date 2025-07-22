import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import nLessonsAuth from "../middlewares/nLessonAuth.js";
import {
  backupZipFile,
  downloadAllFiles,
  downloadFile,
  uploadFile,
} from "../controllers/mediaController.js";
import { CONFIG_KEY } from "../utils/constant.js";
import { getConfigValue } from "../config/appProperties.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = Date.now().toString();
    const folderPath = path.join(getConfigValue(CONFIG_KEY.UPLOAD_DIR), folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    req.uploadFolder = folder;
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storageBackup = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempDir = path.join(
      getConfigValue(CONFIG_KEY.UPLOAD_DIR),
      `temp_${Date.now()}`
    );
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    req.tempDir = tempDir;
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
const uploadBackup = multer({ storage: storageBackup });

router.post("/upload", nLessonsAuth(), upload.single("file"), uploadFile);
router.get("/download/:folder/:fileName", downloadFile);
router.get("/download-backup", nLessonsAuth(), downloadAllFiles);
router.post(
  "/push-backup",
  nLessonsAuth(),
  uploadBackup.single("zipFile"),
  backupZipFile
);

export { router as mediaRouter };
