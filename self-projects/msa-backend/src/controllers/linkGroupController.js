import { encryptCommonField } from "../encryption/commonEncryption.js";
import {
  decryptAndEncryptDataByUserKey,
  decryptAndEncryptListByUserKey,
  decryptDataByUserKey,
} from "../encryption/userKeyEncryption.js";
import LinkGroup from "../models/linkGroupModel.js";
import Link from "../models/linkModel.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { ENCRYPT_FIELDS } from "../utils/constant.js";

const createLinkGroup = async (req, res) => {
  try {
    const { name } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.CREATE_LINK_GROUP
    );
    if (!name) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    const encryptedName = encryptCommonField(name);
    if (await LinkGroup.findOne({ name: encryptedName })) {
      return makeErrorResponse({
        res,
        message: "Name existed",
      });
    }
    await LinkGroup.create({ name: encryptedName });
    return makeSuccessResponse({
      res,
      message: "Create success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateLinkGroup = async (req, res) => {
  try {
    const { id, name } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.UPDATE_LINK_GROUP
    );
    if (!name || !id) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    const obj = await LinkGroup.findById(id);
    if (!obj) {
      return makeErrorResponse({ res, message: "Obj not found" });
    }
    const encryptedName = encryptCommonField(name);
    const existingObj = await LinkGroup.findOne({
      name: encryptedName,
      _id: { $ne: id },
    });
    if (existingObj) {
      return makeErrorResponse({
        res,
        message: "Name existed",
      });
    }
    await obj.updateOne({ name: encryptedName });
    return makeSuccessResponse({ res, message: "Updated success" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteLinkGroup = async (req, res) => {
  try {
    const id = req.params.id;
    const obj = await LinkGroup.findById(id);
    if (!obj) {
      return makeErrorResponse({ res, message: "Obj not found" });
    }
    const isUsed = await Link.exists({ linkGroup: id });
    if (isUsed) {
      return makeErrorResponse({
        res,
        message: "Cannot delete obj",
      });
    }
    await obj.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Deleted success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getLinkGroup = async (req, res) => {
  try {
    const id = req.params.id;
    const obj = await LinkGroup.findById(id).lean();
    if (!obj) {
      return makeErrorResponse({ res, message: "Obj not found" });
    }
    return makeSuccessResponse({
      res,
      data: decryptAndEncryptDataByUserKey(
        req.token,
        obj,
        ENCRYPT_FIELDS.LINK_GROUP
      ),
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListLinkGroups = async (req, res) => {
  try {
    const objs = decryptAndEncryptListByUserKey(
      req.token,
      await LinkGroup.find().lean(),
      ENCRYPT_FIELDS.LINK_GROUP
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
  createLinkGroup,
  updateLinkGroup,
  deleteLinkGroup,
  getLinkGroup,
  getListLinkGroups,
};
