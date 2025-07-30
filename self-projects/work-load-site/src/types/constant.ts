const colors = [
  "#304C73",
  "#A35454",
  "#8C4E4E",
  "#849EBC",
  "#463457",
  "#9A6BAA",
  "#334F4F",
  "#566D64",
  "#7E8F82",
  "#A5636D",
  "#7B5C7F",
  "#6B4A6E",
  "#382B66",
  "#684A8F",
  "#D97191",
  "#F49A7A",
  "#43357D",
  "#5A5399",
  "#2F4858",
  "#4E696B",
  "#6A8B87",
  "#40405A",
  "#575B7E",
  "#7A849E",
  "#2A4F4F",
  "#FF6F61",
  "#6B4226",
  "#C8A165",
  "#FFD662",
  "#D4E157",
  "#558B2F",
  "#00695C",
  "#26A69A",
  "#81D4FA",
  "#1E88E5",
  "#3949AB",
  "#7E57C2",
  "#8E24AA",
  "#AD1457",
  "#D81B60",
  "#C2185B",
  "#880E4F",
  "#EC407A",
  "#FF4081",
  "#F06292",
  "#BA68C8",
  "#9575CD",
  "#7986CB",
  "#64B5F6",
  "#4FC3F7",
  "#4DD0E1",
  "#4DB6AC",
  "#81C784",
  "#AED581",
  "#FFB74D",
  "#FF8A65",
  "#A1887F",
  "#90A4AE",
  "#FF5722",
  "#DD2C00",
  "#6D4C41",
  "#9E9D24",
  "#1B5E20",
  "#004D40",
  "#01579B",
  "#1A237E",
  "#311B92",
  "#4A148C",
  "#880E4F",
  "#C62828",
  "#AD1457",
  "#4E342E",
  "#37474F",
  "#00BCD4",
  "#8BC34A",
  "#CDDC39",
  "#FFC107",
  "#FF9800",
  "#FFEB3B",
  "#F44336",
  "#9C27B0",
  "#3F51B5",
  "#03A9F4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFEB3B",
  "#FFC107",
  "#FF9800",
  "#FF5722",
  "#795548",
  "#607D8B",
  "#9E9E9E",
  "#B0BEC5",
  "#C5CAE9",
];

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

