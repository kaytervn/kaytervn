import nodemailer from "nodemailer";
import { getConfigValue } from "../config/appProperties.js";
import { CONFIG_KEY, TOTP } from "../utils/constant.js";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { formatDate } from "../config/schemaConfig.js";

const makeErrorResponse = ({ res, code, message, data }) => {
  return res.status(400).json({ result: false, code, message, data });
};

const makeUnauthorizedExecption = ({ res, code, message, data }) => {
  return res.status(401).json({ result: false, code, message, data });
};

const makeSuccessResponse = ({ res, message, data }) => {
  return res.status(200).json({ result: true, message, data });
};

const sendEmail = async ({ receiver, email, otp, subject }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: getConfigValue(CONFIG_KEY.NODEMAILER_USER),
      pass: getConfigValue(CONFIG_KEY.NODEMAILER_PASS),
    },
  });

  const templatesDir = path.resolve("./src/templates");

  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extname: ".hbs",
        partialsDir: templatesDir,
        defaultLayout: false,
      },
      viewPath: templatesDir,
      extName: ".hbs",
    })
  );

  const mailOptions = {
    from: `${TOTP.ISSUER} <${getConfigValue(CONFIG_KEY.NODEMAILER_USER)}>`,
    to: email,
    subject,
    template: "account-verification",
    context: {
      receiver,
      code: otp,
      date: formatDate(new Date()),
    },
  };
  await transporter.sendMail(mailOptions);
};

export {
  makeErrorResponse,
  makeSuccessResponse,
  makeUnauthorizedExecption,
  sendEmail,
};
