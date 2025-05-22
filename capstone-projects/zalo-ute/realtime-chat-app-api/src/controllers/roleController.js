import Role from "../models/roleModel.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { formatRoleData, getListRoles } from "../services/roleService.js";

const createRole = async (req, res) => {
  try {
    const { name, permissions, kind } = req.body;
    if (await Role.findOne({ name })) {
      return makeErrorResponse({ res, message: "Name existed" });
    }
    await Role.create({ name, permissions, kind });
    return makeSuccessResponse({ res, message: "Role created" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id, name, permissions, kind } = req.body;
    const role = await Role.findById(id);
    if (!role) {
      return makeErrorResponse({ res, message: "Role not found" });
    }
    if (name !== role.name && (await Role.findOne({ name }))) {
      return makeErrorResponse({ res, message: "Name existed" });
    }
    const updateData = { name, permissions };
    if (kind) {
      updateData.kind = kind;
    }
    await role.updateOne(updateData);
    return makeSuccessResponse({ res, message: "Role updated" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getRole = async (req, res) => {
  try {
    const id = req.params.id;
    const role = await Role.findById(id).populate("permissions");
    if (!role) {
      return makeErrorResponse({ res, message: "Role not found" });
    }
    return makeSuccessResponse({ res, data: formatRoleData(role) });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getRoles = async (req, res) => {
  try {
    const result = await getListRoles(req);
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { createRole, updateRole, getRoles, getRole };
