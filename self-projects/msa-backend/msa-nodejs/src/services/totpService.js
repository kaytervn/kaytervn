import { TOTP } from "../utils/constant.js";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

const setup2FA = async (username) => {
  const secret = speakeasy.generateSecret({
    name: `${TOTP.ISSUER}:${username}`,
  });

  const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

  return {
    qrCodeUrl,
    secret: secret.base32,
  };
};

const verify2FA = (userInputCode, userSecretFromDB) => {
  const verified = speakeasy.totp.verify({
    secret: userSecretFromDB,
    encoding: "base32",
    token: userInputCode,
    window: 1,
  });

  return verified;
};

export { setup2FA, verify2FA };
