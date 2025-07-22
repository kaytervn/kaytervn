import crypto from "crypto";
import forge from "node-forge";
import otpGenerator from "otp-generator";

const generateRSAKeyPair = () => {
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });

  const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
  const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);

  return {
    publicKey: publicKeyPem,
    privateKey: privateKeyPem,
  };
};

const generateOTP = (length) => {
  return otpGenerator.generate(length, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

const generateRandomString = (length) => {
  return otpGenerator.generate(length, {
    digits: true,
    lowerCaseAlphabets: true,
    upperCaseAlphabets: true,
    specialChars: false,
  });
};

const generateMd5 = (text) => {
  return crypto.createHash("md5").update(text).digest("hex");
};

const generateTimestamp = () => {
  return Date.now().toString();
};

const generateSecretKey = (secret) => {
  return crypto.createHash("sha256").update(secret).digest();
};

export {
  generateRSAKeyPair,
  generateOTP,
  generateRandomString,
  generateMd5,
  generateTimestamp,
  generateSecretKey,
};
