import mongoose from "mongoose";
import { encryptCommonField } from "../encryption/commonEncryption.js";
import {
  decryptAndEncryptDataByUserKey,
  decryptAndEncryptListByUserKey,
  decryptDataByUserKey,
} from "../encryption/userKeyEncryption.js";
import IdNumber from "../models/idNumberModel.js";

import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { ENCRYPT_FIELDS } from "../utils/constant.js";

const createIdNumber = async (req, res) => {
  try {
    const { name, code, note } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.CREATE_ID_NUMBER
    );
    if (!name || !code) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    const encryptedName = encryptCommonField(name);
    if (await IdNumber.findOne({ name: encryptedName })) {
      return makeErrorResponse({
        res,
        message: "Name existed",
      });
    }
    await IdNumber.create({
      name: encryptCommonField(name),
      code: encryptCommonField(code),
      note: encryptCommonField(note),
    });
    return makeSuccessResponse({
      res,
      message: "Create id number success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateIdNumber = async (req, res) => {
  try {
    const { id, name, code, note } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.UPDATE_ID_NUMBER
    );
    if (!id || !mongoose.isValidObjectId(id)) {
      return makeErrorResponse({
        res,
        message: "id is required",
      });
    }
    if (!name || !code) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    const encryptedName = encryptCommonField(name);
    const existingObj = await IdNumber.findOne({
      code: encryptedName,
      _id: { $ne: id },
    });
    if (existingObj) {
      return makeErrorResponse({
        res,
        message: "Name existed",
      });
    }
    const idNumber = await IdNumber.findById(id);
    if (!idNumber) {
      return makeErrorResponse({ res, message: "Not found id number" });
    }
    await idNumber.updateOne({
      name: encryptCommonField(name),
      code: encryptCommonField(code),
      note: encryptCommonField(note),
    });
    return makeSuccessResponse({ res, message: "Update id number success" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteIdNumber = async (req, res) => {
  try {
    const id = req.params.id;
    const idNumber = await IdNumber.findById(id);
    if (!idNumber) {
      return makeErrorResponse({ res, message: "Not found id number" });
    }
    await idNumber.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete id number success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getIdNumber = async (req, res) => {
  try {
    const id = req.params.id;
    const idNumber = await IdNumber.findById(id).lean();
    if (!idNumber) {
      return makeErrorResponse({ res, message: "Not found id number" });
    }
    return makeSuccessResponse({
      res,
      data: decryptAndEncryptDataByUserKey(
        req.token,
        idNumber,
        ENCRYPT_FIELDS.ID_NUMBER
      ),
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListIdNumbers = async (req, res) => {
  try {
    const objs = decryptAndEncryptListByUserKey(
      req.token,
      await IdNumber.find().lean(),
      ENCRYPT_FIELDS.ID_NUMBER
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
  createIdNumber,
  updateIdNumber,
  deleteIdNumber,
  getIdNumber,
  getListIdNumbers,
};
