import { formatDate } from "../configurations/schemaConfig.js";
import Conversation from "../models/conversationModel.js";
import Friendship from "../models/friendshipModel.js";
import Post from "../models/postModel.js";
import Setting from "../models/settingModel.js";
import Story from "../models/storyModel.js";
import { postKind, settingKey } from "../static/constant.js";

const formatSettingData = (setting) => {
  return {
    _id: setting._id,
    title: setting.title,
    keyName: setting.keyName,
    roleKind: setting.roleKind,
    value: setting.value,
    updatedAt: formatDate(setting.updatedAt),
  };
};

const getListSettings = async (req) => {
  const {
    title,
    roleKind,
    isPaged,
    page = 0,
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  let query = {};
  if (title) {
    query.title = { $regex: title, $options: "i" };
  }
  if (roleKind) {
    query.roleKind = Number(roleKind);
  }

  const [totalElements, settings] = await Promise.all([
    Setting.countDocuments(query),
    Setting.find(query).sort({ title: 1 }).skip(offset).limit(limit),
  ]);

  const totalPages = Math.ceil(totalElements / limit);

  const result = settings.map((setting) => {
    return formatSettingData(setting);
  });

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

const validateStoriesPerDay = async (user) => {
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const [storyCount, setting] = await Promise.all([
    Story.countDocuments({
      user: user._id,
      createdAt: { $gte: startOfDay },
    }),
    Setting.findOne({
      keyName: settingKey.STORIES_PER_DAY,
      roleKind: user.role.kind,
    }),
  ]);
  return setting && setting.value ? storyCount < setting.value : true;
};

const validatePostsPerDay = async (user) => {
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const [count, setting] = await Promise.all([
    Post.countDocuments({
      user: user._id,
      createdAt: { $gte: startOfDay },
    }),
    Setting.findOne({
      keyName: settingKey.POSTS_PER_DAY,
      roleKind: user.role.kind,
    }),
  ]);
  return setting && setting.value ? count < setting.value : true;
};

const getValidPostStatus = async (inputPostKind, roleKind) => {
  let newStatus = 1;
  let keyName;
  if (inputPostKind === postKind.PUBLIC) {
    keyName = settingKey.VERIFY_PUBLIC_POSTS;
  } else if (inputPostKind === postKind.FRIENDS) {
    keyName = settingKey.VERIFY_FRIEND_POSTS;
  } else if (inputPostKind === postKind.PRIVATE) {
    return 2;
  }
  if (keyName) {
    const setting = await Setting.findOne({ keyName, roleKind });
    if (setting && setting.value === 0) {
      newStatus = 2;
    }
  }
  return newStatus;
};

const validateMaxFriendRequests = async (user) => {
  const [count, setting] = await Promise.all([
    Friendship.countDocuments({ sender: user._id }),
    Setting.findOne({
      keyName: settingKey.MAX_FRIEND_REQUESTS,
      roleKind: user.role.kind,
    }),
  ]);
  return setting && setting.value ? count < setting.value : true;
};

const validateMaxConversations = async (user) => {
  const [count, setting] = await Promise.all([
    Conversation.countDocuments({ owner: user._id }),
    Setting.findOne({
      keyName: settingKey.MAX_CONVERSATIONS,
      roleKind: user.role.kind,
    }),
  ]);
  return setting && setting.value ? count < setting.value : true;
};

export {
  getListSettings,
  formatSettingData,
  validateStoriesPerDay,
  validatePostsPerDay,
  getValidPostStatus,
  validateMaxFriendRequests,
  validateMaxConversations,
};
