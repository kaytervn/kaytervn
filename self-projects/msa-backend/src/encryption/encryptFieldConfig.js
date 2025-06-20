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

const BANK_ENCRYPT_FIELDS = {
  BANK: ["name", "username", "password"],
  CREATE_BANK: ["name", "username", "password"],
  UPDATE_BANK: ["name", "username", "password"],
};

const BANK_NUMBER_ENCRYPT_FIELDS = {
  BANK_NUMBER: ["name", "number"],
  CREATE_BANK_NUMBER: ["name", "number"],
  UPDATE_BANK_NUMBER: ["name", "number"],
};

const ID_NUMBER_ENCRYPT_FIELDS = {
  ID_NUMBER: ["name", "code", "note"],
  CREATE_ID_NUMBER: ["name", "code", "note"],
  UPDATE_ID_NUMBER: ["name", "code", "note"],
};

const LINK_ENCRYPT_FIELDS = {
  LINK: ["name", "link", "note"],
  CREATE_LINK: ["name", "link", "note"],
  UPDATE_LINK: ["name", "link", "note"],
};

export {
  ACCOUNT_ENCRYPT_FIELDS,
  PLATFORM_ENCRYPT_FIELDS,
  LINK_GROUP_ENCRYPT_FIELDS,
  BACKUP_CODE_ENCRYPT_FIELDS,
  BANK_ENCRYPT_FIELDS,
  BANK_NUMBER_ENCRYPT_FIELDS,
  ID_NUMBER_ENCRYPT_FIELDS,
  LINK_ENCRYPT_FIELDS,
};
