import * as CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import {
  colors,
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  ENV,
  MIME_TYPES,
  myPublicSecretKey,
  SCHEDULE_KIND_MAP,
  TIMEZONE_VIETNAM,
  VALID_PATTERN,
} from "./constant";
import gifs from "./gifs";
import forge from "node-forge";
import Fuse from "fuse.js";
import pako from "pako";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

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

const generateRandomString = (length: any) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    result += chars[idx];
  }
  return result;
};

const formatJavaDate = (date = new Date()) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = days[date.getUTCDay()];
  const month = months[date.getUTCMonth()];
  const dayOfMonth = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day} ${month} ${dayOfMonth} ${hours}:${minutes}:${seconds} UTC ${year}`;
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
    label: "None",
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
  return CryptoJS.MD5(CryptoJS.enc.Utf8.parse(text))
    .toString(CryptoJS.enc.Hex)
    .padStart(32, "0");
};

const generateTimestamp = () => {
  return Date.now().toString();
};

const extractBase64FromPem = (pem: any) => {
  return pem.replace(/-----.*-----/g, "").replace(/\s+/g, "");
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
  return `${ENV.MSA_NODEJS_API_URL}/v1/media/download/${url}`;
};

const normalizeVietnamese = (str: any) => {
  if (!str || typeof str !== "string") return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/\s+/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toLowerCase();
};

const deepGet = (obj: any, path: string): any => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

function createFuse<T>(
  allData: T[],
  keys: string[],
  options: Partial<any> = {}
): (query: string) => T[] {
  const fuse = new Fuse(allData, {
    keys,
    threshold: 0.4,
    distance: 100,
    minMatchCharLength: 2,
    ignoreLocation: true,
    useExtendedSearch: true,
    isCaseSensitive: false,
    includeScore: false,
    getFn: (obj, path) => {
      if (typeof path !== "string") return null;
      const value = deepGet(obj, path);
      return typeof value === "string" ? normalizeVietnamese(value) : value;
    },
    ...options,
  });

  return (query: string): T[] => {
    if (!query || query.trim() === "") return allData;
    const normalizedQuery = normalizeVietnamese(query);
    return fuse.search(normalizedQuery).map((res) => res.item);
  };
}

const isValidObjectId = (id: any): boolean => {
  if (!id) {
    return false;
  }
  try {
    return /^[a-fA-F0-9]{24}$/.test(id);
  } catch {
    return false;
  }
};

const zipString = (input: any) => {
  try {
    const deflated = pako.deflate(input);
    return btoa(String.fromCharCode(...deflated));
  } catch {
    return null;
  }
};

const unzipString = (input: any) => {
  try {
    const binaryString = atob(input);
    const bytes = new Uint8Array([...binaryString].map((c) => c.charCodeAt(0)));
    const inflated = pako.inflate(bytes, { to: "string" });
    return inflated;
  } catch {
    return null;
  }
};

const convertUtcToVn = (date: string) => {
  try {
    const [datePart, timePart] = date.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);

    const utcDate = new Date(
      Date.UTC(year, month - 1, day, hour, minute, second)
    );
    const vnDate = new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(utcDate);

    const getPart = (type: string) =>
      vnDate.find((p) => p.type === type)?.value || "00";
    return `${getPart("day")}/${getPart("month")}/${getPart("year")} ${getPart(
      "hour"
    )}:${getPart("minute")}:${getPart("second")}`;
  } catch {
    return null;
  }
};

const getRoles = (authorities: string[]) => {
  return authorities.map((role) => role.replace(/^ROLE_/, ""));
};

// yyyy-mm-dd to dd/mm/yyyy hh:mm:ss
const formatToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const [datePart, timePart] = dateString.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);

    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) {
      return "";
    }

    const formattedDate = `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;

    if (timePart) {
      const [hours, minutes, seconds] = timePart.split(":").map(Number);
      if (
        hours >= 0 &&
        hours <= 23 &&
        minutes >= 0 &&
        minutes <= 59 &&
        seconds >= 0 &&
        seconds <= 59
      ) {
        return `${formattedDate} ${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }
      return "";
    }

    return `${formattedDate} 00:00:00`;
  } catch {
    return "";
  }
};

// dd/mm/yyyy hh:mm:ss to yyyy-mm-dd
const parseToYYYYMMDD = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);

    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) {
      return "";
    }

    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    if (timePart) {
      const [hours, minutes, seconds] = timePart.split(":").map(Number);
      if (
        hours >= 0 &&
        hours <= 23 &&
        minutes >= 0 &&
        minutes <= 59 &&
        seconds >= 0 &&
        seconds <= 59
      ) {
        return `${formattedDate} ${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }
    }
    return formattedDate;
  } catch {
    return "";
  }
};

