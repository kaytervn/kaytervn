import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { DATE_FORMAT, OTP_VALIDITY } from "./constant.js";
import { getCloudinary } from "../config/cloudinary.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const formatDateUTC = () => dayjs().utc().format(DATE_FORMAT);

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const extractAppNameFromMongoUri = (uri) => {
  try {
    const url = new URL(uri);
    const appName = url.searchParams.get("appName");
    return appName || null;
  } catch (err) {
    console.error("Invalid URI:", err.message);
    return null;
  }
};

const getNestedValue = (obj, path, defaultValue = null) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? defaultValue;
};

const verifyTimestamp = (timestamp) => {
  const createdAt = new Date(timestamp);
  const now = new Date();
  if ((now - createdAt) / (60 * 1000) > OTP_VALIDITY) {
    return false;
  }
  return true;
};

const extractIdFromFilePath = (filePath) => {
  const parts = filePath.split("/");
  const fileName = parts[parts.length - 1];
  const id = fileName.split(".")[0];
  return id;
};

const deleteFileByUrl = async (url) => {
  try {
    const cloudinary = getCloudinary();
    if (url) {
      await cloudinary.uploader.destroy(extractIdFromFilePath(url));
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

export {
  formatDateUTC,
  isValidUrl,
  extractAppNameFromMongoUri,
  getNestedValue,
  verifyTimestamp,
  deleteFileByUrl,
};
