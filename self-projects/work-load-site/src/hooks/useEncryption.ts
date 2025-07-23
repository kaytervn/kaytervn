/* eslint-disable react-hooks/exhaustive-deps */
import { useGlobalContext } from "../components/config/GlobalProvider";
import { encryptClientField } from "../services/encryption/clientEncryption";
import {
  decryptFieldByUserKey,
  encryptFieldByUserKey,
} from "../services/encryption/sessionEncryption";

const useEncryption = () => {
  const { sessionKey } = useGlobalContext();

  const userEncrypt = (value: any) => {
    return encryptFieldByUserKey(sessionKey, value);
  };

  const userDecrypt = (value: any) => {
    return decryptFieldByUserKey(sessionKey, value);
  };

  const getAuthHeader = (secret: any, value: any) => {
    return encryptClientField([secret, value].join("|"));
  };

  return {
    userEncrypt,
    userDecrypt,
    getAuthHeader,
  };
};

export default useEncryption;
