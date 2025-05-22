import Setting from "../models/settingModel.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import {
  formatSettingData,
  getListSettings,
} from "../services/settingService.js";

const createSetting = async (req, res) => {
  try {
    const { title, keyName, roleKind, value } = req.body;
    if (
      await Setting.findOne({
        $or: [
          { title, roleKind },
          { keyName, roleKind },
        ],
      })
    ) {
      return makeErrorResponse({ res, message: "Setting existed" });
    }
    await Setting.create({
      title,
      keyName,
      roleKind,
      value,
    });
    return makeSuccessResponse({
      res,
      message: "Setting created",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateSetting = async (req, res) => {
  try {
    const { id, value } = req.body;
    const setting = await Setting.findById(id);
    if (!setting) {
      return makeErrorResponse({ res, message: "Setting not found" });
    }
    await setting.updateOne({
      value,
    });
    return makeSuccessResponse({
      res,
      message: "Setting updated",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getSetting = async (req, res) => {
  try {
    const id = req.params.id;
    const setting = await Setting.findById(id);
    return makeSuccessResponse({
      res,
      data: formatSettingData(setting),
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getSettings = async (req, res) => {
  try {
    const result = await getListSettings(req);
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { createSetting, getSetting, getSettings, updateSetting };
