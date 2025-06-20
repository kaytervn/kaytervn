import {
  decryptAES,
  decryptData,
  encryptAES,
  encryptData,
} from "../services/encryptionService.js";
import { decryptCommonData, decryptCommonField } from "./commonEncryption.js";
import { decryptEbankData } from "./ebankEncryption.js";

const getUserKey = (token) => {
  const { secretKey } = token;
  return decryptCommonField(secretKey);
};

const encryptFieldByUserKey = (token, value) => {
  const secretKey = getUserKey(token);
  return encryptAES(secretKey, value);
};

const decryptFieldByUserKey = (token, value) => {
  const secretKey = getUserKey(token);
  return decryptAES(secretKey, value);
};

const encryptDataByUserKey = (token, item, fields) => {
  const secretKey = getUserKey(token);
  return encryptData(secretKey, item, fields);
};

const decryptDataByUserKey = (token, item, fields) => {
  const secretKey = getUserKey(token);
  return decryptData(secretKey, item, fields);
};

const encryptListByUserKey = (token, list, fields) => {
  return list.map((item) => encryptDataByUserKey(token, item, fields)) || [];
};

const decryptListByUserKey = (token, list, fields) => {
  return list.map((item) => decryptDataByUserKey(token, item, fields)) || [];
};

const decryptAndEncryptDataByUserKey = (token, item, fields) => {
  return encryptDataByUserKey(token, decryptCommonData(item, fields), fields);
};

const decryptAndEncryptListByUserKey = (token, list, fields) => {
  return (
    list.map((item) => decryptAndEncryptDataByUserKey(token, item, fields)) ||
    []
  );
};

const decryptAndEncryptDataByUserKeyForEbank = (token, item, fields) => {
  return encryptDataByUserKey(token, decryptEbankData(item, fields), fields);
};

const decryptAndEncryptListByUserKeyForEbank = (token, list, fields) => {
  return (
    list.map((item) =>
      decryptAndEncryptDataByUserKeyForEbank(token, item, fields)
    ) || []
  );
};

export {
  getUserKey,
  decryptFieldByUserKey,
  decryptDataByUserKey,
  encryptFieldByUserKey,
  encryptDataByUserKey,
  decryptListByUserKey,
  encryptListByUserKey,
  decryptAndEncryptListByUserKey,
  decryptAndEncryptDataByUserKey,
  decryptAndEncryptDataByUserKeyForEbank,
  decryptAndEncryptListByUserKeyForEbank,
};
