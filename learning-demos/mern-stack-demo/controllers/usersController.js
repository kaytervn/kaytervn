import mongoose from "mongoose";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "10d" });
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Email is invalid" });
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ error: "Email is already taken" });
  }

  const salt = await bcrypt.genSalt();
  const hashed = await bcrypt.hash(password, salt);
  const code = Math.floor(Math.random() * 900000) + 100000;

  try {
    await User.create({ code, name, email, password: hashed });
    return res.status(200).json({ code, email });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Incorrect Email" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ error: "Incorrect Password" });
  }

  if (user.status != "active") {
    return res.status(400).json({ error: "User is not activated" });
  }

  try {
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const activateUser = async (req, res) => {
  const { code, email } = req.body;
  const user = await User.findOne({ email });
  if (code != user.code) {
    return res.status(400).json({ error: "Invalid code" });
  }
  try {
    await user.updateOne({ status: "active" });
    const token = createToken(user._id);
    res.status(200).json({ email: user.email, token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { registerUser, loginUser, activateUser };
