import * as CryptoJS from "crypto-js";
import { ENV } from "../constant";
import { decryptAES, encryptAES } from "../utils";

const getClientSecretKey = () => {
  return ENV.MSA_CLIENT_KEY;
};

const encryptBasic = (key: any, value: any) => {
  return CryptoJS.AES.encrypt(value, key).toString();
};

const decryptBasic = (key: any, encryptedValue: any) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedValue, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

const decryptClientData = (item: any, fields: any) => {
  const decryptedItem = { ...item };

  fields.forEach((field: any) => {
    const keys = field.split(".");
    let current = decryptedItem;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    }

    const finalKey = keys[keys.length - 1];
    if (current[finalKey]) {
      current[finalKey] = decryptAES(getClientSecretKey(), current[finalKey]);
    }
  });

  return decryptedItem;
};

const encryptClientData = (item: any, fields: any) => {
  const encryptedItem = { ...item };

  fields.forEach((field: any) => {
    const keys = field.split(".");
    let current = encryptedItem;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    }

    const finalKey = keys[keys.length - 1];
    if (current[finalKey]) {
      current[finalKey] = encryptAES(getClientSecretKey(), current[finalKey]);
    }
  });

  return encryptedItem;
};

const encryptClientField = (value: any) => {
  return encryptAES(getClientSecretKey(), value);
};

const decryptClientField = (value: any) => {
  return decryptAES(getClientSecretKey(), value);
};

const encryptClientList = (list: any, fields: any) => {
  return list.map((item: any) => encryptClientData(item, fields)) || [];
};

const decryptClientList = (list: any, fields: any) => {
  return list.map((item: any) => decryptClientData(item, fields)) || [];
};

export {
  decryptClientData,
  encryptClientData,
  encryptClientField,
  decryptClientField,
  decryptClientList,
  encryptClientList,
  getClientSecretKey,
  encryptBasic,
  decryptBasic,
};
