import mongoose from "mongoose";
import { encryptCommonField } from "../encryption/commonEncryption.js";
import {
  decryptAndEncryptDataByUserKey,
  decryptAndEncryptListByUserKey,
  decryptDataByUserKey,
} from "../encryption/userKeyEncryption.js";
import Link from "../models/linkModel.js";
import LinkGroup from "../models/linkGroupModel.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { ENCRYPT_FIELDS } from "../utils/constant.js";

const createLink = async (req, res) => {
  try {
    const { name, link, note, linkGroupId } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.CREATE_LINK
    );
    if (
      !name ||
      !link ||
      !linkGroupId ||
      !mongoose.isValidObjectId(linkGroupId)
    ) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    if (linkGroupId) {
      const linkGroupExists = await LinkGroup.exists({ _id: linkGroupId });
      if (!linkGroupExists) {
        return makeErrorResponse({
          res,
          message: "Not found ref link group",
        });
      }
    }
    await Link.create({
      name: encryptCommonField(name),
      link: encryptCommonField(link),
      note: encryptCommonField(note),
      linkGroup: linkGroupId,
    });
    return makeSuccessResponse({
      res,
      message: "Create link success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateLink = async (req, res) => {
  try {
    const { id, name, link, note, linkGroupId } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.UPDATE_LINK
    );
    if (!id || !mongoose.isValidObjectId(id)) {
      return makeErrorResponse({
        res,
        message: "id is required",
      });
    }
    if (
      !name ||
      !link ||
      !linkGroupId ||
      !mongoose.isValidObjectId(linkGroupId)
    ) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    if (linkGroupId) {
      const linkGroupExists = await LinkGroup.exists({ _id: linkGroupId });
      if (!linkGroupExists) {
        return makeErrorResponse({
          res,
          message: "Not found ref link group",
        });
      }
    }
    const linkObj = await Link.findById(id);
    if (!linkObj) {
      return makeErrorResponse({ res, message: "Not found link" });
    }
    await linkObj.updateOne({
      name: encryptCommonField(name),
      link: encryptCommonField(link),
      note: encryptCommonField(note),
      linkGroup: linkGroupId,
    });
    return makeSuccessResponse({ res, message: "Update link success" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteLink = async (req, res) => {
  try {
    const id = req.params.id;
    const link = await Link.findById(id);
    if (!link) {
      return makeErrorResponse({ res, message: "Not found link" });
    }
    await link.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete link success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getLink = async (req, res) => {
  try {
    const id = req.params.id;
    const link = await Link.findById(id).populate("linkGroup");
    if (!link) {
      return makeErrorResponse({ res, message: "Not found link" });
    }
    return makeSuccessResponse({
      res,
      data: decryptAndEncryptDataByUserKey(
        req.token,
        link,
        ENCRYPT_FIELDS.LINK
      ),
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListLinks = async (req, res) => {
  try {
    const objs = decryptAndEncryptListByUserKey(
      req.token,
      await Link.find().populate("linkGroup"),
      ENCRYPT_FIELDS.LINK
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

export { createLink, updateLink, deleteLink, getLink, getListLinks };
