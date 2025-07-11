/* eslint-disable no-undef */
import "dotenv/config.js";
import {
  ACCOUNT_ENCRYPT_FIELDS,
  BACKUP_CODE_ENCRYPT_FIELDS,
  BANK_ENCRYPT_FIELDS,
  ID_NUMBER_ENCRYPT_FIELDS,
  LINK_ENCRYPT_FIELDS,
  LINK_GROUP_ENCRYPT_FIELDS,
  NOTE_ENCRYPT_FIELDS,
  PLATFORM_ENCRYPT_FIELDS,
  SOFTWARE_ENCRYPT_FIELDS,
} from "../encryption/encryptFieldConfig.js";
import rateLimit from "express-rate-limit";
import Account from "../models/accountModel.js";
import BackupCode from "../models/backupCodeModel.js";
import Bank from "../models/bankModel.js";
import BankNumber from "../models/bankNumberModel.js";
import Category from "../models/categoryModel.js";
import IdNumber from "../models/idNumberModel.js";
import Lesson from "../models/lessonModel.js";
import LinkGroup from "../models/linkGroupModel.js";
import Link from "../models/linkModel.js";
import Platform from "../models/platformModel.js";
import Note from "../models/noteModel.js";
import Software from "../models/softwareModel.js";

const DATE_FORMAT = "DD/MM/YYYY HH:mm:ss";
const TIMEZONE = "Asia/Ho_Chi_Minh";
const JSON_LIMIT = "1000mb";
const OTP_VALIDITY = 1; // 1 minute
const REQUEST_VALIDITY = 2; // 2 minutes
const RELOAD_INTERVAL = 50000; // 50 seconds

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
  CLOUD_NAME: "CLOUD_NAME",
  CLOUD_API_KEY: "CLOUD_API_KEY",
  CLOUD_API_SECRET: "CLOUD_API_SECRET",
  PORT: "PORT",
  X_API_KEY: "X_API_KEY",
  UPLOAD_DIR: "UPLOAD_DIR",
  ALLOWED_DOMAINS: "ALLOWED_DOMAINS",
  ALLOWED_ENDPOINTS: "ALLOWED_ENDPOINTS",
  BACKUP_FILE_SESSION: "BACKUP_FILE_SESSION",
};

const API_HEADER = {
  X_API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  MESSAGE_SIGNATURE: "message-signature",
  TIMESTAMP: "timestamp",
  CLIENT_REQUEST_ID: "client-request-id",
};

const LIMITER = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    result: false,
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const CORS_OPTIONS = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", ...Object.values(API_HEADER)],
  exposedHeaders: ["Content-Disposition"],
};

const ENV = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  MASTER_KEY: process.env.MASTER_KEY,
};

const SOCKET_CMD = {
  CLIENT_PING: "CLIENT_PING",
  CMD_LOCK_DEVICE: "CMD_LOCK_DEVICE",
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

const SOFTWARE_KIND = {
  NESESSARY: 1,
  MOBILE: 2,
  STUDY: 3,
  WORKING: 4,
  GAMES: 5,
  OTHERS: 6,
  TOOLS: 7,
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
  CHANGE_PIN_FORM: ["oldPin", "newPin", "currentPassword"],
  USER: ["email", "username", "password", "secret", "code", "pin", "otp"],
  ...ACCOUNT_ENCRYPT_FIELDS,
  ...PLATFORM_ENCRYPT_FIELDS,
  ...LINK_GROUP_ENCRYPT_FIELDS,
  ...BACKUP_CODE_ENCRYPT_FIELDS,
  ...BANK_ENCRYPT_FIELDS,
  ...ID_NUMBER_ENCRYPT_FIELDS,
  ...LINK_ENCRYPT_FIELDS,
  ...NOTE_ENCRYPT_FIELDS,
  ...SOFTWARE_ENCRYPT_FIELDS,
};

const DATABASE_MODELS = {
  accounts: Account,
  backupcodes: BackupCode,
  banks: Bank,
  banknumbers: BankNumber,
  categories: Category,
  idnumbers: IdNumber,
  lessons: Lesson,
  linkgroups: LinkGroup,
  links: Link,
  notes: Note,
  platforms: Platform,
  softwares: Software,
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
  CONFIG_KIND,
  CORS_OPTIONS,
  DATE_FORMAT,
  ERROR_CODE,
  ENV,
  CONFIG_KEY,
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
  SOFTWARE_KIND,
  LIMITER,
  DATABASE_MODELS,
  REQUEST_VALIDITY,
};
