const ACCOUNT_ENCRYPT_FIELDS = {
  ACCOUNT: ["username", "password", "note"],
};

const PLATFORM_ENCRYPT_FIELDS = {
  PLATFORM: ["name"],
  CREATE_PLATFORM: ["name"],
  UPDATE_PLATFORM: ["id", "name"],
};

const LINK_GROUP_ENCRYPT_FIELDS = {
  LINK_GROUP: ["name"],
  CREATE_LINK_GROUP: ["name"],
  UPDATE_LINK_GROUP: ["id", "name"],
};

export {
  ACCOUNT_ENCRYPT_FIELDS,
  PLATFORM_ENCRYPT_FIELDS,
  LINK_GROUP_ENCRYPT_FIELDS,
};
