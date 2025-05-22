import nodemailer from "nodemailer";
import { getConfigValue } from "../config/appProperties.js";
import { CONFIG_KEY } from "../utils/constant.js";

const makeErrorResponse = ({ res, code, message, data }) => {
  return res.status(400).json({ result: false, code, message, data });
};

const makeUnauthorizedExecption = ({ res, code, message, data }) => {
  return res.status(401).json({ result: false, code, message, data });
};

const makeSuccessResponse = ({ res, message, data }) => {
  return res.status(200).json({ result: true, message, data });
};

const sendEmail = async ({ email, otp, subject }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: getConfigValue(CONFIG_KEY.NODEMAILER_USER),
      pass: getConfigValue(CONFIG_KEY.NODEMAILER_PASS),
    },
  });
  const mailOptions = {
    from: `NO REPLY <${getConfigValue(CONFIG_KEY.NODEMAILER_USER)}>`,
    to: email,
    subject,
    text: `OTP: ${otp}`,
  };
  await transporter.sendMail(mailOptions);
};

export {
  makeErrorResponse,
  makeSuccessResponse,
  makeUnauthorizedExecption,
  sendEmail,
};
