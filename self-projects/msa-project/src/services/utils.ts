/* eslint-disable @typescript-eslint/no-explicit-any */
import pako from "pako";
import * as CryptoJS from "crypto-js";
import forge from "node-forge";

export const initializeStorage = (storageKey: string, defaultValue: any) => {
  localStorage.setItem(storageKey, JSON.stringify(defaultValue));
  return defaultValue;
};

export const generateRandomString = (length: any) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    result += chars[idx];
  }
  return result;
};

export const formatJavaDate = (date = new Date()) => {
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

export const isValidURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getNestedValue = (obj: any, path: string, defaultValue = "") => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? defaultValue;
};

export const encryptClient = (key: any, value: any) => {
  return CryptoJS.AES.encrypt(value, key).toString();
};

export const decryptClient = (key: any, encryptedValue: any) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedValue, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const encryptAES = (secretKey: any, plainText: any) => {
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

export const decryptAES = (secretKey: any, encryptedStr: any) => {
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

export const decryptRSA = (privateKeyRaw: any, encryptedBase64: any) => {
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

export const encryptRSA = (publicKeyRawBase64: any, data: any) => {
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

export const generateMd5 = (text: string): string => {
  return CryptoJS.MD5(CryptoJS.enc.Utf8.parse(text))
    .toString(CryptoJS.enc.Hex)
    .padStart(32, "0");
};

export const generateTimestamp = () => {
  return Date.now().toString();
};

export const getRoles = (authorities: string[]) => {
  return authorities.map((role) => role.replace(/^ROLE_/, ""));
};

export const zipString = (input: string) => {
  try {
    const deflated = pako.deflate(input);
    const binary = deflated.reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      ""
    );
    return btoa(binary);
  } catch {
    return null;
  }
};

export const unzipString = (input: string) => {
  try {
    const binaryString = atob(input);
    const bytes = new Uint8Array(
      Array.from(binaryString).map((c) => c.charCodeAt(0))
    );
    const inflated = pako.inflate(bytes, { to: "string" });
    return inflated;
  } catch {
    return null;
  }
};

export function getAvatarInitials(fullName?: string): string {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }
  if (parts.length === 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
