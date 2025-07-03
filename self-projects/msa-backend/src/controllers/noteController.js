import mongoose from "mongoose";
import { encryptCommonField } from "../encryption/commonEncryption.js";
import {
  decryptAndEncryptDataByUserKey,
  decryptAndEncryptListByUserKey,
  decryptDataByUserKey,
} from "../encryption/userKeyEncryption.js";
import Note from "../models/noteModel.js";

import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { ENCRYPT_FIELDS } from "../utils/constant.js";

const createNote = async (req, res) => {
  try {
    const { name, note } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.CREATE_NOTE
    );
    if (!name || !note) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    const encryptedName = encryptCommonField(name);
    if (await Note.findOne({ name: encryptedName })) {
      return makeErrorResponse({
        res,
        message: "Name existed",
      });
    }
    await Note.create({
      name: encryptCommonField(name),
      note: encryptCommonField(note),
    });
    return makeSuccessResponse({
      res,
      message: "Create note success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id, name, note } = decryptDataByUserKey(
      req.token,
      req.body,
      ENCRYPT_FIELDS.UPDATE_NOTE
    );
    if (!id || !mongoose.isValidObjectId(id)) {
      return makeErrorResponse({
        res,
        message: "id is required",
      });
    }
    if (!name || !note) {
      return makeErrorResponse({
        res,
        message: "Invalid form",
      });
    }
    const encryptedName = encryptCommonField(name);
    const existingObj = await Note.findOne({
      name: encryptedName,
      _id: { $ne: id },
    });
    if (existingObj) {
      return makeErrorResponse({
        res,
        message: "Name existed",
      });
    }
    const noteObj = await Note.findById(id);
    if (!noteObj) {
      return makeErrorResponse({ res, message: "Not found note" });
    }
    await noteObj.updateOne({
      name: encryptCommonField(name),
      note: encryptCommonField(note),
    });
    return makeSuccessResponse({ res, message: "Update note success" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const id = req.params.id;
    const note = await Note.findById(id);
    if (!note) {
      return makeErrorResponse({ res, message: "Not found note" });
    }
    await note.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete note success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getNote = async (req, res) => {
  try {
    const id = req.params.id;
    const note = await Note.findById(id).lean();
    if (!note) {
      return makeErrorResponse({ res, message: "Not found note" });
    }
    return makeSuccessResponse({
      res,
      data: decryptAndEncryptDataByUserKey(
        req.token,
        note,
        ENCRYPT_FIELDS.NOTE
      ),
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListNotes = async (req, res) => {
  try {
    const objs = decryptAndEncryptListByUserKey(
      req.token,
      await Note.find().lean(),
      ENCRYPT_FIELDS.NOTE
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

export { createNote, updateNote, deleteNote, getNote, getListNotes };
