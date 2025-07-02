import mongoose from "mongoose";
import { encryptCommonField } from "../encryption/commonEncryption.js";
import {
  decryptAndEncryptDataByUserKey,
  decryptAndEncryptListByUserKey,
  decryptDataByUserKey,
} from "../encryption/userKeyEncryption.js";
import Software from "../models/softwareModel.js";

import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { ENCRYPT_FIELDS } from "../utils/constant.js";

const createSoftware = async (req, res) => {
  try {
    const { name, kind, link, note } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.CREATE_SOFTWARE
    );
    if (!name || !kind) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    const encryptedName = encryptCommonField(name);
    if (await Software.findOne({ name: encryptedName })) {
      return makeErrorResponse({
        res,
        message: "Name existed",
      });
    }
    await Software.create({
      name: encryptCommonField(name),
      kind,
      link: encryptCommonField(link),
      note: encryptCommonField(note),
    });
    return makeSuccessResponse({
      res,
      message: "Create software success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateSoftware = async (req, res) => {
  try {
    const { id, name, kind, link, note } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.UPDATE_SOFTWARE
    );
    if (!id || !mongoose.isValidObjectId(id)) {
      return makeErrorResponse({
        res,
        message: "id is required",
      });
    }
    if (!name || !kind) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    const encryptedName = encryptCommonField(name);
    const existingObj = await Software.findOne({
      name: encryptedName,
      _id: { $ne: id },
    });
    if (existingObj) {
      return makeErrorResponse({
        res,
        message: "Name existed",
      });
    }
    const software = await Software.findById(id);
    if (!software) {
      return makeErrorResponse({ res, message: "Not found software" });
    }
    await software.updateOne({
      name: encryptCommonField(name),
      kind,
      link: encryptCommonField(link),
      note: encryptCommonField(note),
    });
    return makeSuccessResponse({ res, message: "Update software success" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteSoftware = async (req, res) => {
  try {
    const id = req.params.id;
    const software = await Software.findById(id);
    if (!software) {
      return makeErrorResponse({ res, message: "Not found software" });
    }
    await software.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete software success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getSoftware = async (req, res) => {
  try {
    const id = req.params.id;
    const software = await Software.findById(id).lean();
    if (!software) {
      return makeErrorResponse({ res, message: "Not found software" });
    }
    return makeSuccessResponse({
      res,
      data: decryptAndEncryptDataByUserKey(
        req.token,
        software,
        ENCRYPT_FIELDS.SOFTWARE
      ),
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListSoftwares = async (req, res) => {
  try {
    const objs = decryptAndEncryptListByUserKey(
      req.token,
      await Software.find().lean(),
      ENCRYPT_FIELDS.SOFTWARE
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
  createSoftware,
  updateSoftware,
  deleteSoftware,
  getSoftware,
  getListSoftwares,
};
