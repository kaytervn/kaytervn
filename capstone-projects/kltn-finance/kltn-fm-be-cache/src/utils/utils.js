import CryptoJS from "crypto-js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { DATE_FORMAT } from "../static/constant.js";
import crypto from "crypto";

dayjs.extend(utc);
dayjs.extend(timezone);
const algorithm = "aes-256-ctr";

const formatDateUTC = () => dayjs().utc().format(DATE_FORMAT);

const encrypt = (value, secretKey) => {
  return CryptoJS.AES.encrypt(value, secretKey).toString();
};

const decrypt = (encryptedValue, secretKey) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedValue, secretKey);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

const encryptStream = (secret) => {
  return crypto.createCipheriv(algorithm, secret, Buffer.alloc(16, 0));
};

const decryptStream = (secret) => {
  return crypto.createDecipheriv(algorithm, secret, Buffer.alloc(16, 0));
};

const getSecretKey = (secret) => {
  return crypto.createHash("sha256").update(secret).digest();
};

export {
  encrypt,
  decrypt,
  formatDateUTC,
  encryptStream,
  decryptStream,
  getSecretKey,
};
