import User from "../models/UserModel.js";
import { mongoose } from "mongoose";
import cloudinary from "../utils/cloudinary.js";
import nodemailer from "nodemailer";

const getUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Incorrect ID" });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({ user });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ error: "Email is already taken" });
  }
  try {
    const newUser = await User.create({ name, email, password });
    return res.status(200).json({ user: newUser });
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

  if (password != user.password) {
    return res.status(400).json({ error: "Incorrect Password" });
  }

  try {
    res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Incorrect ID" });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  if (user.cloudinary) {
    await cloudinary.uploader.destroy(user.cloudinary);
  }
  try {
    const uploadResponse = await new Promise((resolve, reject) => {
      const bufferData = req.file.buffer;
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(bufferData);
    });
    await user.updateOne({
      image: uploadResponse.secure_url,
      cloudinary: uploadResponse.public_id,
    });
    return res.status(200).json({ success: "User updated" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await user.updateOne({ otp });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "techgadgestore@gmail.com",
        pass: "mtcfvggnwrzzpfrd",
      },
    });
    const mailOptions = {
      from: `NO REPLY <techgadgestore@gmail.com>`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword, otp } = req.body;
  if (!email || !newPassword || !otp) {
    return res
      .status(400)
      .json({ error: "Email, new password, and OTP are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    user.password = newPassword;
    user.otp = null;
    user.updateOne({ password: newPassword, otp: null });
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export {
  registerUser,
  loginUser,
  updateUser,
  getUser,
  forgetPassword,
  resetPassword,
};
