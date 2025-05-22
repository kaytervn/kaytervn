import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import CryptoJS from 'react-native-crypto-js';
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
  image: string | null,
  post: (url: string, data: any) => Promise<any>
) => {
  if (image) {
    const formData = new FormData();
    formData.append("file", {
      uri: image,
      type: "image/jpeg",
      name: "profile_picture.jpg",
    } as any);
    const uploadResponse = await post("/v1/file/upload", formData);
    if (uploadResponse.result) {
      return uploadResponse.data.filePath;
    }
  }
  return null;
};

const getStatusIcon = (value: number) => {
  switch (value) {
    case 1: return "globe-outline";
    case 2: return "people-outline";
    case 3: return "lock-closed-outline";
    default: return "ellipsis-horizontal";
  }
};

const encrypt = (value : any, secretKey : any) => {
  return CryptoJS.AES.encrypt(value, secretKey).toString();
};

const decrypt = (encryptedValue : any, secretKey: any) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedValue, secretKey);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export { dateToString, stringToDate, uploadImage, getDate, getStatusIcon, encrypt, decrypt };
