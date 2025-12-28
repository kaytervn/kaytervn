export const TEXT = {
  LOGIN: "Đăng nhập",
  CONTINUE: "Tiếp tục",
  BACK: "Trở về",
  CANCEL: "Hủy",
  FORGOT_PASSWORD: "Quên mật khẩu",
  RESET_PASSWORD: "Đặt lại mật khẩu",
  USERNAME: "Tài khoản",
  PASSWORD: "Mật khẩu",
  EMAIL: "Địa chỉ e-mail",
  VERIFY_MFA: "Xác thực hai bước",
  VERIFY_CODE: "Mã xác thực",
  SAMPLE_TEXT: "Sample text",
  SEARCH: "Tìm kiếm...",
  CREATE: "Thêm",
  PAGE_NOT_FOUND: "Không tìm thấy trang",
  REQUEST_FAILED: "Gửi yêu cầu thất bại",
  SESSION_KEY_TIMEOUT: "Phiên giải mã hết hạn",
  LOGIN_FAILED: "Tài khoản hoặc mật khẩu không đúng",
  INVALID_FORM: "Vui lòng kiểm tra lại thông tin",
  INVALID_TOTP: "Mã xác thực không đúng",
  LOGGED_IN: "Đăng nhập thành công",
  REQUEST_KEY_SUCCESS: "Tải tệp thành công",
  CHANGE_PASSWORD_SUCCESS: "Đổi mật khẩu thành công",
  INVALID_PASSWORD: "Sai mật khẩu",
  REQUEST_SUCCESS: "Yêu cầu thành công",
  INVALID_EMAIL: "Địa chỉ e-mail không tồn tại",
  SEND: "Gửi",
  EXIT: "Thoát",
  CLOSE: "Đóng",
  SAVE: "Lưu",
  CONFIRM_PASSWORD: "Mật khẩu xác nhận",
  NEW_PASSWORD: "Mật khẩu mới",
  CURRENT_PASSWORD: "Mật khẩu hiện tại",
  PROFILE: "Hồ sơ",
  REQUEST_KEY: "Lấy mã khoá",
  CHANGE_PASSWORD: "Đổi mật khẩu",
  LOGOUT: "Đăng xuất",
  UPDATED: "Sửa thành công",
  CREATED: "Thêm thành công",
  DELETED: "Xoá thành công",
  LOADING: "Đang tải...",
  NO_DATA: "Không có dữ liệu",
  CREATE_PLATFORM: "Thêm nền tảng",
  UPDATE_PLATFORM: "Sửa nền tảng",
  DELETE_PLATFORM: "Xoá nền tảng",
  DELETE_ACCOUNT: "Xoá tài khoản",
  CREATE_TAG: "Thêm thẻ",
  UPDATE_TAG: "Sửa thẻ",
  DELETE_TAG: "Xoá thẻ",
  DELETE_BANK: "Xoá ngân hàng",
  UPDATE: "Sửa",
  DELETE: "Xoá",
  SUBMIT: "Nhập",
  LINK: "Liên kết",
  CONFIRM: "Xác nhận",
};

export const ERROR_MESSAGE_MAP: Record<string, string> = {
  "ERROR-PLATFORM-0001": "Tên nền tảng đã tồn tại",
  "ERROR-PLATFORM-0002": "Nền tảng đang được dùng",
  "ERROR-ACCOUNT-0001": "Tài khoản có liên kết",
  "ERROR-ACCOUNT-0002": "Tài khoản đã tồn tại",
  "ERROR-TAG-0001": "Tên thẻ đã tồn tại",
  "ERROR-TAG-0002": "Thẻ đang được dùng",
  "ERROR-BANK-0001": "Tên tài khoản đã tồn tại",
};

export const GRANT_TYPE = {
  PASSWORD: "password",
};

export const TINY_TEXT_MAX_LENGTH = 100;
export const TEXT_MAX_LENGTH = 1000;
export const ITEMS_PER_PAGE = 21;
export const FETCH_INTERVAL = 300;
export const SESSION_KEY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
export const PING_INTERVAL = 50000; // 50s
export const DEFAULT_COLOR = "#FFFFFF";

export const LOCAL_STORAGE = {
  SESSION_KEY: "msa_session_key",
  ACCESS_TOKEN: "msa_access_token",
};

export const METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

export const ERROR_CODE = {
  SYSTEM_NOT_READY: "SYSTEM_NOT_READY",
  INVALID_SESSION: "INVALID_SESSION",
  INVALID_TOKEN: "INVALID_TOKEN",
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_SIGNATURE: "INVALID_SIGNATURE",
};

export const API_HEADER = {
  MESSAGE_SIGNATURE: "message-signature",
  TIMESTAMP: "timestamp",
  AUTHORIZATION: "authorization",
  X_API_KEY: "x-api-key",
  CLIENT_REQUEST_ID: "client-request-id",
  X_FINGERPRINT: "x-fingerprint",
  X_TENANT: "x-tenant",
};

export const AUTH_TYPE = {
  NONE: "none",
  BEARER: "bearer",
  BASIC: "basic",
};

export const TOAST = {
  SUCCESS: "success",
  ERROR: "error",
  WARN: "warning",
  INFO: "info",
};

export const Z_INDEXES = {
  UNAUTHORIZED_DIALOG: 1000,
  DEFAULT_MODAL: 50,
  TOOLBAR: 10,
};

export const SOCKET_CMD = {
  CMD_CLIENT_PING: "CMD_CLIENT_PING",
  CMD_LOCK_DEVICE: "CMD_LOCK_DEVICE",
};

export const ENV = {
  CLIENT_SECRET: import.meta.env.VITE_CLIENT_SECRET,
  CLIENT_ID: import.meta.env.VITE_CLIENT_ID,
  API_KEY: import.meta.env.VITE_API_KEY,
  API_URL: import.meta.env.VITE_API_URL,
  CLIENT_KEY: import.meta.env.VITE_CLIENT_KEY,
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL,
};

export const VALID_PATTERN = {
  EMAIL: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
  PHONE: /^0[35789][0-9]{8}$/,
  PASSWORD: /^.{6,}$/,
  USERNAME: /^[a-z0-9](?:[a-z0-9._-]{2,28}[a-z0-9])?$/,
  HOST: /^(localhost|(([a-z0-9-]+\.)*[a-z]{2,})|(\d{1,3}\.){3}\d{1,3}|\[([0-9a-f:]+)\])$/,
  PORT: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,
  COLOR_CODE: /^#[0-9A-F]{6}$/i,
  TIME: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
  DATE: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/,
  DAY_MONTH: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])$/,
};

export const USER_KIND = {
  ADMIN: 1,
  USER: 2,
};