const HostPattern = /^(?:https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/;
const PathPattern = /^\/([a-zA-Z0-9_-]+\/)*([a-zA-Z0-9_-]+)(\?[^#]*)?$/;
const HeaderPattern = /^[a-zA-Z0-9-]+$/;
const defaultInteger = 0;
const defaultLong = 6969696969696969;
const defaultDouble = 0.1;
const defaultPageSize = 20;
const defaultBasicAuth = {
  type: "basic",
  basic: [
    { key: "username", value: "{{clientId}}", type: "string" },
    { key: "password", value: "{{clientSecret}}", type: "string" },
  ],
};
const defaultNoAuth = {
  type: "noauth",
};
const defaultTenantHeader = [
  {
    key: "X-tenant",
    value: "{{localTenantId}}",
    type: "text",
    disabled: true,
  },
  {
    key: "X-tenant",
    value: "{{remoteTenantId}}",
    type: "text",
    disabled: true,
  },
];

const myPublicSecretKey = "D@y1aK3yDu0cC0n9";

const ITEMS_PER_PAGE = 17;
const GRID_TRUNCATE = 125;
const TRUNCATE_LENGTH = 150;
const FETCH_INTERVAL = 300;
const SESSION_KEY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours
const PING_INTERVAL = 50000; // 50s
export const DATE_FORMAT = "dd/MM/yyyy";
export const DAY_MONTH_FORMAT = "dd/MM";
export const TIMEZONE_VIETNAM = "Asia/Ho_Chi_Minh";

const LOCAL_STORAGE = {
  SESSION_KEY: "msa_session_key",
  ACCESS_TOKEN: "msa_access_token",
  MSA_COLLAPSED_GROUPS: "msa_collapsed_groups",
  IS_COLLAPSED: "wls_is_collapsed",
  COLLAPSED_GROUPS: "wls_collapsed_groups",
  N_LESSONS_COLLAPSED_GROUPS: "n_lessons_collapsed_groups",
  N_LESSONS_API_KEY: "n_lessons_api_key",
};

const METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

const ALIGNMENT = {
  LEFT: "left",
  RIGHT: "right",
  CENTER: "center",
};

const ERROR_CODE = {
  SYSTEM_NOT_READY: "SYSTEM_NOT_READY",
  INVALID_SESSION: "INVALID_SESSION",
  INVALID_TOKEN: "INVALID_TOKEN",
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_SIGNATURE: "INVALID_SIGNATURE",
};

const API_HEADER = {
  MESSAGE_SIGNATURE: "message-signature",
  TIMESTAMP: "timestamp",
  AUTHORIZATION: "authorization",
  X_API_KEY: "x-api-key",
  CLIENT_REQUEST_ID: "client-request-id",
  X_FINGERPRINT: "x-fingerprint",
  X_TENANT: "x-tenant",
};

const AUTH_TYPE = {
  NONE: "none",
  BEARER: "bearer",
  BASIC: "basic",
};

const BASIC_MESSAGES = {
  INVALID_FORM: "Please enter valid data",
  SUCCESS: "Request successfully",
  FAILED: "Request failed",
  LOGGED_IN: "Log in successfully",
  LOG_IN_FAILED: "Log in failed",
  CREATED: "Created successfully",
  UPDATED: "Updated successfully",
  DELETED: "Deleted successfully",
  NO_DATA: "No Data",
  VERIFY_FAILED: "Verify failed",
};

const BUTTON_TEXT = {
  VERIFY: "Verify",
  ACCEPT: "Accept",
  CLEAR: "Clear",
  REQUEST_KEY: "Request Key",
  HOME: "Home",
  SUBMIT: "Submit",
  TWO_FACTOR: "Verify Code",
  CONTINUE: "Continue",
  LOGIN: "Sign In",
  SEARCH: "Search",
  REFRESH: "Refresh",
  CREATE: "Create",
  UPDATE: "Update",
  DELETE: "Delete",
  CANCEL: "Cancel",
  DONE: "Done",
  BACK: "Back",
  UPLOAD: "Upload",
  DOWNLOAD: "Download",
  CHANGE_PASSWORD: "Change Password",
  CHANGE_PIN: "Change PIN",
  LOGOUT: "Log Out",
  CLEAR_SYSTEM_KEY: "Clear System Key",
  DOWNLOAD_DATA_BACKUP: "Download Backup Data",
  UPLOAD_DATA_BACKUP: "Upload Backup Data",
  BACKUP_CODE: "Backup Codes",
  LINKED_ACCOUNTS: "Link Accounts",
  VIEW_ROOT_ACCOUNT: "View Root Account",
};

const ENV = {
  MSA_CLIENT_ID: import.meta.env.VITE_MSA_CLIENT_ID,
  MSA_CLIENT_SECRET: import.meta.env.VITE_MSA_CLIENT_SECRET,
  MSA_NODEJS_API_URL: import.meta.env.VITE_MSA_NODEJS_API_URL,
  MSA_JAVA_API_URL: import.meta.env.VITE_MSA_JAVA_API_URL,
  MSA_X_API_KEY: import.meta.env.VITE_MSA_X_API_KEY,
  MSA_CLIENT_KEY: import.meta.env.VITE_MSA_CLIENT_KEY,
  MSA_SOCKET_URL: import.meta.env.VITE_MSA_SOCKET_URL,
};

const TOAST = {
  SUCCESS: "success",
  ERROR: "error",
  WARN: "warning",
};

const SOCKET_CMD = {
  CMD_CLIENT_PING: "CMD_CLIENT_PING",
  CMD_LOCK_DEVICE: "CMD_LOCK_DEVICE",
};

const Z_INDEXES = {
  UNAUTHORIZED_DIALOG: 1000,
  DEFAULT_MODAL: 50,
};

const DOC_TITLE = {
  MSA: "MSA",
  N_LESSONS: "N Lessons",
};

const ACCOUNT_KIND_MAP = {
  ROOT: {
    value: 1,
    label: "Root",
    className: "bg-blue-900 text-blue-300",
  },
  LINKED: {
    value: 2,
    label: "Link",
    className: "bg-green-900 text-green-300",
  },
};

const SORT_ACCOUNT_MAP = {
  CREATED_DATE_DESC: {
    value: 1,
    label: "Created Date [Desc]",
  },
  TOTAL_CHILDREN_DESC: {
    value: 2,
    label: "Link Accounts [Desc]",
  },
};

const SORT_PLATFORM_MAP = {
  CREATED_DATE_DESC: {
    value: 1,
    label: "Created Date [Desc]",
  },
  TOTAL_ACCOUNT_DESC: {
    value: 2,
    label: "Total Accounts [Desc]",
  },
};

const STATUS_MAP = {
  ACTIVE: {
    value: 1,
    label: "Active",
    className: "bg-green-900 text-green-300",
  },
  PENDING: {
    value: 0,
    label: "Pending",
    className: "bg-yellow-900 text-yellow-300",
  },
  LOCKED: {
    value: -1,
    label: "Locked",
    className: "bg-gray-900 text-gray-300",
  },
};

const USER_KIND_MAP = {
  ADMIN: {
    value: 1,
    label: "Admin",
    className: "bg-blue-900 text-blue-300",
  },
  USER: {
    value: 2,
    label: "User",
    className: "bg-red-900 text-red-300",
  },
};

const GRANT_TYPE_MAP = {
  PASSWORD: {
    value: "password",
    label: "Admin",
    className: "bg-blue-900 text-blue-300",
  },
  USER: {
    value: "user",
    label: "User",
    className: "bg-red-900 text-red-300",
  },
};

export const TAG_KIND_MAP = {
  ACCOUNT: {
    value: 1,
    label: "Account",
    className: "bg-blue-900 text-blue-300",
  },
  BANK: {
    value: 2,
    label: "Bank",
    className: "bg-green-900 text-green-300",
  },
  CONTACT: {
    value: 3,
    label: "Contact",
    className: "bg-yellow-900 text-yellow-300",
  },
  ID_NUMBER: {
    value: 4,
    label: "ID Number",
    className: "bg-purple-900 text-purple-300",
  },
  LINK: {
    value: 5,
    label: "Link",
    className: "bg-indigo-900 text-indigo-300",
  },
  NOTE: {
    value: 6,
    label: "Note",
    className: "bg-gray-700 text-gray-300",
  },
  SCHEDULE: {
    value: 7,
    label: "Schedule",
    className: "bg-pink-900 text-pink-300",
  },
  SOFTWARE: {
    value: 8,
    label: "Software",
    className: "bg-teal-900 text-teal-300",
  },
};

const VALID_PATTERN = {
  EMAIL: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
  PHONE: /^0[35789][0-9]{8}$/,
  PASSWORD: /^.{6,}$/,
  USERNAME: /^[a-z0-9](?:[a-z0-9._-]{2,28}[a-z0-9])?$/,
  HOST: /^(localhost|(([a-z0-9-]+\.)*[a-z]{2,})|(\d{1,3}\.){3}\d{1,3}|\[([0-9a-f:]+)\])$/,
  PORT: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,
  COLOR_CODE: /^#[0-9A-F]{6}$/i,
  TIME: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
};

export const BANK_NUMBER_FIELD_CONFIG = {
  key: {
    label: "Number",
    required: true,
  },
  value: {
    label: "Note",
    required: false,
  },
};

export const BANK_PIN_FIELD_CONFIG = {
  key: {
    label: "Pin",
    required: true,
  },
  value: {
    label: "Note",
    required: false,
  },
};

export const CONTACT_PHONE_FIELD_CONFIG = {
  key: {
    label: "Phone",
    required: true,
  },
  value: {
    label: "Note",
    required: false,
  },
};

export const SCHEDULE_EMAIL_FIELD_CONFIG = {
  key: {
    label: "Email",
    required: true,
  },
  value: {
    label: "Receiver",
    required: true,
  },
};

export const SCHEDULE_KIND_MAP = {
  DAYS: {
    value: 1,
    label: "Repeat every X day(s)",
    className: "bg-blue-700 text-blue-100",
  },
  MONTHS: {
    value: 2,
    label: "Repeat every X month(s)",
    className: "bg-green-700 text-green-100",
  },
  DAY_MONTH: {
    value: 3,
    label: "Repeat on specific day/month",
    className: "bg-yellow-700 text-yellow-100",
  },
  EXACT_DATE: {
    value: 4,
    label: "One-time on exact date",
    className: "bg-gray-700 text-gray-100",
  },
};

export const SCHEDULE_TYPE_MAP = {
  AUTO_RENEW: {
    value: 1,
    label: "Auto-renew enabled",
    className: "bg-indigo-700 text-indigo-100",
  },
  MANUAL_RENEW: {
    value: 2,
    label: "Manual renewal required",
    className: "bg-orange-700 text-orange-100",
  },
  SUSPENDED: {
    value: 3,
    label: "Temporarily suspended",
    className: "bg-red-700 text-red-100",
  },
};

export {
  GRANT_TYPE_MAP,
  defaultInteger,
  defaultLong,
  defaultPageSize,
  defaultBasicAuth,
  defaultTenantHeader,
  defaultDouble,
  colors,
  myPublicSecretKey,
  PathPattern,
  defaultNoAuth,
  HeaderPattern,
  HostPattern,
  LOCAL_STORAGE,
  ENV,
  TOAST,
  ITEMS_PER_PAGE,
  TRUNCATE_LENGTH,
  FETCH_INTERVAL,
  METHOD,
  ALIGNMENT,
  ERROR_CODE,
  BASIC_MESSAGES,
  BUTTON_TEXT,
  SESSION_KEY_TIMEOUT,
  AUTH_TYPE,
  API_HEADER,
  SOCKET_CMD,
  Z_INDEXES,
  MIME_TYPES,
  DOC_TITLE,
  ACCOUNT_KIND_MAP,
  GRID_TRUNCATE,
  SORT_ACCOUNT_MAP,
  SORT_PLATFORM_MAP,
  STATUS_MAP,
  PING_INTERVAL,
  VALID_PATTERN,
  USER_KIND_MAP,
};
