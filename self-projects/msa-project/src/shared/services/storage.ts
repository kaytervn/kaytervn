import { LOCAL_STORAGE } from "@/shared/constants";
import type { SessionData } from "@/shared/types/common.types";
import {
  decryptClientField,
  encryptClientField,
} from "./encryption/clientEncryption";
import { generateTimestamp } from "@/shared/utils/format";

const DELIM = "|";

/** Validate JWT structure (3 base64url parts with valid JSON header/payload) */
export const isValidJWT = (
  token: string | null | undefined,
): token is string => {
  if (typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    const base64UrlPattern = /^[A-Za-z0-9_-]+$/;
    if (!parts.every((part) => base64UrlPattern.test(part))) return false;

    const decodeBase64Url = (str: string): string => {
      const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      return atob(base64);
    };

    const decodedHeader = JSON.parse(decodeBase64Url(parts[0])) as Record<
      string,
      unknown
    >;
    const decodedPayload = JSON.parse(decodeBase64Url(parts[1])) as Record<
      string,
      unknown
    >;

    return !!(
      decodedHeader?.alg &&
      decodedPayload &&
      typeof decodedPayload === "object"
    );
  } catch {
    return false;
  }
};

/** Encrypt a value for localStorage (prepends timestamp nonce) */
const encryptStorage = (value: string): string => {
  if (!value) return "";
  return encryptClientField([generateTimestamp(), value].join(DELIM)) ?? "";
};

/** Decrypt a localStorage value (strips timestamp nonce) */
const decryptStorage = (key: string): string | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data = decryptClientField(raw);
    return data?.split(DELIM)[1] ?? null;
  } catch {
    return null;
  }
};

/** Initialize a localStorage key with an encrypted default value */
const initializeStorage = <T>(storageKey: string, defaultValue: T): T => {
  const data = JSON.stringify(defaultValue);
  localStorage.setItem(storageKey, encryptStorage(data));
  return defaultValue;
};

/** Read typed data from encrypted localStorage */
export function getStorageData(
  key: typeof LOCAL_STORAGE.ACCESS_TOKEN,
): string | null;
export function getStorageData<T>(key: string, defaultValue: T): T;
export function getStorageData<T>(
  key: string,
  defaultValue?: T,
): T | string | null {
  let data: string | null = null;
  try {
    data = decryptStorage(key);
  } catch {
    /* corrupted data */
  }

  // Special handling for access token: validate JWT
  if (key === LOCAL_STORAGE.ACCESS_TOKEN) {
    if (!data || !isValidJWT(data)) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  }

  if (!data) {
    return initializeStorage(key, defaultValue ?? null);
  }

  try {
    return JSON.parse(data) as T;
  } catch {
    return initializeStorage(key, defaultValue ?? null);
  }
}

/** Write typed data to encrypted localStorage */
export const setStorageData = (key: string, value: unknown): void => {
  if (key === LOCAL_STORAGE.ACCESS_TOKEN) {
    localStorage.removeItem(LOCAL_STORAGE.SESSION_KEY);
    localStorage.setItem(key, encryptStorage(value as string));
  } else {
    localStorage.setItem(key, encryptStorage(JSON.stringify(value)));
  }
};

/** Read session key data from storage (returns null if expired) */
export const getSessionFromStorage = (): SessionData | null => {
  const stored = getStorageData<SessionData | null>(
    LOCAL_STORAGE.SESSION_KEY,
    null,
  );
  if (!stored) return null;
  if (Date.now() >= stored.expirationTime) {
    localStorage.removeItem(LOCAL_STORAGE.SESSION_KEY);
    return null;
  }
  return stored;
};

/** Clear all session-related storage */
export const removeSessionCache = (): void => {
  localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
  localStorage.removeItem(LOCAL_STORAGE.SESSION_KEY);
};
