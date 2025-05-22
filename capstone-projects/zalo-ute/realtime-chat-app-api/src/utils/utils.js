import CryptoJS from "crypto-js";
import "dotenv/config.js";

const encrypt = (value, secretKey) => {
  return CryptoJS.AES.encrypt(value, secretKey).toString();
};

const decrypt = (encryptedValue, secretKey) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedValue, secretKey);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("JOIN_CONVERSATION", (conversationId) => {
      socket.join(conversationId);
    });
    socket.on("LEAVE_CONVERSATION", (conversationId) => {
      socket.leave(conversationId);
    });
    socket.on("JOIN_NOTIFICATION", (userId) => {
      socket.join(userId);
    });
    socket.on("LEAVE_NOTIFICATION", (userId) => {
      socket.join(userId);
    });
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

const calculateAverageDailyCount = async (model, dateField) => {
  const results = await model.aggregate([
    {
      $match: {
        [dateField]: { $ne: null },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: `$${dateField}` },
        },
        dailyCount: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        averageDailyCount: { $avg: "$dailyCount" },
      },
    },
    {
      $project: {
        _id: 0,
        averageDailyCount: 1,
      },
    },
  ]);
  return results[0]?.averageDailyCount
    ? +results[0].averageDailyCount.toFixed(2)
    : 0;
};

export { encrypt, decrypt, setupSocketHandlers, calculateAverageDailyCount };