// Function to parse dd/mm/yyyy hh:mm:ss format to Date object
const parseDate = (dateStr: any) => {
  try {
    const [datePart, timePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    // Validate ranges
    if (
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12 ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59 ||
      seconds < 0 ||
      seconds > 59
    ) {
      return null;
    }

    return new Date(year, month - 1, day, hours, minutes, seconds);
  } catch {
    return null;
  }
};

const truncateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const [datePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) {
      return "";
    }
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  } catch {
    return "";
  }
};

export const validateCheckedDate = (
  value: string | undefined,
  kind: number
): string | null => {
  if (!value || !kind) {
    return null;
  }
  let date: dayjs.Dayjs | null = null;
  if (
    [
      SCHEDULE_KIND_MAP.DAYS.value,
      SCHEDULE_KIND_MAP.MONTHS.value,
      SCHEDULE_KIND_MAP.EXACT_DATE.value,
    ].includes(kind)
  ) {
    if (!VALID_PATTERN.DATE.test(value)) {
      return "Invalid Format (dd/MM/yyyy)";
    }
    date = dayjs(value, DATE_FORMAT, true).tz(TIMEZONE_VIETNAM);
  } else if (kind == SCHEDULE_KIND_MAP.DAY_MONTH.value) {
    const defaultLeapYear = 2024;
    if (!VALID_PATTERN.DAY_MONTH.test(value)) {
      return "Invalid Format (dd/MM)";
    }
    date = dayjs(`${value}/${defaultLeapYear}`, DATE_FORMAT, true).tz(
      TIMEZONE_VIETNAM
    );
  }
  return date && date.isValid() ? null : "Invalid Date";
};

export const calculateDueDate = (
  checkedDateStr: string,
  timeStr: string,
  kind: number,
  amount: number
): string => {
  const error = "Invalid Date";
  try {
    if (
      !VALID_PATTERN.TIME.test(timeStr) ||
      !checkedDateStr ||
      !kind ||
      ([SCHEDULE_KIND_MAP.DAYS.value, SCHEDULE_KIND_MAP.MONTHS.value].includes(
        kind
      ) &&
        (!amount || amount < 0))
    ) {
      return error;
    }
    const now = dayjs().tz(TIMEZONE_VIETNAM);
    const today = now.startOf("day");
    const time = dayjs(timeStr, "HH:mm", true);
    if (!time.isValid()) return error;
    if (
      [
        SCHEDULE_KIND_MAP.DAYS.value,
        SCHEDULE_KIND_MAP.MONTHS.value,
        SCHEDULE_KIND_MAP.EXACT_DATE.value,
      ].includes(kind)
    ) {
      const startDate = dayjs(checkedDateStr, DATE_FORMAT, true);
      if (!startDate.isValid()) return error;

      let nextDate = startDate;
      if (kind === SCHEDULE_KIND_MAP.DAYS.value) {
        while (!nextDate.isAfter(today)) {
          nextDate = nextDate.add(amount, "day");
        }
      } else if (kind === SCHEDULE_KIND_MAP.MONTHS.value) {
        while (!nextDate.isAfter(today)) {
          nextDate = nextDate.add(amount, "month");
        }
      } else {
        const scheduledDateTime = startDate
          .set("hour", time.hour())
          .set("minute", time.minute())
          .set("second", 0);
        return scheduledDateTime.isValid()
          ? scheduledDateTime.format(DATE_TIME_FORMAT)
          : error;
      }
      const scheduledDateTime = nextDate
        .set("hour", time.hour())
        .set("minute", time.minute())
        .set("second", 0);
      return scheduledDateTime.format(DATE_TIME_FORMAT);
    }

    if (kind === SCHEDULE_KIND_MAP.DAY_MONTH.value) {
      const [day, month] = checkedDateStr.split("/").map(Number);
      let nextDate = today;
      for (let i = 0; i <= 365; i++) {
        if (nextDate.date() === day && nextDate.month() + 1 === month) {
          const scheduledDateTime = nextDate
            .set("hour", time.hour())
            .set("minute", time.minute())
            .set("second", 0);
          if (scheduledDateTime.isAfter(now)) {
            return scheduledDateTime.format(DATE_TIME_FORMAT);
          } else {
            const nextYearDate = nextDate.add(1, "year");
            const nextYearDateTime = nextYearDate
              .set("hour", time.hour())
              .set("minute", time.minute())
              .set("second", 0);
            return nextYearDateTime.format(DATE_TIME_FORMAT);
          }
        }
        nextDate = nextDate.add(1, "day");
      }
    }
    return error;
  } catch {
    return error;
  }
};

export {
  getRoles,
  truncateToDDMMYYYY,
  formatToDDMMYYYY,
  zipString,
  unzipString,
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
  decryptRSA,
  encryptRSA,
  getMimeType,
  parseDocuments,
  getMediaImage,
  normalizeVietnamese,
  createFuse,
  isValidObjectId,
  generateRandomString,
  formatJavaDate,
  convertUtcToVn,
  parseToYYYYMMDD,
  parseDate,
};
