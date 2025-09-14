import { decryptAES, encryptAES } from "../utils";

const decryptData = (secretKey: any, item: any, fields: any) => {
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
      current[finalKey] = decryptAES(secretKey, current[finalKey]);
    }
  });

  return decryptedItem;
};

const encryptData = (secretKey: any, item: any, fields: any) => {
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
      current[finalKey] = encryptAES(secretKey, current[finalKey]);
    }
  });

  return encryptedItem;
};

const encryptFieldByUserKey = (sessionKey: any, value: any) => {
  return encryptAES(sessionKey, value);
};

const decryptFieldByUserKey = (sessionKey: any, value: any) => {
  return decryptAES(sessionKey, value);
};

const encryptDataByUserKey = (sessionKey: any, item: any, fields: any) => {
  return encryptData(sessionKey, item, fields);
};

const decryptDataByUserKey = (sessionKey: any, item: any, fields: any) => {
  return decryptData(sessionKey, item, fields);
};

const encryptListByUserKey = (sessionKey: any, list: any, fields: any) => {
  return (
    list.map((item: any) => encryptDataByUserKey(sessionKey, item, fields)) ||
    []
  );
};

const decryptListByUserKey = (sessionKey: any, list: any, fields: any) => {
  return (
    list.map((item: any) => decryptDataByUserKey(sessionKey, item, fields)) ||
    []
  );
};

export {
  decryptFieldByUserKey,
  decryptDataByUserKey,
  encryptFieldByUserKey,
  encryptDataByUserKey,
  decryptListByUserKey,
  encryptListByUserKey,
  encryptData,
  decryptData,
};
