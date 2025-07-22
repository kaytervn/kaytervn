import {
  clearMasterKey,
  getAppProperties,
  setMasterKey,
  synchronizeConfig,
} from "../config/appProperties.js";
import { decryptCommonList } from "../encryption/commonEncryption.js";
import User from "../models/userModel.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { handleSendMsgLockDevice } from "../services/socketService.js";
import { ENCRYPT_FIELDS } from "../utils/constant.js";

const inputKey = async (req, res) => {
  const { key } = req.body;
  if (getAppProperties()) {
    return makeErrorResponse({
      res,
      message: "Key already input",
    });
  }
  if (!key || !key.trim()) {
    return makeErrorResponse({
      res,
      message: "Key cannot be null",
    });
  }
  try {
    await setMasterKey(key);
    return makeSuccessResponse({
      res,
      message: "Input key success",
    });
  } catch {
    clearMasterKey();
    return makeErrorResponse({ res, message: "Invalid key" });
  }
};

const clearKey = async (req, res) => {
  try {
    const users = decryptCommonList(await User.find(), ENCRYPT_FIELDS.USER);
    for (const user of users) {
      handleSendMsgLockDevice(user.username);
    }
    clearMasterKey();
    return makeSuccessResponse({
      res,
      message: "Clear key success",
    });
  } catch (err) {
    return makeErrorResponse({
      res,
      message: err.message,
    });
  }
};

const syncAppConfigs = async (req, res) => {
  await synchronizeConfig();
  return makeSuccessResponse({
    res,
    message: "Synchronized successfully",
  });
};

export { inputKey, clearKey, syncAppConfigs };
