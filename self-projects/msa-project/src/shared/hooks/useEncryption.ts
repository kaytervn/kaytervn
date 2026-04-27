import { useSessionStore } from "@/shared/stores/useSessionStore";
import {
  decryptClientField,
  encryptClientField,
} from "@/shared/services/encryption/clientEncryption";
import {
  decryptFieldByUserKey,
  encryptFieldByUserKey,
} from "@/shared/services/encryption/sessionEncryption";
import { generateTimestamp } from "@/shared/utils/format";

const DELIM = "|";

export const useEncryption = () => {
  const sessionKey = useSessionStore((s) => s.sessionKey);

  const userEncrypt = (value: string | number | boolean): string | null => {
    if (!sessionKey) return null;
    return encryptFieldByUserKey(sessionKey, String(value));
  };

  const userDecrypt = (value: string): string | null => {
    if (!sessionKey) return null;
    return decryptFieldByUserKey(sessionKey, value);
  };

  const getAuthHeader = (secret: string, value: string): string => {
    return encryptClientField([secret, value].join(DELIM)) || "";
  };

  const clientDecryptIgnoreNonce = (value: string): string | null => {
    try {
      const data = decryptClientField(value);
      if (!data) return null;
      return data.split(DELIM)[1] ?? null;
    } catch {
      return null;
    }
  };

  const clientEncryptInjectNonce = (value: string): string | null => {
    try {
      const nonce = generateTimestamp();
      return encryptClientField([nonce, value].join(DELIM));
    } catch {
      return null;
    }
  };

  return {
    userEncrypt,
    userDecrypt,
    getAuthHeader,
    clientDecryptIgnoreNonce,
    clientEncryptInjectNonce,
  };
};
