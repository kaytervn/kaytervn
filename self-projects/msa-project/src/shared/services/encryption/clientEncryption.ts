import { ENV } from "@/shared/types/env.types";
import { encryptAES, decryptAES } from "@/shared/utils/crypto";

const getClientSecretKey = (): string => ENV.CLIENT_KEY;

/** Encrypt a single field value with the client key */
export const encryptClientField = (value: string): string | null => {
  return encryptAES(getClientSecretKey(), value);
};

/** Decrypt a single field value with the client key */
export const decryptClientField = (
  value: string | null | undefined,
): string | null => {
  if (!value) return null;
  return decryptAES(getClientSecretKey(), value);
};

/** Decrypt specific dot-path fields in an object */
export const decryptClientData = <T extends Record<string, unknown>>(
  item: T,
  fields: string[],
): T => {
  const decryptedItem = { ...item };

  fields.forEach((field) => {
    const keys = field.split(".");
    let current: Record<string, unknown> = decryptedItem as Record<
      string,
      unknown
    >;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }

    const finalKey = keys[keys.length - 1];
    if (current[finalKey] && typeof current[finalKey] === "string") {
      current[finalKey] = decryptAES(
        getClientSecretKey(),
        current[finalKey] as string,
      );
    }
  });

  return decryptedItem;
};

/** Encrypt specific dot-path fields in an object */
export const encryptClientData = <T extends Record<string, unknown>>(
  item: T,
  fields: string[],
): T => {
  const encryptedItem = { ...item };

  fields.forEach((field) => {
    const keys = field.split(".");
    let current: Record<string, unknown> = encryptedItem as Record<
      string,
      unknown
    >;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }

    const finalKey = keys[keys.length - 1];
    if (current[finalKey] && typeof current[finalKey] === "string") {
      current[finalKey] = encryptAES(
        getClientSecretKey(),
        current[finalKey] as string,
      );
    }
  });

  return encryptedItem;
};

/** Encrypt fields across a list of objects */
export const encryptClientList = <T extends Record<string, unknown>>(
  list: T[],
  fields: string[],
): T[] => list.map((item) => encryptClientData(item, fields));

/** Decrypt fields across a list of objects */
export const decryptClientList = <T extends Record<string, unknown>>(
  list: T[],
  fields: string[],
): T[] => list.map((item) => decryptClientData(item, fields));

export { getClientSecretKey };
