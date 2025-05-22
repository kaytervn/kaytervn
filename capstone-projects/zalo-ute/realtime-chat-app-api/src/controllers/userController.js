import {
  createToken,
  encodePassword,
  makeErrorResponse,
  makeSuccessResponse,
  comparePassword,
  sendEmail,
  createSecretKey,
  createOtp,
  deleteFileByUrl,
  parseDate,
  isValidUrl,
} from "../services/apiService.js";
import User from "../models/userModel.js";
import Role from "../models/roleModel.js";
import "dotenv/config.js";
import jwt from "jsonwebtoken";
import Notification from "../models/notificationModel.js";
import { formatUserData, getListUsers } from "../services/userService.js";
import {
  EmailPattern,
  PhonePattern,
  StudentIdPattern,
} from "../static/constant.js";

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return makeErrorResponse({ res, message: "Invalid form data" });
    }
    const user = await User.findOne({
      $or: [{ studentId: username }, { phone: username }, { email: username }],
    });
    if (!user || !(await comparePassword(password, user.password))) {
      return makeErrorResponse({ res, message: "Sai tài khoản hoặc mật khẩu" });
    }
    if (user.status !== 1) {
      return makeErrorResponse({
        res,
        message: "Tài khoản chưa được kích hoạt",
      });
    }
    const accessToken = createToken(user._id);
    return makeSuccessResponse({
      res,
      message: "Login success",
      data: { accessToken },
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { user } = req;
    return makeSuccessResponse({
      res,
      data: await formatUserData(user),
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { displayName, email, password, phone, studentId } = req.body;
    const errors = [];
    if (!displayName || !displayName.trim()) {
      errors.push({
        field: "displayName",
        message: "displayName cannot be null",
      });
    }
    if (!email || !email.trim()) {
      errors.push({
        field: "email",
        message: "email cannot be null",
      });
    } else if (!EmailPattern.test(email)) {
      errors.push({
        field: "email",
        message: "email is invalid",
      });
    }
    if (!password) {
      errors.push({
        field: "password",
        message: "password cannot be null",
      });
    } else if (password.length < 6) {
      errors.push({
        field: "password",
        message: "password must be at least 6 characters",
      });
    }
    if (!phone || !phone.trim()) {
      errors.push({
        field: "phone",
        message: "phone cannot be null",
      });
    } else if (!PhonePattern.test(phone)) {
      errors.push({
        field: "phone",
        message: "phone is invalid",
      });
    }
    if (!studentId || !studentId.trim()) {
      errors.push({
        field: "studentId",
        message: "studentId cannot be null",
      });
    } else if (!StudentIdPattern.test(studentId)) {
      errors.push({
        field: "studentId",
        message: "studentId is invalid",
      });
    }
    if (errors.length > 0) {
      return makeErrorResponse({ res, data: errors, message: "Invalid form" });
    }
    if (await User.findOne({ studentId })) {
      return makeErrorResponse({
        res,
        message: "Mã sinh viên đã được sử dụng",
      });
    }
    if (await User.findOne({ email })) {
      return makeErrorResponse({ res, message: "Email đã được sử dụng" });
    }
    if (await User.findOne({ phone })) {
      return makeErrorResponse({
        res,
        message: "Số điện thoại đã được sử dụng",
      });
    }
    let secretKey;
    while (true) {
      secretKey = createSecretKey();
      if (!(await User.findOne({ secretKey }))) {
        break;
      }
    }
    const otp = createOtp();
    const role = await Role.findOne({ kind: 1 });
    if (!role) {
      return makeErrorResponse({ res, message: "User role not found" });
    }
    await User.create({
      displayName,
      email,
      password: await encodePassword(password),
      phone,
      otp,
      studentId,
      status: 0,
      secretKey,
      role: await Role.findOne({ kind: 1 }),
    });
    await sendEmail({ email, otp, subject: "XÁC MINH TÀI KHOẢN" });
    return makeSuccessResponse({
      res,
      message: "Register success, please check your email",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const verifyUser = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return makeErrorResponse({ res, message: "Tài khoản không tồn tại" });
    }
    if (user.otp !== otp) {
      return makeErrorResponse({ res, message: "Sai mã xác thực OTP" });
    }
    await user.updateOne({ status: 1 });
    await Notification.create({
      user: user._id,
      data: {
        user: {
          _id: user._id,
        },
      },
      message: `Mừng thành viên mới, ${user.displayName}!`,
    });
    return makeSuccessResponse({ res, message: "Verify success" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const forgotUserPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return makeErrorResponse({ res, message: "Email không tồn tại" });
    }
    const otp = createOtp();
    await user.updateOne({ otp });
    await sendEmail({ email, otp, subject: "ĐẶT LẠI MẬT KHẨU" });
    return makeSuccessResponse({
      res,
      message: "Request forgot password success, please check your email",
    });
  } catch (error) {
    return makeSuccessResponse({ res, message: error.message });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return makeErrorResponse({ res, message: "User not found" });
    }
    if (user.otp !== otp) {
      return makeErrorResponse({ res, message: "Sai mã xác thực OTP" });
    }
    user.password = await encodePassword(newPassword);
    user.otp = null;
    await user.save();
    return makeSuccessResponse({
      res,
      message: "Reset password success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const verifyChangeUserKeyInformation = async (req, res) => {
  try {
    const { email, studentId, phone, otp } = req.body;
    const { user } = req;
    if (user.otp !== otp) {
      return makeErrorResponse({ res, message: "Sai mã xác thực OTP" });
    }
    if (user.email != email && (await User.findOne({ email }))) {
      return makeErrorResponse({ res, message: "Email đã được sử dụng" });
    }
    if (user.phone != phone && (await User.findOne({ phone }))) {
      return makeErrorResponse({
        res,
        message: "Số điện thoại đã được sử dụng",
      });
    }
    if (user.studentId != studentId && (await User.findOne({ studentId }))) {
      return makeErrorResponse({
        res,
        message: "Mã sinh viên đã được sử dụng",
      });
    }
    await user.updateOne({
      email,
      phone,
      studentId,
      otp: null,
    });
    await Notification.create({
      user: user._id,
      data: {
        user: {
          _id: user._id,
        },
      },
      kind: 2,
      message: "Xác thực cập nhật thông tin thành công",
    });
    return makeSuccessResponse({
      res,
      message: "Change key information success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const requestChangeUserKeyInformation = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user } = req;
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return makeErrorResponse({ res, message: "Sai mật khẩu" });
    }
    const otp = createOtp();
    await user.updateOne({ otp });
    await sendEmail({ email, otp, subject: "CẬP NHẬT THÔNG TIN" });
    return makeSuccessResponse({
      res,
      message: "Request success, please check your email",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const {
      displayName,
      birthDate,
      bio,
      avatarUrl,
      currentPassword,
      newPassword,
    } = req.body;
    const { user } = req;
    const errors = [];
    if (!displayName || !displayName.trim()) {
      errors.push({
        field: "displayName",
        message: "displayName cannot be null",
      });
    }
    if (errors.length > 0) {
      return makeErrorResponse({ res, data: errors, message: "Invalid form" });
    }
    if (avatarUrl != user.avatarUrl) {
      await deleteFileByUrl(user.avatarUrl);
    }
    const parsedBirthDate = birthDate ? parseDate(birthDate) : null;
    const updateData = {
      displayName,
      bio,
      avatarUrl: isValidUrl(avatarUrl) ? avatarUrl : null,
      birthDate: parsedBirthDate,
    };
    if (currentPassword && newPassword) {
      const isPasswordValid = await comparePassword(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return makeErrorResponse({
          res,
          message: "Mật khẩu hiện tại không chính xác",
        });
      }
      if (currentPassword === newPassword) {
        return makeErrorResponse({
          res,
          message: "Mật khẩu mới không được trùng với mật khẩu hiện tại",
        });
      }
      updateData.password = await encodePassword(newPassword);
      await Notification.create({
        user: user._id,
        data: {
          user: {
            _id: user._id,
          },
        },
        kind: 2,
        message: "Thay đổi mật khẩu thành công",
      });
    }
    await user.updateOne(updateData);
    return makeSuccessResponse({ res, message: "Update user profile success" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const verifyToken = async (req, res) => {
  try {
    const { accessToken } = req.body;
    const { userId } = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findById(userId);
    if (!user) {
      return makeErrorResponse({ res, message: "Tài khoản không tồn tại" });
    }
    if (user.status === 0) {
      return makeErrorResponse({
        res,
        message: "Tài khoản chưa được kích hoạt",
      });
    }
    return makeSuccessResponse({
      res,
      message: "Verify token success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return makeErrorResponse({ res, message: "User not found" });
    }
    await user.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete user success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await getListUsers(req);
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return makeErrorResponse({ res, message: "User not found" });
    }
    return makeSuccessResponse({ res, data: user });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      displayName,
      email,
      studentId,
      password,
      phone,
      birthDate,
      bio,
      avatarUrl,
      status,
      role,
    } = req.body;
    const parsedBirthDate = birthDate ? parseDate(birthDate) : null;
    const getRole = await Role.findById(role);
    if (await User.findOne({ studentId })) {
      return makeErrorResponse({
        res,
        message: "Mã sinh viên đã được sử dụng",
      });
    }
    if (await User.findOne({ email })) {
      return makeErrorResponse({ res, message: "Email đã được sử dụng" });
    }
    if (await User.findOne({ phone })) {
      return makeErrorResponse({
        res,
        message: "Số điện thoại đã được sử dụng",
      });
    }
    let secretKey;
    while (true) {
      secretKey = createSecretKey();
      if (!(await User.findOne({ secretKey }))) {
        break;
      }
    }
    const otp = createOtp();
    await User.create({
      displayName,
      email,
      password: await encodePassword(password),
      phone,
      otp,
      status,
      secretKey,
      studentId,
      bio,
      avatarUrl: isValidUrl(avatarUrl) ? avatarUrl : null,
      birthDate: parsedBirthDate,
      role: getRole,
    });
    return makeSuccessResponse({ res, message: "Create user success" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const {
      id,
      displayName,
      email,
      phone,
      studentId,
      birthDate,
      bio,
      avatarUrl,
      role,
      status,
      password,
    } = req.body;
    const { user } = req;
    const updateUser = await User.findById(id);
    if (!updateUser) {
      return makeErrorResponse({ res, message: "User not found" });
    }
    if (avatarUrl != updateUser.avatarUrl) {
      await deleteFileByUrl(updateUser.avatarUrl);
    }
    const parsedBirthDate = birthDate ? parseDate(birthDate) : null;
    const getRole = await Role.findById(role);
    if (updateUser.email != email && (await User.findOne({ email }))) {
      return makeErrorResponse({ res, message: "Email đã được sử dụng" });
    }
    if (updateUser.phone != phone && (await User.findOne({ phone }))) {
      return makeErrorResponse({
        res,
        message: "Số điện thoại đã được sử dụng",
      });
    }
    if (
      updateUser.studentId != studentId &&
      (await User.findOne({ studentId }))
    ) {
      return makeErrorResponse({
        res,
        message: "Mã sinh viên đã được sử dụng",
      });
    }
    const updateData = {
      displayName,
      email,
      phone,
      status,
      studentId,
      bio,
      avatarUrl: isValidUrl(avatarUrl) ? avatarUrl : null,
      birthDate: parsedBirthDate,
      role: getRole,
    };
    if (password) {
      updateData.password = await encodePassword(password);
    }
    await User.updateOne({ _id: id }, updateData);
    if (!updateUser._id.equals(user._id)) {
      await Notification.create({
        user: updateUser._id,
        data: {
          user: {
            _id: updateUser._id,
          },
        },
        message: "Thông tin của bạn đã được quản trị viên cập nhật",
      });
    }
    return makeSuccessResponse({ res, message: "Update user success" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const errors = [];
    if (!username || !username.trim()) {
      errors.push({
        field: "username",
        message: "username cannot be null",
      });
    }
    if (!password) {
      errors.push({
        field: "password",
        message: "password cannot be null",
      });
    }
    if (errors.length > 0) {
      return makeErrorResponse({ res, data: errors, message: "Invalid form" });
    }
    const user = await User.findOne({
      $or: [{ studentId: username }, { phone: username }, { email: username }],
    });
    if (!user || !(await comparePassword(password, user.password))) {
      return makeErrorResponse({ res, message: "Sai tài khoản hoặc mật khẩu" });
    }
    if (user.status !== 1) {
      return makeErrorResponse({
        res,
        message: "Tài khoản chưa được kích hoạt",
      });
    }
    const role = await Role.findById(user.role._id);
    if (!role) {
      return makeErrorResponse({ res, message: "Role not found" });
    } else if (role.kind === 1) {
      return makeErrorResponse({
        res,
        message: "Bạn không được phép đăng nhập vào trang này",
      });
    }
    const accessToken = createToken(user._id);
    return makeSuccessResponse({
      res,
      message: "Login success",
      data: { accessToken },
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export {
  loginUser,
  getUserProfile,
  forgotUserPassword,
  resetUserPassword,
  registerUser,
  verifyUser,
  requestChangeUserKeyInformation,
  updateUserProfile,
  verifyToken,
  deleteUser,
  getUsers,
  getUser,
  createUser,
  updateUser,
  loginAdmin,
  verifyChangeUserKeyInformation,
};
