import mongoose from "mongoose";
import { encryptCommonField } from "../encryption/commonEncryption.js";
import {
  decryptAndEncryptDataByUserKeyForEbank,
  decryptAndEncryptListByUserKeyForEbank,
  decryptDataByUserKey,
} from "../encryption/userKeyEncryption.js";
import BankNumber from "../models/bankNumberModel.js";
import Bank from "../models/bankModel.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { ENCRYPT_FIELDS } from "../utils/constant.js";
import { encryptEbankField } from "../encryption/ebankEncryption.js";

const createBankNumber = async (req, res) => {
  try {
    const { name, number, bankId } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.CREATE_BANK_NUMBER
    );
    if (!name || !number || !bankId || !mongoose.isValidObjectId(bankId)) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    if (bankId) {
      const bankExists = await Bank.exists({ _id: bankId });
      if (!bankExists) {
        return makeErrorResponse({
          res,
          message: "Not found ref bank",
        });
      }
    }
    const encryptedName = encryptEbankField(name);
    if (await BankNumber.findOne({ name: encryptedName, bank: bankId })) {
      return makeErrorResponse({
        res,
        message: "Name existed",
      });
    }
    const encryptedNumber = encryptEbankField(number);
    if (await BankNumber.findOne({ number: encryptedNumber, bank: bankId })) {
      return makeErrorResponse({
        res,
        message: "Number existed",
      });
    }
    await BankNumber.create({
      name: encryptCommonField(name),
      number: encryptCommonField(number),
      bank: bankId,
    });
    return makeSuccessResponse({
      res,
      message: "Create bank number success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateBankNumber = async (req, res) => {
  try {
    const { id, name, number } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.UPDATE_BANK_NUMBER
    );
    if (!id || !mongoose.isValidObjectId(id)) {
      return makeErrorResponse({
        res,
        message: "id is required",
      });
    }
    if (!name || !number) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    const bankNumber = await BankNumber.findById(id);
    if (!bankNumber) {
      return makeErrorResponse({ res, message: "Not found bank number" });
    }
    const bankId = bankNumber.bank;
    const encryptedName = encryptEbankField(name);
    const existingObj = await BankNumber.findOne({
      name: encryptedName,
      bank: bankId,
      _id: { $ne: id },
    });
    if (existingObj) {
      return makeErrorResponse({
        res,
        message: "Name existed",
      });
    }
    const encryptedNumber = encryptEbankField(number);
    const existingNumber = await BankNumber.findOne({
      name: encryptedNumber,
      bank: bankId,
      _id: { $ne: id },
    });
    if (existingNumber) {
      return makeErrorResponse({
        res,
        message: "Number existed",
      });
    }
    await bankNumber.updateOne({
      name: encryptCommonField(name),
      number: encryptCommonField(number),
    });
    return makeSuccessResponse({ res, message: "Update bank number success" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteBankNumber = async (req, res) => {
  try {
    const id = req.params.id;
    const bankNumber = await BankNumber.findById(id);
    if (!bankNumber) {
      return makeErrorResponse({ res, message: "Not found bank number" });
    }
    await bankNumber.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete bank number success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getBankNumber = async (req, res) => {
  try {
    const id = req.params.id;
    const bankNumber = await BankNumber.findById(id).populate("bank").lean();
    if (!bankNumber) {
      return makeErrorResponse({ res, message: "Not found bank number" });
    }
    return makeSuccessResponse({
      res,
      data: decryptAndEncryptDataByUserKeyForEbank(
        req.token,
        bankNumber,
        ENCRYPT_FIELDS.BANK_NUMBER
      ),
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListBankNumbers = async (req, res) => {
  try {
    const query = {};
    if (req.query.bank) {
      query.bank = req.query.bank;
    }
    const objs = decryptAndEncryptListByUserKeyForEbank(
      req.token,
      await BankNumber.find(query).populate("bank").lean(),
      ENCRYPT_FIELDS.BANK_NUMBER
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
  createBankNumber,
  updateBankNumber,
  deleteBankNumber,
  getBankNumber,
  getListBankNumbers,
};
