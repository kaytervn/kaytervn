import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
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

const uploadImage = async (
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

const isAdminRole = (roleName: string) => {
  return (
    roleName?.toLowerCase().includes("admin") ||
    roleName?.toLowerCase().includes("quản trị")
  );
};

const getRandomColor = () => {
  const colors = [
    "bg-red-500",
    "bg-red-600",
    "bg-red-700",
    "bg-blue-500",
    "bg-blue-600",
    "bg-blue-700",
    "bg-green-500",
    "bg-green-600",
    "bg-green-700",
    "bg-yellow-500",
    "bg-yellow-600",
    "bg-yellow-700",
    "bg-purple-500",
    "bg-purple-600",
    "bg-purple-700",
    "bg-pink-500",
    "bg-pink-600",
    "bg-pink-700",
    "bg-orange-500",
    "bg-orange-600",
    "bg-orange-700",
    "bg-teal-500",
    "bg-teal-600",
    "bg-teal-700",
    "bg-indigo-500",
    "bg-indigo-600",
    "bg-indigo-700",
    "bg-lime-500",
    "bg-lime-600",
    "bg-lime-700",
    "bg-cyan-500",
    "bg-cyan-600",
    "bg-cyan-700",
    "bg-rose-500",
    "bg-rose-600",
    "bg-rose-700",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export {
  dateToString,
  stringToDate,
  uploadImage,
  getDate,
  isAdminRole,
  getRandomColor,
};
