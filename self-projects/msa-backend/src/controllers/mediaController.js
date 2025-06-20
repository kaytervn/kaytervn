import archiver from "archiver";
import fs from "fs";
import path from "path";
import unzipper from "unzipper";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { CONFIG_KEY, MIME_TYPES } from "../utils/constant.js";
import { getConfigValue } from "../config/appProperties.js";

const uploadFile = async (req, res) => {
  try {
    if (!req.file || !req.uploadFolder) {
      return makeErrorResponse({ res, message: "No file uploaded" });
    }

    const folder = req.uploadFolder;
    const filePath = path.join(
      getConfigValue(CONFIG_KEY.UPLOAD_DIR),
      folder,
      req.file.filename
    );

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.renameSync(req.file.path, filePath);

    return makeSuccessResponse({
      res,
      message: "File uploaded successfully",
      data: { filePath: `${folder}/${req.file.filename}` },
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const downloadFile = async (req, res) => {
  try {
    const folderName = req.params.folder;
    const fileName = req.params.fileName;
    const uploadDir = getConfigValue(CONFIG_KEY.UPLOAD_DIR);

    if (!uploadDir) {
      return makeErrorResponse({ res, message: "Server configuration error" });
    }

    const filePath = path.join(uploadDir, folderName, fileName);

    if (!fs.existsSync(filePath)) {
      return makeErrorResponse({ res, message: "File not found" });
    }

    const ext = path.extname(fileName).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);

    readStream.on("error", (err) => {
      return makeErrorResponse({ res, message: err.message });
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const downloadAllFiles = async (req, res) => {
  try {
    const uploadDir = getConfigValue(CONFIG_KEY.UPLOAD_DIR);
    if (!fs.existsSync(uploadDir)) {
      return res.status(404).json({ error: "Directory not found" });
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="backup-${Date.now()}.zip"`
    );

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });
    archive.pipe(res);

    archive.directory(uploadDir, false);

    archive.on("error", (err) => {
      return makeErrorResponse({ res, message: err.message });
    });

    await archive.finalize();
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const backupZipFile = async (req, res) => {
  try {
    if (!req.file) {
      return makeErrorResponse({ res, message: "No ZIP file uploaded" });
    }

    const uploadDir = getConfigValue(CONFIG_KEY.UPLOAD_DIR);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const zip = await unzipper.Open.file(req.file.path);
    await zip.extract({ path: uploadDir });

    if (req.tempDir && fs.existsSync(req.tempDir)) {
      fs.rmSync(req.tempDir, { recursive: true, force: true });
    }

    return makeSuccessResponse({
      res,
      message: "Backup successfully",
    });
  } catch (error) {
    if (req.tempDir && fs.existsSync(req.tempDir)) {
      fs.rmSync(req.tempDir, { recursive: true, force: true });
    }
    return makeErrorResponse({ res, message: error.message });
  }
};

export { uploadFile, downloadFile, downloadAllFiles, backupZipFile };
