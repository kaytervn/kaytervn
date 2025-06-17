import { decryptClientData } from "../encryption/clientEncryption.js";
import {
  decryptCommonData,
  decryptCommonField,
  encryptCommonField,
} from "../encryption/commonEncryption.js";
import User from "../models/userModel.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
  sendEmail,
} from "../services/apiService.js";
import { getKey, putKey, putPublicKey } from "../services/cacheService.js";
import {
  encryptRSA,
  extractBase64FromPem,
} from "../services/encryptionService.js";
import {
  generateMd5,
  generateOTP,
  generateRandomString,
  generateRSAKeyPair,
  generateTimestamp,
} from "../services/generateService.js";
import {
  comparePassword,
  createToken,
  encodePassword,
} from "../services/jwtService.js";
import { handleSendMsgLockDevice } from "../services/socketService.js";
import { setup2FA, verify2FA } from "../services/totpService.js";
import { ENCRYPT_FIELDS } from "../utils/constant.js";
import { Buffer } from "buffer";
import { verifyTimestamp } from "../utils/utils.js";

const loginUser = async (req, res) => {
  try {
    const { username, password, totp } = decryptClientData(
      req.body,
      ENCRYPT_FIELDS.LOGIN_FORM
    );
    if (!username || !password) {
      return makeErrorResponse({ res, message: "Invalid form" });
    }
    let user = await User.findOne({
      username: encryptCommonField(username),
    });
    if (!user) {
      return makeErrorResponse({ res, message: "Bad credentials" });
    }
    user = decryptCommonData(user.toObject(), ENCRYPT_FIELDS.USER);
    if (!user.secret || !(await comparePassword(password, user.password))) {
      return makeErrorResponse({ res, message: "Bad credentials" });
    }
    const verified = await verify2FA(totp, user.secret);
    if (!verified) {
      return makeErrorResponse({ res, message: "Invalid TOTP" });
    }
    const secretKey = generateRandomString(16);
    const sessionId = generateMd5(username + generateTimestamp() + secretKey);
    const accessToken = createToken({
      id: user._id,
      username: user.username,
      secretKey: encryptCommonField(secretKey),
      sessionId,
    });
    handleSendMsgLockDevice(user.username);
    putKey(username, sessionId);
    return makeSuccessResponse({
      res,
      message: "Login success",
      data: { accessToken },
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const verifyCredential = async (req, res) => {
  try {
    const { username, password } = decryptClientData(
      req.body,
      ENCRYPT_FIELDS.LOGIN_FORM
    );
    if (!username || !password) {
      return makeErrorResponse({ res, message: "Invalid form" });
    }
    let user = await User.findOne({ username: encryptCommonField(username) });
    if (!user) {
      return makeErrorResponse({ res, message: "Bad credentials" });
    }
    user = decryptCommonData(user.toObject(), ENCRYPT_FIELDS.USER);
    if (!(await comparePassword(password, user.password))) {
      return makeErrorResponse({ res, message: "Bad credentials" });
    }
    if (!user.secret) {
      const { qrCodeUrl, secret } = await setup2FA(username);
      await User.updateOne(
        { username: encryptCommonField(username) },
        { secret: encryptCommonField(secret) }
      );
      return makeSuccessResponse({
        res,
        message: "Setup 2FA success",
        data: { qrUrl: qrCodeUrl },
      });
    }
    return makeSuccessResponse({
      res,
      message: "Verify success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const requestForgotPassword = async (req, res) => {
  try {
    const { email } = decryptClientData(
      req.body,
      ENCRYPT_FIELDS.REQUEST_FORGOT_PASSWORD_FORM
    );
    if (!email) {
      return makeErrorResponse({ res, message: "Invalid form" });
    }
    const user = await User.findOne({
      email: encryptCommonField(email),
    });
    if (!user) {
      return makeErrorResponse({ res, message: "Email not found" });
    }
    const otp = generateOTP(6);
    const now = new Date().toISOString();
    const rawData = `${user._id.toString()};${otp};${now}`;
    const userId = encryptCommonField(rawData);
    await user.updateOne({ code: encryptCommonField(otp) });
    await sendEmail({ email, otp, subject: "RESET PASSWORD" });
    return makeSuccessResponse({
      res,
      data: { userId },
      message: "Request forgot password success, please check your email",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const { userId, newPassword, otp } = decryptClientData(
      req.body,
      ENCRYPT_FIELDS.RESET_PASSWORD_FORM
    );
    if (!userId || !newPassword || !otp) {
      return makeErrorResponse({ res, message: "Invalid form" });
    }

    const [extractId, extractOtp, timestamp] =
      decryptCommonField(userId).split(";");

    if (!verifyTimestamp(timestamp)) {
      return makeErrorResponse({ res, message: "Request expired" });
    }

    const user = decryptCommonData(
      await User.findById(extractId),
      ENCRYPT_FIELDS.USER
    );
    if (!user) {
      return makeErrorResponse({ res, message: "User not found" });
    }
    if (user.code !== otp || user.code != extractOtp) {
      return makeErrorResponse({ res, message: "Invalid OTP" });
    }
    await User.updateOne(
      { _id: extractId },
      {
        password: encryptCommonField(await encodePassword(newPassword)),
        code: null,
      }
    );
    return makeSuccessResponse({
      res,
      message: "Reset password success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const changeUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = decryptClientData(
      req.body,
      ENCRYPT_FIELDS.CHANGE_PASSWORD_FORM
    );
    if (!oldPassword || !newPassword) {
      return makeErrorResponse({ res, message: "Invalid form" });
    }

    const user = decryptCommonData(
      await User.findById(req.token.id),
      ENCRYPT_FIELDS.USER
    );
    if (!user) {
      return makeErrorResponse({ res, message: "User not found" });
    }
    if (!(await comparePassword(oldPassword, user.password))) {
      return makeErrorResponse({ res, message: "Old password is incorrect" });
    }
    if (await comparePassword(newPassword, user.password)) {
      return makeErrorResponse({
        res,
        message: "New password must be different from old password",
      });
    }
    await User.updateOne(
      { _id: req.token.id },
      { password: encryptCommonField(await encodePassword(newPassword)) }
    );
    return makeSuccessResponse({
      res,
      message: "Change password success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const changePin = async (req, res) => {
  try {
    const { oldPin, newPin, currentPassword } = decryptClientData(
      req.body,
      ENCRYPT_FIELDS.CHANGE_PIN_FORM
    );
    if (!oldPin || !newPin || !currentPassword) {
      return makeErrorResponse({ res, message: "Invalid form" });
    }

    const user = decryptCommonData(
      await User.findById(req.token.id),
      ENCRYPT_FIELDS.USER
    );
    if (!user) {
      return makeErrorResponse({ res, message: "User not found" });
    }
    if (!(await comparePassword(currentPassword, user.password))) {
      return makeErrorResponse({
        res,
        message: "Current password is incorrect",
      });
    }
    if (!(await comparePassword(oldPin, user.pin))) {
      return makeErrorResponse({
        res,
        message: "Old pin is incorrect",
      });
    }
    if (await comparePassword(newPin, user.pin)) {
      return makeErrorResponse({
        res,
        message: "New pin must be different from old pin",
      });
    }
    await User.updateOne(
      { _id: req.token.id },
      { pin: encryptCommonField(await encodePassword(newPin)) }
    );
    return makeSuccessResponse({
      res,
      message: "Change PIN success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const requestResetMfa = async (req, res) => {
  try {
    const { email, password } = decryptClientData(
      req.body,
      ENCRYPT_FIELDS.REQUEST_MFA_FORM
    );
    if (!email || !password) {
      return makeErrorResponse({ res, message: "Invalid form" });
    }
    const user = await User.findOne({
      email: encryptCommonField(email),
    });
    if (!user) {
      return makeErrorResponse({ res, message: "Email not found" });
    }
    if (!(await comparePassword(password, decryptCommonField(user.password)))) {
      return makeErrorResponse({ res, message: "Invalid password" });
    }
    const otp = generateOTP(6);
    const now = new Date().toISOString();
    const rawData = `${user._id.toString()}&${otp}&${now}`;
    const userId = encryptCommonField(rawData);
    await user.updateOne({ otp: encryptCommonField(otp) });
    await sendEmail({ email, otp, subject: "RESET MFA" });
    return makeSuccessResponse({
      res,
      data: { userId },
      message: "Request reset mfa success, please check your email",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const resetUserMfa = async (req, res) => {
  try {
    const { userId, otp } = decryptClientData(
      req.body,
      ENCRYPT_FIELDS.RESET_PASSWORD_FORM
    );
    if (!userId || !otp) {
      return makeErrorResponse({ res, message: "Invalid form" });
    }
    const [extractId, extractOtp, timestamp] =
      decryptCommonField(userId).split("&");

    if (!verifyTimestamp(timestamp)) {
      return makeErrorResponse({ res, message: "Request expired" });
    }

    const user = decryptCommonData(
      await User.findById(extractId),
      ENCRYPT_FIELDS.USER
    );
    if (!user) {
      return makeErrorResponse({ res, message: "User not found" });
    }
    if (user.otp !== otp || user.otp != extractOtp) {
      return makeErrorResponse({ res, message: "Invalid OTP" });
    }
    await User.updateOne({ _id: extractId }, { secret: null, otp: null });
    return makeSuccessResponse({
      res,
      message: "Reset mfa success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getMyKey = async (req, res) => {
  try {
    const { secretKey, username } = req.token;
    const userPublicKey = getKey(username).publicKey;
    const decryptedKey = decryptCommonField(secretKey);
    return makeSuccessResponse({
      res,
      data: { secretKey: encryptRSA(userPublicKey, decryptedKey) },
      message: "Get my key success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const verifyUserToken = async (req, res) => {
  try {
    return makeSuccessResponse({
      res,
      data: { token: req.token },
      message: "Verify token success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const requestKey = async (req, res) => {
  try {
    const { username } = req.token;
    const { pin } = decryptClientData(
      req.body,
      ENCRYPT_FIELDS.REQUEST_KEY_FORM
    );
    if (!pin) {
      return makeErrorResponse({ res, message: "Invalid form" });
    }
    let user = await User.findOne({ username: encryptCommonField(username) });
    if (!user) {
      return makeErrorResponse({ res, message: "Invalid pin" });
    }
    user = decryptCommonData(user, ENCRYPT_FIELDS.USER);
    if (!user || !(await comparePassword(pin, user.pin))) {
      return makeErrorResponse({ res, message: "Invalid pin" });
    }
    const { publicKey, privateKey } = generateRSAKeyPair();
    putPublicKey(username, extractBase64FromPem(publicKey));
    const fileContent = privateKey;
    const buffer = Buffer.from(fileContent, "utf-8");
    const fileName = `request_key_${generateTimestamp()}.txt`;
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(buffer);
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export {
  loginUser,
  verifyCredential,
  requestForgotPassword,
  resetUserPassword,
  requestResetMfa,
  resetUserMfa,
  getMyKey,
  requestKey,
  verifyUserToken,
  changeUserPassword,
  changePin,
};
