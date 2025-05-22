import "dotenv/config.js";

const PhonePattern = /^0[35789][0-9]{8}$/;

const EmailPattern =
  /^(?!.*[.]{2,})[a-zA-Z0-9.%]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const StudentIdPattern = /^[1-9][0-9]{7}$/;

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const secretKey = process.env.SERVER_SECRET;

const roleKind = {
  USER: 1,
  MANAGER: 2,
  ADMIN: 3,
};

const settingKey = {
  POSTS_PER_DAY: "posts_per_day",
  STORIES_PER_DAY: "stories_per_day",
  VERIFY_PUBLIC_POSTS: "verify_public_posts",
  VERIFY_FRIEND_POSTS: "verify_friend_posts",
  MAX_FRIEND_REQUESTS: "max_friend_requests",
  MAX_CONVERSATIONS: "max_conversations",
};

const postKind = {
  PUBLIC: 1,
  FRIENDS: 2,
  PRIVATE: 3,
};

export {
  roleKind,
  PhonePattern,
  EmailPattern,
  corsOptions,
  secretKey,
  settingKey,
  postKind,
  StudentIdPattern,
};
