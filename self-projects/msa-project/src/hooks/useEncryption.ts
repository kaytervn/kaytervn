/* eslint-disable react-hooks/exhaustive-deps */
import { useGlobalContext } from "../config/GlobalProvider";
import {
  decryptClientField,
  encryptClientField,
} from "../services/encryption/clientEncryption";
import {
  decryptFieldByUserKey,
  encryptFieldByUserKey,
} from "../services/encryption/sessionEncryption";
import { generateTimestamp } from "../services/utils";

const useEncryption = () => {
  const DELIM = "|";
  const { sessionKey } = useGlobalContext();

  const userEncrypt = (value: any) => {
    return encryptFieldByUserKey(sessionKey, value);
  };

  const userDecrypt = (value: any) => {
    return decryptFieldByUserKey(sessionKey, value);
  };

  const getAuthHeader = (secret: any, value: any) => {
    return encryptClientField([secret, value].join(DELIM));
  };

  const clientDecryptIgnoreNonce = (value: any) => {
    try {
      const data = decryptClientField(value);
      if (!data) {
        return null;
      }
      return data.split(DELIM)[1];
    } catch {
      return null;
    }
  };

  const clientEncryptInjectNonce = (value: any) => {
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

export default useEncryption;
