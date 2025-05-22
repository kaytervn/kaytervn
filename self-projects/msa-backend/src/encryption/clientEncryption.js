import { getConfigValue } from "../config/appProperties.js";
import { decrypt, encrypt } from "../services/encryptionService.js";
import { generateMd5 } from "../services/generateService.js";
import { CONFIG_KEY } from "../utils/constant.js";

const getClientSecretKey = () => {
  const clientId = getConfigValue(CONFIG_KEY.CLIENT_ID);
  const clientSecret = getConfigValue(CONFIG_KEY.CLIENT_SECRET);
  return generateMd5(`${clientId}:${clientSecret}`);
};

const decryptClientData = (item, fields) => {
  const decryptedItem = { ...item };

  fields.forEach((field) => {
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
      current[finalKey] = decrypt(getClientSecretKey(), current[finalKey]);
    }
  });

  return decryptedItem;
};

const encryptClientData = (item, fields) => {
  const encryptedItem = { ...item };

  fields.forEach((field) => {
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
      current[finalKey] = encrypt(getClientSecretKey(), current[finalKey]);
    }
  });

  return encryptedItem;
};

const encryptClientField = (value) => {
  return encrypt(getClientSecretKey(), value);
};

const decryptClientField = (value) => {
  return decrypt(getClientSecretKey(), value);
};

const encryptClientList = (list, fields) => {
  return list.map((item) => encryptClientData(item, fields)) || [];
};

const decryptClientList = (list, fields) => {
  return list.map((item) => decryptClientData(item, fields)) || [];
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
