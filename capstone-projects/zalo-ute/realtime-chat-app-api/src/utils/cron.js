import cron from "cron";
import Notification from "../models/notificationModel.js";
import dayjs from "dayjs";
import User from "../models/userModel.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import Friendship from "../models/friendshipModel.js";
import Conversation from "../models/conversationModel.js";
import Story from "../models/storyModel.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const daysToDeleteStories = 30;
const daysToDeleteNotification = 14;

const birthDateNotification = async () => {
  const today = dayjs().tz("Asia/Ho_Chi_Minh").format("DD/MM");
  const users = await User.find({
    birthDate: { $ne: null },
    $expr: {
      $eq: [
        {
          $dateToString: {
            format: "%d/%m",
            date: "$birthDate",
            timezone: "Asia/Ho_Chi_Minh",
          },
        },
        today,
      ],
    },
  });
  if (users.length > 0) {
    const userNotifications = users.map((user) => ({
      user: user._id,
      message: `Chúc mừng sinh nhật ${user.displayName}! 🎉`,
    }));
    await Notification.insertMany(userNotifications);
    let allFriendNotifications = [];
    for (const user of users) {
      const friendships = await Friendship.find({
        $or: [{ sender: user._id }, { receiver: user._id }],
        status: 2,
      });
      for (const friendship of friendships) {
        const friendId = friendship.sender.equals(user._id)
          ? friendship.receiver
          : friendship.sender;
        const conversation = await Conversation.findOne({
          friendshipId: friendship._id,
        });
        allFriendNotifications.push({
          user: friendId,
          data: {
            user: {
              _id: user._id,
            },
            friendship: {
              _id: friendship._id,
            },
            conversation: conversation ? { _id: conversation._id } : null,
          },
          message: `Hôm nay là sinh nhật của ${user.displayName}. Gửi lời chúc tốt đẹp nhé!`,
        });
      }
    }
    if (allFriendNotifications.length > 0) {
      await Notification.insertMany(allFriendNotifications);
    }
    const superAdmin = await User.findOne({ isSuperAdmin: 1 });
    if (superAdmin) {
      await Notification.create({
        user: superAdmin._id,
        message: `Hệ thống đã gửi thông báo sinh nhật cho ${users.length} người dùng!`,
      });
    }
  }
};

const deleteExpiredStories = async () => {
  const cutoffDate = new Date(
    Date.now() - daysToDeleteStories * 24 * 60 * 60 * 1000
  );
  const stories = await Story.find({
    createdAt: { $lt: cutoffDate },
  });
  for (const story of stories) {
    await story.deleteOne();
  }
  if (stories.length > 0) {
    const superAdmin = await User.findOne({ isSuperAdmin: 1 });
    if (superAdmin) {
      await Notification.create({
        user: superAdmin._id,
        message: `Hệ thống đã xóa ${stories.length} bản tin đã hết hạn ${daysToDeleteStories} ngày`,
      });
    }
  }
};

const job = new cron.CronJob("0 0 * * *", async function () {
  try {
    await birthDateNotification();
    // await deleteExpiredStories();

    // const cutoffDate = new Date(
    //   Date.now() - daysToDeleteNotification * 24 * 60 * 60 * 1000
    // );

    // const { deletedCount } = await Notification.deleteMany({
    //   createdAt: { $lt: cutoffDate },
    // });

    // const superAdmin = await User.findOne({ isSuperAdmin: 1 });
    // if (deletedCount > 0) {
    //   await Notification.create({
    //     user: superAdmin._id,
    //     message: `Hệ thống đã xóa ${deletedCount} thông báo quá hạn ${daysToDeleteNotification} ngày`,
    //   });
    // }
  } catch (error) {
    console.error("Error running cron job:", error);
  }
});

export default job;

// CRON JOB EXPLANATION:
// Cron jobs are scheduled tasks that run periodically at fixed intervals or specific times
// send 1 GET request for every 14 minutes

// Schedule:
// You define a schedule using a cron expression, which consists of five fields representing:

//! MINUTE, HOUR, DAY OF THE MONTH, MONTH, DAY OF THE WEEK

//? EXAMPLES && EXPLANATION:
//* 14 * * * * - Every 14 minutes
//* 0 0 * * 0 - At midnight on every Sunday
//* 30 3 15 * * - At 3:30 AM, on the 15th of every month
//* 0 0 1 1 * - At midnight, on January 1st
//* 0 * * * * - Every hour
