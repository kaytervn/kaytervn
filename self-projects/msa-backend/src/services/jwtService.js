import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getConfigValue } from "../config/appProperties.js";
import { jwtDecode } from "jwt-decode";
import { CONFIG_KEY } from "../utils/constant.js";

const createToken = (payload) => {
  const jwtSecret = getConfigValue(CONFIG_KEY.JWT_SECRET);
  const jwtValidity = parseInt(getConfigValue(CONFIG_KEY.JWT_VALIDITY));
  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtValidity,
  });
};

const verifyToken = (token) => {
  const jwtSecret = getConfigValue(CONFIG_KEY.JWT_SECRET);
  return jwt.verify(token, jwtSecret);
};

const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

const encodePassword = async (rawPassword) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(rawPassword, salt);
};

const comparePassword = async (rawPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(rawPassword, hashedPassword);
  } catch {
    return false;
  }
};

export {
  createToken,
  verifyToken,
  decodeToken,
  encodePassword,
  comparePassword,
};
