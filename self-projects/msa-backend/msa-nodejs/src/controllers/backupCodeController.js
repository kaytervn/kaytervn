import mongoose from "mongoose";
import { encryptCommonField } from "../encryption/commonEncryption.js";
import {
  decryptAndEncryptDataByUserKey,
  decryptAndEncryptListByUserKey,
  decryptDataByUserKey,
} from "../encryption/userKeyEncryption.js";
import BackupCode from "../models/backupCodeModel.js";
import Account from "../models/accountModel.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { ENCRYPT_FIELDS } from "../utils/constant.js";

const createBackupCode = async (req, res) => {
  try {
    const { code, accountId } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.CREATE_BACKUP_CODE
    );
    if (!code || !accountId || !mongoose.isValidObjectId(accountId)) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    if (accountId) {
      const accountExists = await Account.exists({ _id: accountId });
      if (!accountExists) {
        return makeErrorResponse({
          res,
          message: "Not found ref account",
        });
      }
    }
    const encryptedName = encryptCommonField(code);
    if (await BackupCode.findOne({ code: encryptedName })) {
      return makeErrorResponse({
        res,
        message: "Code existed",
      });
    }
    await BackupCode.create({
      code: encryptCommonField(code),
      account: accountId,
    });
    return makeSuccessResponse({
      res,
      message: "Create backup code success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateBackupCode = async (req, res) => {
  try {
    const { id, code, accountId } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.UPDATE_BACKUP_CODE
    );
    if (!id || !mongoose.isValidObjectId(id)) {
      return makeErrorResponse({
        res,
        message: "id is required",
      });
    }
    if (!code || !accountId || !mongoose.isValidObjectId(accountId)) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    if (accountId) {
      const accountExists = await Account.exists({ _id: accountId });
      if (!accountExists) {
        return makeErrorResponse({
          res,
          message: "Not found ref account",
        });
      }
    }
    const encryptedName = encryptCommonField(code);
    const existingObj = await BackupCode.findOne({
      code: encryptedName,
      _id: { $ne: id },
    });
    if (existingObj) {
      return makeErrorResponse({
        res,
        message: "Code existed",
      });
    }
    const backupCode = await BackupCode.findById(id);
    if (!backupCode) {
      return makeErrorResponse({ res, message: "Not found backup code" });
    }
    await backupCode.updateOne({
      code: encryptCommonField(code),
      account: accountId,
    });
    return makeSuccessResponse({ res, message: "Update backup code success" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteBackupCode = async (req, res) => {
  try {
    const id = req.params.id;
    const backupCode = await BackupCode.findById(id);
    if (!backupCode) {
      return makeErrorResponse({ res, message: "Not found backup code" });
    }
    await backupCode.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete backup code success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getBackupCode = async (req, res) => {
  try {
    const id = req.params.id;
    const backupCode = await BackupCode.findById(id).populate("account");
    if (!backupCode) {
      return makeErrorResponse({ res, message: "Not found backup code" });
    }
    return makeSuccessResponse({
      res,
      data: decryptAndEncryptDataByUserKey(
        req.token,
        backupCode,
        ENCRYPT_FIELDS.BACKUP_CODE
      ),
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListBackupCodes = async (req, res) => {
  try {
    const query = {};
    if (req.query.account) {
      query.account = req.query.account;
    }
    const objs = decryptAndEncryptListByUserKey(
      req.token,
      await BackupCode.find(query).populate("account"),
      ENCRYPT_FIELDS.BACKUP_CODE
    );
    return makeSuccessResponse({
      res,
      data: objs,
    });
  } catch (error) {
    return makeErrorResponse({
      res,
      message: error.message,
    });
  }
};

export {
  createBackupCode,
  updateBackupCode,
  deleteBackupCode,
  getBackupCode,
  getListBackupCodes,
};
