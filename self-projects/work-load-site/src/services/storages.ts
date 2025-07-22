/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LOCAL_STORAGE } from "../types/constant";
import {
  decryptClientField,
  encryptClientField,
} from "./encryption/clientEncryption";

const isValidJWT = (token: string) => {
  if (typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    const [header, payload, signature] = parts;

    const base64UrlPattern = /^[A-Za-z0-9_-]+$/;
    if (
      ![header, payload, signature].every((part) => base64UrlPattern.test(part))
    ) {
      return false;
    }

    const decodeBase64Url = (str: string) => {
      const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      return atob(base64);
    };

    const decodedHeader = JSON.parse(decodeBase64Url(header));
    const decodedPayload = JSON.parse(decodeBase64Url(payload));

    return (
      decodedHeader &&
      decodedHeader.alg &&
      decodedPayload &&
      typeof decodedPayload === "object"
    );
  } catch (err) {
    return false;
  }
};

const initializeStorage = (storageKey: string, defaultValue: any) => {
  const data = JSON.stringify(defaultValue);
  localStorage.setItem(storageKey, encryptClientField(data) || "");
  return defaultValue;
};

const getStorageData = (key: string, defaultValue: any = null) => {
  let data = null;
  try {
    data = decryptClientField(localStorage.getItem(key));
  } catch (ignored) {}

  if (key === LOCAL_STORAGE.ACCESS_TOKEN) {
    if (!data) {
      localStorage.removeItem(key);
      return null;
    } else {
      if (!isValidJWT(data)) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    }
  }

  if (!data) {
    return initializeStorage(key, defaultValue);
  }

  try {
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (err) {
    return initializeStorage(key, defaultValue);
  }
};

const setStorageData = (key: string, value: any) => {
  if (key === LOCAL_STORAGE.ACCESS_TOKEN) {
    localStorage.removeItem(LOCAL_STORAGE.SESSION_KEY);
    const data = encryptClientField(value) || "";
    localStorage.setItem(key, data);
  } else {
    const data = encryptClientField(JSON.stringify(value)) || "";
    localStorage.setItem(key, data);
  }
};

const removeSessionCache = () => {
  localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
  localStorage.removeItem(LOCAL_STORAGE.SESSION_KEY);
};

export { getStorageData, setStorageData, removeSessionCache, isValidJWT };
