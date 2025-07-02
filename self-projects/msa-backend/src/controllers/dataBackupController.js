import {
  decryptClientField,
  encryptClientField,
} from "../encryption/clientEncryption.js";
import {
  decryptCommonField,
  encryptCommonField,
} from "../encryption/commonEncryption.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { generateTimestamp } from "../services/generateService.js";
import { DATABASE_MODELS } from "../utils/constant.js";
import { Buffer } from "buffer";
import fs from "fs";

const downloadBackupData = async (req, res) => {
  try {
    const backupData = {};
    for (const [key, model] of Object.entries(DATABASE_MODELS)) {
      backupData[key] = await model.find({}).lean();
    }
    const encrypted = encryptClientField(
      encryptCommonField(JSON.stringify(backupData))
    );
    const fileName = `backup-data-${generateTimestamp()}.txt`;
    const buffer = Buffer.from(encrypted, "utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "text/plain");
    res.send(buffer);
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const rollbackData = async (res, previousData) => {
  for (const [key, model] of Object.entries(DATABASE_MODELS)) {
    await model.deleteMany({});
    if (Array.isArray(previousData[key])) {
      await model.insertMany(previousData[key]);
    }
  }
  return makeErrorResponse({
    res,
    message: "Processing failed",
  });
};

const uploadBackupData = async (req, res) => {
  const previousData = {};
  try {
    if (!req.file) {
      return makeErrorResponse({ res, message: "No file uploaded" });
    }
    const content = fs.readFileSync(req.file.path, "utf8");
    const backupData = JSON.parse(
      decryptCommonField(decryptClientField(content))
    );
    if (!backupData || typeof backupData !== "object") {
      return makeErrorResponse({ res, message: "Invalid backup file" });
    }
    for (const [key, model] of Object.entries(DATABASE_MODELS)) {
      previousData[key] = await model.find({}).lean();
    }
    for (const [key, model] of Object.entries(DATABASE_MODELS)) {
      try {
        if (Array.isArray(backupData[key])) {
          await model.deleteMany({});
          await model.insertMany(backupData[key]);
        } else {
          return rollbackData(res, previousData);
        }
      } catch {
        return rollbackData(res, previousData);
      }
    }
    return makeSuccessResponse({
      res,
      message: "Backup restored successfully",
    });
  } catch {
    return rollbackData(res, previousData);
  } finally {
    if (req.file?.path) fs.unlinkSync(req.file.path);
  }
};

export { downloadBackupData, uploadBackupData };
