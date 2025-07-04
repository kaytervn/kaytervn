import mongoose from "mongoose";
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
import { ACCOUNT_KIND, ENCRYPT_FIELDS } from "../utils/constant.js";

const createAccount = async (req, res) => {
  try {
    const { kind, username, password, note, refId, platformId } =
      decryptDataByUserKey(req.token, req.body, ENCRYPT_FIELDS.CREATE_ACCOUNT);
    if (!kind || !platformId || !mongoose.isValidObjectId(platformId)) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    if (kind == ACCOUNT_KIND.ROOT && (!username || !password)) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    if (!refId && kind == ACCOUNT_KIND.LINKED) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    if (refId) {
      const refExists = await Account.exists({ _id: refId });
      if (!refExists) {
        return makeErrorResponse({
          res,
          message: "Not found ref account",
        });
      }
    }
    if (platformId) {
      const platformExists = await Platform.exists({ _id: platformId });
      if (!platformExists) {
        return makeErrorResponse({
          res,
          message: "Not found ref platform",
        });
      }
    }
    if (kind == ACCOUNT_KIND.LINKED) {
      await Account.create({
        kind,
        note: encryptCommonField(note),
        ref: refId,
        platform: platformId,
      });
    } else {
      await Account.create({
        kind,
        username: encryptCommonField(username),
        password: encryptCommonField(password),
        note: encryptCommonField(note),
        platform: platformId,
      });
    }
    return makeSuccessResponse({
      res,
      message: "Create account success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateAccount = async (req, res) => {
  try {
    const { id, username, password, note, refId, platformId } =
      decryptDataByUserKey(req.token, req.body, ENCRYPT_FIELDS.UPDATE_ACCOUNT);
    if (!id || !mongoose.isValidObjectId(id)) {
      return makeErrorResponse({
        res,
        message: "id is required",
      });
    }
    if (!platformId || !mongoose.isValidObjectId(platformId)) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    if (platformId) {
      const platformExists = await Platform.exists({ _id: platformId });
      if (!platformExists) {
        return makeErrorResponse({
          res,
          message: "Not found ref platform",
        });
      }
    }
    const account = await Account.findById(id);
    if (!account) {
      return makeErrorResponse({ res, message: "Not found account" });
    }
    if (account.kind == ACCOUNT_KIND.ROOT && (!username || !password)) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    if (!refId && account.kind == ACCOUNT_KIND.LINKED) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    if (refId) {
      const refExists = await Account.exists({ _id: refId });
      if (!refExists) {
        return makeErrorResponse({
          res,
          message: "Not found ref account",
        });
      }
    }
    if (account.kind == ACCOUNT_KIND.LINKED) {
      await account.updateOne({
        note: encryptCommonField(note),
        ref: refId,
        platform: platformId,
      });
    } else {
      await account.updateOne({
        username: encryptCommonField(username),
        password: encryptCommonField(password),
        note: encryptCommonField(note),
        platform: platformId,
      });
    }
    return makeSuccessResponse({ res, message: "Update account success" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const account = await Account.findById(id);
    if (!account) {
      return makeErrorResponse({ res, message: "Not found account" });
    }
    const refExists = await Account.exists({ _id: account._id });
    if (refExists) {
      return makeErrorResponse({
        res,
        message: "Not allowed to delete account",
      });
    }
    await account.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete account success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const account = await Account.findById(id).populate("ref platform").lean();
    if (!account) {
      return makeErrorResponse({ res, message: "Not found account" });
    }
    return makeSuccessResponse({
      res,
      data: decryptAndEncryptDataByUserKey(
        req.token,
        account,
        ENCRYPT_FIELDS.ACCOUNT
      ),
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListAccounts = async (req, res) => {
  try {
    const query = {};
    if (req.query.ref) {
      query.ref = req.query.ref;
    }
    const objs = decryptAndEncryptListByUserKey(
      req.token,
      await Account.find(query).populate("ref platform").lean(),
      ENCRYPT_FIELDS.ACCOUNT
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
  createAccount,
  updateAccount,
  deleteAccount,
  getAccount,
  getListAccounts,
};
