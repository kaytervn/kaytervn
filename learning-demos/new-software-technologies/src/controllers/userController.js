import db from "../models/index.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
const User = db.users;

const PHONE_PATTERN = /^0[35789][0-9]{8}$/;
const PASSWORD_PATTERN = /^.{6,}$/;
const USERNAME_PATTERN =
  /^(?=.{3,20}$)(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9_]*[a-zA-Z0-9]$/;
const EMAIL_PATTERN =
  /^(?!.*[.]{2,})[a-zA-Z0-9.%]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const createUser = async (req, res) => {
  try {
    const { phone, email, username, password, gender } = req.body;
    const errors = [];
    if (!USERNAME_PATTERN.test(username)) {
      errors.push({ field: "username", message: "Username is invalid" });
    } else if (
      await User.findOne({ where: { username: username.toLowerCase() } })
    ) {
      errors.push({ field: "username", message: "Username already exists" });
    }
    if (!PHONE_PATTERN.test(phone)) {
      errors.push({ field: "phone", message: "Invalid phone number format" });
    } else if (await User.findOne({ where: { phone } })) {
      errors.push({ field: "phone", message: "Phone number already exists" });
    }
    if (!EMAIL_PATTERN.test(email)) {
      errors.push({
        field: "email",
        message: "Email must be a well-formed email address",
      });
    } else if (await User.findOne({ where: { email: email.toLowerCase() } })) {
      errors.push({ field: "email", message: "Email already exists" });
    }
    if (!PASSWORD_PATTERN.test(password)) {
      errors.push({
        field: "password",
        message: "Password must be at least 6 characters",
      });
    }
    if (gender && gender !== 0 && gender !== 1) {
      errors.push({ field: "gender", message: "Gender is invalid" });
    }
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ result: false, data: errors, message: "Invalid form" });
    }
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(password, salt);
    await User.create({
      phone,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashed,
      gender,
    });
    return res
      .status(201)
      .json({ result: true, message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ result: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ result: true, message: "User not found" });
    }
    const { phone, email, username, password, gender } = req.body;
    const errors = [];
    if (!USERNAME_PATTERN.test(username)) {
      errors.push({ field: "username", message: "Username is invalid" });
    } else if (
      await User.findOne({
        where: { username: username.toLowerCase(), id: { [Op.ne]: id } },
      })
    ) {
      errors.push({
        field: "username",
        message: "Username already exists",
      });
    }
    if (!PHONE_PATTERN.test(phone)) {
      errors.push({
        field: "phone",
        message: "Invalid phone number format",
      });
    } else if (await User.findOne({ where: { phone, id: { [Op.ne]: id } } })) {
      errors.push({
        field: "phone",
        message: "Phone number already exists",
      });
    }
    if (!EMAIL_PATTERN.test(email)) {
      errors.push({
        field: "email",
        message: "Email must be a well-formed email address",
      });
    } else if (
      await User.findOne({
        where: { email: email.toLowerCase(), id: { [Op.ne]: id } },
      })
    ) {
      errors.push({ field: "email", message: "Email already exists" });
    }
    if (!PASSWORD_PATTERN.test(password)) {
      errors.push({
        field: "password",
        message: "Password must be at least 6 characters",
      });
    }
    if (gender && gender !== 0 && gender !== 1) {
      errors.push({ field: "gender", message: "Gender is invalid" });
    }
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ result: false, data: errors, message: "Invalid form" });
    }
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(password, salt);
    await User.update(
      {
        phone,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: hashed,
        gender,
      },
      { where: { id } }
    );
    return res
      .status(200)
      .json({ result: true, message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ result: false, message: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ result: false, message: "User not found" });
    }
    await User.destroy({ where: { id: id } });
    return res
      .status(200)
      .json({ result: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ result: false, message: error });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ result: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ result: true, message: "Get user successfully", data: user });
  } catch (error) {
    res.status(500).json({ result: false, message: error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 0, size = 10, sort = "createdAt,desc", ...criteria } = req.query;
    const offset = page * size;
    const limit = parseInt(size, 10);
    const [sortField, sortDirection] = sort.split(",");
    const whereClause = {};
    for (const key in criteria) {
      if (criteria[key]) {
        whereClause[key] = { [Op.like]: `%${criteria[key].toLowerCase()}%` };
      }
    }
    const { rows: users, count: totalElements } = await User.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [[sortField, sortDirection.toUpperCase()]],
    });
    const totalPages = Math.ceil(totalElements / size);
    res.status(200).json({
      result: true,
      message: "Get list of users successfully",
      data: {
        content: users,
        totalPages,
        totalElements,
      },
    });
  } catch (error) {
    res.status(500).json({ result: false, message: error.message });
  }
};

export { createUser, updateUser, deleteUser, getUserById, getAllUsers };
