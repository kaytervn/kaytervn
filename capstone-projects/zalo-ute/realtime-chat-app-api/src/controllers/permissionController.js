import Permission from "../models/permissionModel.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";

const createPermission = async (req, res) => {
  try {
    const { name, permissionCode, groupName } = req.body;
    if (await Permission.findOne({ permissionCode })) {
      return makeErrorResponse({ res, message: "Permission code existed" });
    }
    await Permission.create({
      name,
      permissionCode,
      groupName,
    });
    return makeSuccessResponse({
      res,
      message: "Permission created",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find()
      .select("name groupName permissionCode")
      .sort({ createdAt: -1 });
    return makeSuccessResponse({
      res,
      data: {
        content: permissions,
        totalPages: 1,
        totalElements: permissions.length,
      },
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { createPermission, getListPermissions };
