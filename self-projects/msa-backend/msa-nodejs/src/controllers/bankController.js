import mongoose from "mongoose";
import {
  decryptAndEncryptDataByUserKeyForEbank,
  decryptAndEncryptListByUserKeyForEbank,
  decryptDataByUserKey,
} from "../encryption/userKeyEncryption.js";
import Bank from "../models/bankModel.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { ENCRYPT_FIELDS } from "../utils/constant.js";
import { encryptEbankField } from "../encryption/ebankEncryption.js";

const createBank = async (req, res) => {
  try {
    const { name, username, password } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.CREATE_BANK
    );
    if (!name || !username || !password) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    const encryptedName = encryptEbankField(name);
    if (await Bank.findOne({ name: encryptedName })) {
      return makeErrorResponse({
        res,
        message: "Name existed",
      });
    }
    await Bank.create({
      name: encryptEbankField(name),
      username: encryptEbankField(username),
      password: encryptEbankField(password),
    });
    return makeSuccessResponse({
      res,
      message: "Create bank success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateBank = async (req, res) => {
  try {
    const { id, name, username, password } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.UPDATE_BANK
    );
    if (!id || !mongoose.isValidObjectId(id)) {
      return makeErrorResponse({
        res,
        message: "id is required",
      });
    }
    if (!name || !username || !password) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    const encryptedName = encryptEbankField(name);
    const existingObj = await Bank.findOne({
      name: encryptedName,
      _id: { $ne: id },
    });
    if (existingObj) {
      return makeErrorResponse({
        res,
        message: "Name existed",
      });
    }
    const bank = await Bank.findById(id);
    if (!bank) {
      return makeErrorResponse({ res, message: "Not found bank" });
    }
    await bank.updateOne({
      name: encryptEbankField(name),
      username: encryptEbankField(username),
      password: encryptEbankField(password),
    });
    return makeSuccessResponse({ res, message: "Update bank success" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteBank = async (req, res) => {
  try {
    const id = req.params.id;
    const bank = await Bank.findById(id);
    if (!bank) {
      return makeErrorResponse({ res, message: "Not found bank" });
    }
    await bank.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete bank success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getBank = async (req, res) => {
  try {
    const id = req.params.id;
    const bank = await Bank.findById(id);
    if (!bank) {
      return makeErrorResponse({ res, message: "Not found bank" });
    }
    return makeSuccessResponse({
      res,
      data: decryptAndEncryptDataByUserKeyForEbank(
        req.token,
        bank,
        ENCRYPT_FIELDS.BANK
      ),
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListBanks = async (req, res) => {
  try {
    const objs = decryptAndEncryptListByUserKeyForEbank(
      req.token,
      await Bank.find(),
      ENCRYPT_FIELDS.BANK
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

export { createBank, updateBank, deleteBank, getBank, getListBanks };
