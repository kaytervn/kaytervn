import { getConfigValue } from "../config/appProperties.js";
import {
  decryptAES,
  decryptData,
  encryptAES,
  encryptData,
} from "../services/encryptionService.js";
import { CONFIG_KEY } from "../utils/constant.js";

const decryptEbankData = (item, fields) => {
  const secretKey = getConfigValue(CONFIG_KEY.EBANK_KEY);
  return decryptData(secretKey, item.toObject ? item.toObject() : item, fields);
};

const encryptEbankData = (item, fields) => {
  const secretKey = getConfigValue(CONFIG_KEY.EBANK_KEY);
  return encryptData(secretKey, item, fields);
};

const encryptEbankField = (value) => {
  const secretKey = getConfigValue(CONFIG_KEY.EBANK_KEY);
  return encryptAES(secretKey, value);
};

const decryptEbankField = (value) => {
  const secretKey = getConfigValue(CONFIG_KEY.EBANK_KEY);
  return decryptAES(secretKey, value);
};

const encryptEbankList = (list, fields) => {
  return list.map((item) => encryptEbankData(item, fields)) || [];
};

const decryptEbankList = (list, fields) => {
  return list.map((item) => decryptEbankData(item, fields)) || [];
};

export {
  decryptEbankData,
  encryptEbankData,
  encryptEbankField,
  decryptEbankField,
  decryptEbankList,
  encryptEbankList,
};
