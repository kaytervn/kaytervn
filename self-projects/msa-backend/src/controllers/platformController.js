import { encryptCommonField } from "../encryption/commonEncryption.js";
import {
  decryptAndEncryptDataByUserKey,
  decryptAndEncryptListByUserKey,
  decryptDataByUserKey,
} from "../encryption/userKeyEncryption.js";
import Account from "../models/accountModel.js";
import Platform from "../models/platformModel.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { ENCRYPT_FIELDS } from "../utils/constant.js";

const createPlatform = async (req, res) => {
  try {
    const { name } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.CREATE_PLATFORM
    );
    if (!name) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    const encryptedName = encryptCommonField(name);
    if (await Platform.findOne({ name: encryptedName })) {
      return makeErrorResponse({
        res,
        message: "Name existed",
      });
    }
    await Platform.create({ name: encryptedName });
    return makeSuccessResponse({
      res,
      message: "Create platform success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updatePlatform = async (req, res) => {
  try {
    const { id, name } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.UPDATE_PLATFORM
    );
    if (!name || !id) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    const platform = await Platform.findById(id);
    if (!platform) {
      return makeErrorResponse({ res, message: "Platform not found" });
    }
    const encryptedName = encryptCommonField(name);
    const existingPlatform = await Platform.findOne({
      name: encryptedName,
      _id: { $ne: id },
    });
    if (existingPlatform) {
      return makeErrorResponse({
        res,
        message: "Name existed",
      });
    }
    await platform.updateOne({ name: encryptedName });
    return makeSuccessResponse({ res, message: "Platform updated" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deletePlatform = async (req, res) => {
  try {
    const id = req.params.id;
    const platform = await Platform.findById(id);
    if (!platform) {
      return makeErrorResponse({ res, message: "Platform not found" });
    }
    const isUsed = await Account.exists({ platform: id });
    if (isUsed) {
      return makeErrorResponse({
        res,
        message: "Cannot delete platform",
      });
    }
    await platform.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Platform deleted",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getPlatform = async (req, res) => {
  try {
    const id = req.params.id;
    const platform = await Platform.findById(id);
    if (!platform) {
      return makeErrorResponse({ res, message: "Platform not found" });
    }
    return makeSuccessResponse({
      res,
      data: decryptAndEncryptDataByUserKey(
        req.token,
        platform,
        ENCRYPT_FIELDS.PLATFORM
      ),
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListPlatforms = async (req, res) => {
  try {
    const platforms = decryptAndEncryptListByUserKey(
      req.token,
      await Platform.find(),
      ENCRYPT_FIELDS.PLATFORM
    );
    return makeSuccessResponse({
      res,
      data: platforms,
    });
  } catch (error) {
    return makeErrorResponse({
      res,
      message: error.message,
    });
  }
};

export {
  createPlatform,
  updatePlatform,
  deletePlatform,
  getPlatform,
  getListPlatforms,
};
