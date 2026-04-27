import { encryptAES, decryptAES } from "@/shared/utils/crypto";

/** Encrypt a single value with the user's session key */
export const encryptFieldByUserKey = (
  sessionKey: string,
  value: string,
): string | null => {
  return encryptAES(sessionKey, value);
};

/** Decrypt a single value with the user's session key */
export const decryptFieldByUserKey = (
  sessionKey: string,
  value: string,
): string | null => {
  return decryptAES(sessionKey, value);
};

/** Decrypt specific dot-path fields in an object using session key */
export const decryptDataByUserKey = <T extends Record<string, unknown>>(
  sessionKey: string,
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
      current[finalKey] = decryptAES(sessionKey, current[finalKey] as string);
    }
  });

  return decryptedItem;
};

/** Encrypt specific dot-path fields in an object using session key */
export const encryptDataByUserKey = <T extends Record<string, unknown>>(
  sessionKey: string,
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
      current[finalKey] = encryptAES(sessionKey, current[finalKey] as string);
    }
  });

  return encryptedItem;
};

/** Decrypt fields across a list using session key */
export const decryptListByUserKey = <T extends Record<string, unknown>>(
  sessionKey: string,
  list: T[],
  fields: string[],
): T[] => list.map((item) => decryptDataByUserKey(sessionKey, item, fields));

/** Encrypt fields across a list using session key */
export const encryptListByUserKey = <T extends Record<string, unknown>>(
  sessionKey: string,
  list: T[],
  fields: string[],
): T[] => list.map((item) => encryptDataByUserKey(sessionKey, item, fields));
