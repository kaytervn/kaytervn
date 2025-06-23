import { ENV, LOCAL_STORAGE } from "./constant";
import { decrypt, encrypt } from "./utils";

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
  localStorage.setItem(storageKey, encrypt(data, ENV.STORAGE_KEY));
  return defaultValue;
};

const getStorageData = (key: string, defaultValue: any = null) => {
  let data = null;
  try {
    data = decrypt(localStorage.getItem(key), ENV.STORAGE_KEY);
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
    const data = encrypt(value, ENV.STORAGE_KEY);
    localStorage.setItem(key, data);
  } else {
    const data = encrypt(JSON.stringify(value), ENV.STORAGE_KEY);
    localStorage.setItem(key, data);
  }
};

const removeSessionCache = () => {
  localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
};

export { getStorageData, setStorageData, removeSessionCache };
