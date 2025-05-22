import jwt from "jsonwebtoken";
import "dotenv/config.js";
import User from "../models/userModel.js";
import { makeErrorResponse } from "../services/apiService.js";

const auth = (permissionCode) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return makeErrorResponse({ res, message: "You must be logged in" });
    }
    const token = authorization.split(" ")[1];
    try {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(userId).populate({
        path: "role",
        populate: {
          path: "permissions",
        },
      });
      if (!user) {
        return makeErrorResponse({ res, message: "User not found" });
      }
      if (user.status !== 1) {
        return makeErrorResponse({
          res,
          message: "Tài khoản chưa được kích hoạt",
        });
      }
      if (permissionCode) {
        const hasPermission = user.role.permissions.some(
          (perm) => perm.permissionCode === permissionCode
        );
        if (!hasPermission) {
          return makeErrorResponse({
            res,
            message: "You don't have permission",
          });
        }
      }
      await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
      req.user = user;
      next();
    } catch (error) {
      return makeErrorResponse({ res, message: error.message });
    }
  };
};

export default auth;
