import { getConfigValue, setConfigValue } from "../config/appProperties.js";
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
import {
  generateMd5,
  generateOTP,
  generateTimestamp,
} from "../services/generateService.js";
import { comparePassword, encodePassword } from "../services/jwtService.js";
import { CONFIG_KEY, CONFIG_KIND, DATABASE_MODELS } from "../utils/constant.js";
import { Buffer } from "buffer";
import fs from "fs";

const downloadBackupData = async (req, res) => {
  try {
    const backupData = {};
    for (const [key, model] of Object.entries(DATABASE_MODELS)) {
      backupData[key] = await model.find({}).lean();
    }
    const apiKey = await getConfigValue(CONFIG_KEY.X_API_KEY);
    const timestamp = generateTimestamp();
    const session = generateMd5(apiKey + generateOTP(10) + timestamp);
    const data = encryptClientField(JSON.stringify(backupData));
    await setConfigValue(
      CONFIG_KEY.BACKUP_FILE_SESSION,
      CONFIG_KIND.SYSTEM,
      await encodePassword(session)
    );
    const object = { data, session: encryptClientField(session) };
    const encrypted = encryptCommonField(JSON.stringify(object));
    const fileName = `backup-data-${timestamp}.txt`;
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
  let backupData;
  try {
    if (!req.file) {
      return makeErrorResponse({ res, message: "No file uploaded" });
    }
    const content = fs.readFileSync(req.file.path, "utf8");
    const { data, session } = JSON.parse(decryptCommonField(content));
    const systemSession = getConfigValue(CONFIG_KEY.BACKUP_FILE_SESSION);
    const decryptedSession = decryptClientField(session);
    if (
      !systemSession ||
      !(await comparePassword(decryptedSession, systemSession))
    ) {
      return makeErrorResponse({
        res,
        message: "Backup file has been expired",
      });
    }
    backupData = JSON.parse(decryptClientField(data));
    if (!backupData || typeof backupData !== "object") {
      return makeErrorResponse({ res, message: "Invalid backup file" });
    }
  } catch {
    return makeErrorResponse({
      res,
      message: "Invalid or tampered backup file",
    });
  }
  try {
    for (const [key, model] of Object.entries(DATABASE_MODELS)) {
      previousData[key] = await model.find({}).lean();
    }
  } catch {
    return makeErrorResponse({
      res,
      message: "Error while restoring backup data",
    });
  }
  try {
    for (const [key, model] of Object.entries(DATABASE_MODELS)) {
      if (!Array.isArray(backupData[key])) {
        return await rollbackData(res, previousData);
      }
      await model.deleteMany({});
      await model.insertMany(backupData[key]);
    }
    return makeSuccessResponse({
      res,
      message: "Backup restored successfully",
    });
  } catch {
    return await rollbackData(res, previousData);
  } finally {
    if (req.file?.path) fs.unlinkSync(req.file.path);
  }
};

export { downloadBackupData, uploadBackupData };
