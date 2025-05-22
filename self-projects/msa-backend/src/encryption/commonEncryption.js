import { getConfigValue } from "../config/appProperties.js";
import {
  decryptAES,
  decryptData,
  encryptAES,
  encryptData,
} from "../services/encryptionService.js";
import { CONFIG_KEY } from "../utils/constant.js";

const decryptCommonData = (item, fields) => {
  const secretKey = getConfigValue(CONFIG_KEY.COMMON_KEY);
  return decryptData(secretKey, item.toObject ? item.toObject() : item, fields);
};

const encryptCommonData = (item, fields) => {
  const secretKey = getConfigValue(CONFIG_KEY.COMMON_KEY);
  return encryptData(secretKey, item, fields);
};

const encryptCommonField = (value) => {
  const secretKey = getConfigValue(CONFIG_KEY.COMMON_KEY);
  return encryptAES(secretKey, value);
};

const decryptCommonField = (value) => {
  const secretKey = getConfigValue(CONFIG_KEY.COMMON_KEY);
  return decryptAES(secretKey, value);
};

const encryptCommonList = (list, fields) => {
  return list.map((item) => encryptCommonData(item, fields)) || [];
};

const decryptCommonList = (list, fields) => {
  return list.map((item) => decryptCommonData(item, fields)) || [];
};

export {
  decryptCommonData,
  encryptCommonData,
  encryptCommonField,
  decryptCommonField,
  decryptCommonList,
  encryptCommonList,
};
