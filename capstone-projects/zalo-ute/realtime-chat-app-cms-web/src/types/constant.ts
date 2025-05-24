const EmailPattern =
  /^(?!.*[.]{2,})[a-zA-Z0-9.%]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const PhonePattern = /^0[35789][0-9]{8}$/;

const StudentIdPattern = /^[1-9][0-9]{7}$/;

const settingKey = {
  POSTS_PER_DAY: "posts_per_day",
  STORIES_PER_DAY: "stories_per_day",
  VERIFY_PUBLIC_POSTS: "verify_public_posts",
  VERIFY_FRIEND_POSTS: "verify_friend_posts",
  MAX_FRIEND_REQUESTS: "max_friend_requests",
  MAX_CONVERSATIONS: "max_conversations",
};

const remoteUrl = "https://zalo-ute-api.onrender.com";

export { EmailPattern, settingKey, PhonePattern, remoteUrl, StudentIdPattern };
