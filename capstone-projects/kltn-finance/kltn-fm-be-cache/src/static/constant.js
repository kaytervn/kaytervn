import "dotenv/config.js";

const DATE_FORMAT = "DD/MM/YYYY HH:mm:ss";
const GEMINI_MODEL = "gemini-2.0-flash";

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-API-Key", "X-tenant"],
  exposedHeaders: ["Content-Disposition"],
};

const ENV = {
  SERVER_PORT: process.env.PORT,
  X_API_KEY: process.env.X_API_KEY,
  APP_URLS: process.env.URLS?.split(",").map((url) => url.trim()) || [],
  MEDIA_SECRET: process.env.MEDIA_SECRET,
  UPLOAD_DIR: process.env.UPLOAD_DIR,
  MONGODB_URI: process.env.MONGODB_URI,
  DB_NAME: process.env.DB_NAME,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  SOCKET_MEDIA_URL: "https://finance-media.onrender.com",
  WEBSOCKET_URL: "wss://finance-socket.onrender.com/ws",
};

const CACHE_TTL = 2592000000; // 30 days
const CACHE_MAX_SIZE = 10000;
const ACTIVE_SOCKET_INTERVAL = 30000;
const RELOAD_INTERVAL = 50000;

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
  ".ogg": "audio/ogg",

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
  corsOptions,
  DATE_FORMAT,
  ENV,
  CACHE_TTL,
  CACHE_MAX_SIZE,
  MIME_TYPES,
  GEMINI_MODEL,
  RELOAD_INTERVAL,
  ACTIVE_SOCKET_INTERVAL,
};
