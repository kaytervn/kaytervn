import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import * as CryptoJS from "crypto-js";
dayjs.extend(customParseFormat);

const dateToString = (val: any) => {
  return val ? dayjs(val).format("DD/MM/YYYY") : null;
};

const stringToDate = (val: any) => {
  return val ? dayjs(val, "DD/MM/YYYY").toDate() : null;
};

const getDate = (inputString: any) => {
  return inputString.slice(0, 10);
};

const uploadImage = async (
  image: File | null,
  post: (url: string, data: any) => Promise<any>
) => {
  if (image) {
    const formData = new FormData();
    formData.append("file", image, image.name);

    try {
      const uploadResponse = await post("/v1/file/upload", formData);
      if (uploadResponse.result) {
        return uploadResponse.data.filePath;
      }
    } catch (error) {
      console.error("Lỗi khi tải lên hình ảnh:", error);
    }
  }
  return null;
};
const base64ToBlob = (base64: string, type = "image/jpeg") => {
  const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;
  const byteString = atob(base64Data);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type });
};

const uploadImage2 = async (
  image: string | null,
  post: (url: string, data: any) => Promise<any>
) => {
  if (image) {
    const imageBlob = base64ToBlob(image);
    const formData = new FormData();
    formData.append("file", imageBlob, "profile_picture.jpg");
    const uploadResponse = await post("/v1/file/upload", formData);
    if (uploadResponse.result) {
      return uploadResponse.data.filePath;
    }
  }
  return null;
};

const encrypt = (value: any, secretKey: any) => {
  return CryptoJS.AES.encrypt(value, secretKey).toString();
};

// const decrypt = (encryptedValue: any, secretKey: any) => {
//   const decrypted = CryptoJS.AES.decrypt(encryptedValue, secretKey);
//   return decrypted.toString(CryptoJS.enc.Utf8);
// };
const decrypt = (encryptedValue: any, secretKey: any) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedValue, secretKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Error decrypting message:", error);
    return "";
  }
};

export {
  dateToString,
  stringToDate,
  uploadImage,
  uploadImage2,
  getDate,
  encrypt,
  decrypt,
};
