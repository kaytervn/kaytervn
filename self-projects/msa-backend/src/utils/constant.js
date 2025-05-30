/* eslint-disable no-undef */
import "dotenv/config.js";

const DATE_FORMAT = "DD/MM/YYYY HH:mm:ss";
const TIMEZONE = "Asia/Ho_Chi_Minh";
const JSON_LIMIT = "1000mb";
const OTP_VALIDITY = 1; // 1 minute
const RELOAD_INTERVAL = 50000; // 50 seconds

const CORS_OPTIONS = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "message-signature",
    "timestamp",
    "x-api-key",
  ],
  exposedHeaders: ["Content-Disposition"],
};

const API_HEADER = {
  X_API_KEY: "x-api-key",
  AUTHHORIZATION: "authorization",
  MESSAGE_SIGNATURE: "message-signature",
  TIMESTAMP: "timestamp",
};

const ENV = {
  SERVER_PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  MASTER_KEY: process.env.MASTER_KEY,
  X_API_KEY: process.env.X_API_KEY,
  UPLOAD_DIR: process.env.UPLOAD_DIR,
};

const SOCKET_CMD = {
  CLIENT_PING: "CLIENT_PING",
  CMD_LOCK_DEVICE: "CMD_LOCK_DEVICE",
};

const CONFIG_KEY = {
  JWT_SECRET: "JWT_SECRET",
  COMMON_KEY: "COMMON_KEY",
  EBANK_KEY: "EBANK_KEY",
  API_URL: "API_URL",
  JWT_VALIDITY: "JWT_VALIDITY",
  NODEMAILER_USER: "NODEMAILER_USER",
  NODEMAILER_PASS: "NODEMAILER_PASS",
  MASTER_PUBLIC_KEY: "MASTER_PUBLIC_KEY",
  MASTER_PRIVATE_KEY: "MASTER_PRIVATE_KEY",
  MONGODB_URI: "MONGODB_URI",
  CLIENT_ID: "CLIENT_ID",
  CLIENT_SECRET: "CLIENT_SECRET",
};

const ERROR_CODE = {
  SYSTEM_NOT_READY: "SYSTEM_NOT_READY",
  INVALID_SESSION: "INVALID_SESSION",
  INVALID_TOKEN: "INVALID_TOKEN",
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_SIGNATURE: "INVALID_SIGNATURE",
};

const CONFIG_KIND = {
  SYSTEM: 1,
  RAW: 2,
};

const ACCOUNT_KIND = {
  ROOT: 1,
  LINKED: 2,
};

const TOTP = {
  ISSUER: "MSA",
};

const ENCRYPT_FIELDS = {
  TOKEN: ["secretKey"],
  REQUEST_KEY_FORM: ["password"],
  LOGIN_FORM: ["username", "password", "totp"],
  REQUEST_FORGOT_PASSWORD_FORM: ["email"],
  REQUEST_MFA_FORM: ["email", "password"],
  RESET_PASSWORD_FORM: ["userId", "newPassword", "otp"],
  CHANGE_PASSWORD_FORM: ["oldPassword", "newPassword"],
  USER: ["email", "username", "password", "secret", "code"],
  ACCOUNT: ["username", "password", "note"],
  PLATFORM: ["name"],
  CREATE_PLATFORM: ["name"],
  UPDATE_PLATFORM: ["id", "name"],
};

const MIME_TYPES = {
  // Images
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".bmp": "image/bmp",

  // Videos
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".m3u8": "application/x-mpegURL",
  ".ts": "video/mp2t",

  // Soundtracks
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",

  // Documents
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".csv": "text/csv",
  ".json": "application/json",
  ".xml": "application/xml",
  ".md": "text/markdown",
  ".html": "text/html",
};

export {
  CORS_OPTIONS,
  DATE_FORMAT,
  ERROR_CODE,
  ENV,
  CONFIG_KEY,
  CONFIG_KIND,
  JSON_LIMIT,
  API_HEADER,
  TOTP,
  SOCKET_CMD,
  ENCRYPT_FIELDS,
  ACCOUNT_KIND,
  OTP_VALIDITY,
  RELOAD_INTERVAL,
  MIME_TYPES,
  TIMEZONE,
};
