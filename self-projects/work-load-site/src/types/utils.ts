import * as CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import { colors, ENV, MIME_TYPES, myPublicSecretKey } from "./constant";
import gifs from "./gifs";
import SparkMD5 from "spark-md5";
import forge from "node-forge";

const getCurrentDate = () => {
  const now = new Date();
  const formatter = now
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(/\//g, "/");
  return formatter.replace(",", "");
};

const getCurrentDate_2 = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${day}${month}${year}.${hours}${minutes}${seconds}`;
};

const encrypt = (value: any, key: any = myPublicSecretKey) => {
  return CryptoJS.AES.encrypt(value, key).toString();
};

const decrypt = (encryptedValue: any, key: any = myPublicSecretKey) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedValue, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

const getRandomGif = () => {
  const randomIndex = Math.floor(Math.random() * gifs.length);
  return gifs[randomIndex];
};

const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

const initializeStorage = (storageKey: string, defaultValue: any) => {
  localStorage.setItem(storageKey, JSON.stringify(defaultValue));
  return defaultValue;
};

const findStorageItemBy = (
  storageKey: string,
  searchKey: string,
  searchValue: string
): any => {
  const data = getStorageData(storageKey);
  if (data === null) {
    return initializeStorage(storageKey, []);
  }
  return data.find(
    (item: any) =>
      String(item[searchKey]).toLowerCase() === searchValue.toLowerCase()
  );
};

const getPaginatedStorageData = (
  storageKey: string,
  page: number = 0,
  size: number = 5,
  searchKey?: string,
  searchValue?: string
): any => {
  const data = localStorage.getItem(storageKey);
  if (data === null) {
    return initializeStorage(storageKey, []);
  }
  try {
    const parsedData = JSON.parse(data);
    let filteredData = parsedData;
    if (searchKey && searchValue) {
      filteredData = parsedData.filter((item: any) =>
        String(item[searchKey])
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      );
    }
    filteredData.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    return {
      totalElements: filteredData.length,
      totalPages: Math.ceil(filteredData.length / size),
      currentPage: page,
      items: paginatedData,
    };
  } catch {
    return initializeStorage(storageKey, []);
  }
};

const getItemPage = (
  storageKey: string,
  itemId: string,
  size: number = 5
): number => {
  const data = localStorage.getItem(storageKey);
  if (!data) return -1;
  try {
    const parsedData = JSON.parse(data);
    parsedData.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const itemIndex = parsedData.findIndex((item: any) => item.id === itemId);
    if (itemIndex === -1) return -1;
    return Math.floor(itemIndex / size);
  } catch {
    return -1;
  }
};

const getStorageData = (storageKey: string): any => {
  const data = localStorage.getItem(storageKey);
  if (data === null) {
    return initializeStorage(storageKey, []);
  }
  try {
    return JSON.parse(data);
  } catch {
    return initializeStorage(storageKey, []);
  }
};

const addItemToStorage = (storageKey: string, newItem: any) => {
  const storageData = getStorageData(storageKey);
  storageData.push(newItem);
  localStorage.setItem(storageKey, JSON.stringify(storageData));
};

const updateItemInStorage = (
  storageKey: string,
  updatedFields: any,
  id: string
) => {
  const storageData = getStorageData(storageKey);
  const itemIndex = storageData.findIndex((item: any) => item.id === id);
  if (itemIndex !== -1) {
    const updatedItem = { ...storageData[itemIndex], ...updatedFields };
    storageData[itemIndex] = updatedItem;
    localStorage.setItem(storageKey, JSON.stringify(storageData));
  }
};

const overwriteItemInStorage = (storageKey: string, newItem: any) => {
  const storageData = getStorageData(storageKey);
  const itemIndex = storageData.findIndex(
    (item: any) => item.id === newItem.id
  );
  if (itemIndex !== -1) {
    storageData[itemIndex] = { ...newItem };
    localStorage.setItem(storageKey, JSON.stringify(storageData));
  }
};

const deleteItemFromStorage = (storageKey: string, id: any) => {
  const storageData = getStorageData(storageKey);
  const itemIndex = storageData.findIndex((item: any) => item.id === id);
  if (itemIndex !== -1) {
    storageData.splice(itemIndex, 1);
    localStorage.setItem(storageKey, JSON.stringify(storageData));
  }
};

const getItemById = (storageKey: string, id: string): any => {
  const storageData = getStorageData(storageKey);
  const item = storageData.find((item: any) => item.id === id);
  return item || null;
};

const generateUniqueId = () => {
  return uuidv4();
};

const parseResponseText = (text: string): string => {
  if (text.startsWith("<?xml") || text.startsWith("<")) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    return xmlDoc.getElementsByTagName("Json")[0]?.textContent ?? "";
  }
  return text;
};

const truncateString = (str: any, limit: any) => {
  if (str.length > limit) {
    return str.slice(0, limit) + "...";
  }
  return str;
};

const isValidURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const getEnumItem = (map: any, value: number) =>
  Object.values(map).find((item: any) => item.value === value) ?? {
    label: "Unknown",
    className: "bg-gray-700 text-gray-300",
  };

const getNestedValue = (obj: any, path: string, defaultValue = "") => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? defaultValue;
};

const convertAlignment = (value: any) => {
  const mapping: any = {
    left: "start",
    right: "end",
  };
  return mapping[value] || value;
};

const encryptClient = (key: any, value: any) => {
  return CryptoJS.AES.encrypt(value, key).toString();
};

const decryptClient = (key: any, encryptedValue: any) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedValue, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

const encryptAES = (secretKey: any, plainText: any) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(
      plainText,
      CryptoJS.enc.Utf8.parse(secretKey),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  } catch {
    return null;
  }
};

const decryptAES = (secretKey: any, encryptedStr: any) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      encryptedStr,
      CryptoJS.enc.Utf8.parse(secretKey),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  } catch {
    return null;
  }
};

const decryptRSA = (privateKeyRaw: any, encryptedBase64: any) => {
  try {
    const privateKeyBytes = forge.util.decode64(privateKeyRaw);
    const privateAsn1 = forge.asn1.fromDer(
      forge.util.createBuffer(privateKeyBytes)
    );
    const privateKey = forge.pki.privateKeyFromAsn1(privateAsn1);

    const encryptedBytes = forge.util.decode64(encryptedBase64);
    const decryptedBytes = privateKey.decrypt(
      encryptedBytes,
      "RSAES-PKCS1-V1_5"
    );

    return forge.util.decodeUtf8(decryptedBytes);
  } catch {
    return null;
  }
};

const encryptRSA = (publicKeyRawBase64: any, data: any) => {
  try {
    const rawBytes = forge.util.decode64(publicKeyRawBase64);
    const publicAsn1 = forge.asn1.fromDer(forge.util.createBuffer(rawBytes));
    const publicKey = forge.pki.publicKeyFromAsn1(publicAsn1);

    const encryptedBytes = publicKey.encrypt(data, "RSAES-PKCS1-V1_5");
    return forge.util.encode64(encryptedBytes);
  } catch {
    return null;
  }
};

const generateMd5 = (text: string): string => {
  return SparkMD5.hash(text);
};

const generateTimestamp = () => {
  return Date.now().toString();
};

const extractBase64FromPem = (pem: any) => {
  return pem.replace(/-----.*-----/g, "").replace(/\s+/g, "");
};

const getAuthHeader = () => {
  const clientRequestId = generateUniqueId();
  const timestamp = generateTimestamp();
  const messageSignature = generateMd5(
    ENV.CLIENT_ID + ENV.CLIENT_SECRET + timestamp + clientRequestId
  );
  return { timestamp, messageSignature, clientRequestId };
};

const getMimeType = (fileName: string) => {
  const extension = `.${fileName.split(".").pop()?.toLowerCase() || ""}`;
  return (MIME_TYPES as any)[extension] || "application/octet-stream";
};

const parseDocuments = (documentString: string) => {
  try {
    return JSON.parse(documentString);
  } catch {
    return [];
  }
};

const getMediaImage = (url: string) => {
  return `${ENV.MSA_API_URL}/v1/media/download/${url}`;
};

export {
  getRandomGif,
  getRandomColor,
  encrypt,
  decrypt,
  getStorageData,
  addItemToStorage,
  getCurrentDate,
  generateUniqueId,
  updateItemInStorage,
  deleteItemFromStorage,
  getPaginatedStorageData,
  getItemById,
  parseResponseText,
  truncateString,
  overwriteItemInStorage,
  getCurrentDate_2,
  findStorageItemBy,
  initializeStorage,
  isValidURL,
  getItemPage,
  getEnumItem,
  getNestedValue,
  convertAlignment,
  encryptClient,
  decryptClient,
  encryptAES,
  decryptAES,
  generateMd5,
  generateTimestamp,
  extractBase64FromPem,
  getAuthHeader,
  decryptRSA,
  encryptRSA,
  getMimeType,
  parseDocuments,
  getMediaImage,
};
