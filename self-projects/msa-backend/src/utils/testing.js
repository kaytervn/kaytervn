/* eslint-disable no-unused-vars */
import { getConfigValue, setMasterKey } from "../config/appProperties.js";
import Config from "../models/configModel.js";
import { encryptRSA } from "../services/encryptionService.js";
import { CONFIG_KEY, CONFIG_KIND } from "./constant.js";

const insertConfig = async () => {
  const masterKey = "";
  const key = "";
  const kind = CONFIG_KIND.RAW;
  const value = "";

  await setMasterKey(masterKey);
  const publicKey = await getConfigValue(CONFIG_KEY.MASTER_PUBLIC_KEY);
  await Config.insertOne({
    key,
    kind,
    value: kind === CONFIG_KIND.RAW ? value : encryptRSA(publicKey, value),
  });
  console.log("Config inserted successfully");
};

// await insertConfig();
