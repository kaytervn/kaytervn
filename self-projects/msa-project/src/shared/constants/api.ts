import type { AuthType, HttpMethod } from "@/shared/types/api.types";

/** HTTP method constants (typed) */
export const METHOD: Record<string, HttpMethod> = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

/** Authentication type constants (typed) */
export const AUTH_TYPE: Record<string, AuthType> = {
  NONE: "none",
  BEARER: "bearer",
  BASIC: "basic",
} as const;

/** Custom API header names */
export const API_HEADER = {
  MESSAGE_SIGNATURE: "message-signature",
  TIMESTAMP: "timestamp",
  AUTHORIZATION: "authorization",
  X_API_KEY: "x-api-key",
  CLIENT_REQUEST_ID: "client-request-id",
  X_FINGERPRINT: "x-fingerprint",
  X_TENANT: "x-tenant",
} as const;

/** Server error codes for special handling */
export const ERROR_CODE = {
  SYSTEM_NOT_READY: "SYSTEM_NOT_READY",
  INVALID_SESSION: "INVALID_SESSION",
  INVALID_TOKEN: "INVALID_TOKEN",
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_SIGNATURE: "INVALID_SIGNATURE",
} as const;

/** WebSocket command types */
export const SOCKET_CMD = {
  CMD_CLIENT_PING: "CMD_CLIENT_PING",
  CMD_LOCK_DEVICE: "CMD_LOCK_DEVICE",
} as const;

/** OAuth grant types */
export const GRANT_TYPE = {
  PASSWORD: "password",
} as const;

/** localStorage key names */
export const LOCAL_STORAGE = {
  SESSION_KEY: "msa_session_key",
  ACCESS_TOKEN: "msa_access_token",
} as const;

/** User kind discriminator */
export const USER_KIND = {
  ADMIN: 1,
  USER: 2,
} as const;
