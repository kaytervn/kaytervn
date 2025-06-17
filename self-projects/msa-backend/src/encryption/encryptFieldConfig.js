const ACCOUNT_ENCRYPT_FIELDS = {
  ACCOUNT: ["username", "password", "note", "ref.username", "platform.name"],
  CREATE_ACCOUNT: ["username", "password", "note"],
  UPDATE_ACCOUNT: ["username", "password", "note"],
};

const PLATFORM_ENCRYPT_FIELDS = {
  PLATFORM: ["name"],
  CREATE_PLATFORM: ["name"],
  UPDATE_PLATFORM: ["name"],
};

const LINK_GROUP_ENCRYPT_FIELDS = {
  LINK_GROUP: ["name"],
  CREATE_LINK_GROUP: ["name"],
  UPDATE_LINK_GROUP: ["name"],
};

const BACKUP_CODE_ENCRYPT_FIELDS = {
  BACKUP_CODE: ["code", "account.username"],
  CREATE_BACKUP_CODE: ["code"],
  UPDATE_BACKUP_CODE: ["code"],
};

export {
  ACCOUNT_ENCRYPT_FIELDS,
  PLATFORM_ENCRYPT_FIELDS,
  LINK_GROUP_ENCRYPT_FIELDS,
  BACKUP_CODE_ENCRYPT_FIELDS,
};
