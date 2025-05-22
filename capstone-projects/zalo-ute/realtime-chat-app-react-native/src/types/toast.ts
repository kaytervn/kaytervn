const successToast = (message: string) => {
  return {
    type: "success",
    text1: "Thành công 🎉",
    text2: message,
    text1Style: {
      fontSize: 16,
    },
    text2Style: {
      fontSize: 14,
    },
  };
};

const errorToast = (message: string) => {
  return {
    type: "error",
    text1: "Thất bại ⚠️",
    text2: message,
    text1Style: {
      fontSize: 16,
    },
    text2Style: {
      fontSize: 14,
    },
  };
};

const infoToast = (message: string) => {
  return {
    type: "info",
    text1: "Thông báo 📢​",
    text2: message,
    text1Style: {
      fontSize: 16,
    },
    text2Style: {
      fontSize: 14,
    },
  };
};

export { successToast, errorToast, infoToast };
