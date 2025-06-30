import Config from "../models/configModel.js";
import { CONFIG_KEY, CONFIG_KIND, ENV } from "../utils/constant.js";
import { LRUCache } from "lru-cache";
import dbConfig from "./dbConfig.js";
import { decryptRSA } from "../services/encryptionService.js";

let APP_PROPERTIES = null;
let LRU_CACHE = null;

const getAppProperties = () => APP_PROPERTIES;
const getLruCache = () => LRU_CACHE;

const getConfigValue = (key) => {
  if (!APP_PROPERTIES) {
    return null;
  }
  return APP_PROPERTIES[key];
};

const initCache = () => {
  try {
    const ttl = parseInt(getConfigValue(CONFIG_KEY.JWT_VALIDITY));
    LRU_CACHE = new LRUCache({ ttl, ttlAutopurge: true });
  } catch {
    LRU_CACHE = null;
  }
};

const setMasterKey = async (masterKey) => {
  APP_PROPERTIES = {};
  const mongoUri = decryptRSA(masterKey, ENV.MONGODB_URI);
  if (!mongoUri) {
    throw new Error("Invalid key");
  }
  APP_PROPERTIES[CONFIG_KEY.MONGODB_URI] = mongoUri;
  dbConfig();
  const configData = await Config.find();
  configData.forEach((config) => {
    APP_PROPERTIES[config.key] =
      config.kind === CONFIG_KIND.RAW
        ? config.value
        : decryptRSA(masterKey, config.value);
  });
  initCache();
};

const clearMasterKey = () => {
  APP_PROPERTIES = null;
  LRU_CACHE = null;
};

const initKey = async () => {
  const masterKey = ENV.MASTER_KEY;
  if (masterKey) {
    console.log("Master key found");
    await setMasterKey(masterKey);
  } else {
    console.log("Master key not found");
  }
};

const getListConfigValues = (key) => {
  try {
    const data = getConfigValue(key);
    return data.split(",").map((item) => item.trim()) || [];
  } catch {
    return [];
  }
};

export {
  getAppProperties,
  setMasterKey,
  getConfigValue,
  getLruCache,
  clearMasterKey,
  initKey,
  getListConfigValues,
};
