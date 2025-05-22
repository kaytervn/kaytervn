import { ENV } from "../../types/constant";
import { generateMd5 } from "../../types/utils";
import * as CryptoJS from "crypto-js";

const getClientSecretKey = () => {
  try {
    return generateMd5(`${ENV.CLIENT_ID}:${ENV.CLIENT_SECRET}`);
  } catch {
    return null;
  }
};

const encryptClient = (key: any, value: any) => {
  return CryptoJS.AES.encrypt(value, key).toString();
};

const decryptClient = (key: any, encryptedValue: any) => {
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
      current[finalKey] = decryptClient(
        getClientSecretKey(),
        current[finalKey]
      );
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
      current[finalKey] = encryptClient(
        getClientSecretKey(),
        current[finalKey]
      );
    }
  });

  return encryptedItem;
};

const encryptClientField = (value: any) => {
  return encryptClient(getClientSecretKey(), value);
};

const decryptClientField = (value: any) => {
  return decryptClient(getClientSecretKey(), value);
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
};
