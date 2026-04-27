import pako from "pako";
import * as CryptoJS from "crypto-js";
import forge from "node-forge";

/** AES-ECB encryption with PKCS7 padding */
export const encryptAES = (
  secretKey: string,
  plainText: string,
): string | null => {
  try {
    const encrypted = CryptoJS.AES.encrypt(
      plainText,
      CryptoJS.enc.Utf8.parse(secretKey),
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 },
    );
    return encrypted.toString();
  } catch {
    return null;
  }
};

/** AES-ECB decryption with PKCS7 padding */
export const decryptAES = (
  secretKey: string,
  encryptedStr: string,
): string | null => {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      encryptedStr,
      CryptoJS.enc.Utf8.parse(secretKey),
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 },
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
};

/** Simple AES encryption (passphrase-based) */
export const encryptClient = (key: string, value: string): string => {
  return CryptoJS.AES.encrypt(value, key).toString();
};

/** Simple AES decryption (passphrase-based) */
export const decryptClient = (key: string, encryptedValue: string): string => {
  const decrypted = CryptoJS.AES.decrypt(encryptedValue, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

/** RSA decryption using PKCS1 v1.5 */
export const decryptRSA = (
  privateKeyRaw: string,
  encryptedBase64: string,
): string | null => {
  try {
    const privateKeyBytes = forge.util.decode64(privateKeyRaw);
    const privateAsn1 = forge.asn1.fromDer(
      forge.util.createBuffer(privateKeyBytes),
    );
    const privateKey = forge.pki.privateKeyFromAsn1(privateAsn1);
    const encryptedBytes = forge.util.decode64(encryptedBase64);
    const decryptedBytes = privateKey.decrypt(
      encryptedBytes,
      "RSAES-PKCS1-V1_5",
    );
    return forge.util.decodeUtf8(decryptedBytes);
  } catch {
    return null;
  }
};

/** RSA encryption using PKCS1 v1.5 */
export const encryptRSA = (
  publicKeyRawBase64: string,
  data: string,
): string | null => {
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

/** MD5 hash with zero-padding to 32 chars */
export const generateMd5 = (text: string): string => {
  return CryptoJS.MD5(CryptoJS.enc.Utf8.parse(text))
    .toString(CryptoJS.enc.Hex)
    .padStart(32, "0");
};

/** Deflate + base64 encode a string */
export const zipString = (input: string): string | null => {
  try {
    const deflated = pako.deflate(input);
    const binary = deflated.reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      "",
    );
    return btoa(binary);
  } catch {
    return null;
  }
};

/** Base64 decode + inflate a string */
export const unzipString = (input: string): string | null => {
  try {
    const binaryString = atob(input);
    const bytes = new Uint8Array(
      Array.from(binaryString).map((c) => c.charCodeAt(0)),
    );
    return pako.inflate(bytes, { to: "string" });
  } catch {
    return null;
  }
};
