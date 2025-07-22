/* eslint-disable react-hooks/exhaustive-deps */
import { useGlobalContext } from "../components/config/GlobalProvider";
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

  return {
    userEncrypt,
    userDecrypt,
  };
};

export default useEncryption;
