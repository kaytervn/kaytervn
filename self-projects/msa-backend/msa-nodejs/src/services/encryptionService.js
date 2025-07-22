import CryptoJS from "crypto-js";
import forge from "node-forge";

const encrypt = (secret, value) => {
  try {
    return CryptoJS.AES.encrypt(value, secret).toString();
  } catch {
    return null;
  }
};

const decrypt = (secret, encryptedValue) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedValue, secret);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
};

const encryptAES = (secretKey, plainText) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(
      plainText,
      CryptoJS.enc.Utf8.parse(secretKey),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  } catch {
    return null;
  }
};

const decryptAES = (secretKey, encryptedStr) => {
  try {
    let decrypted = CryptoJS.AES.decrypt(
      encryptedStr,
      CryptoJS.enc.Utf8.parse(secretKey),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  } catch {
    return null;
  }
};

const decryptData = (secretKey, item, fields) => {
  const decryptedItem = { ...item };

  fields.forEach((field) => {
    const keys = field.split(".");
    let current = decryptedItem;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    }

    const finalKey = keys[keys.length - 1];
    if (current[finalKey]) {
      current[finalKey] = decryptAES(secretKey, current[finalKey]);
    }
  });

  return decryptedItem;
};

const encryptData = (secretKey, item, fields) => {
  const encryptedItem = { ...item };

  fields.forEach((field) => {
    const keys = field.split(".");
    let current = encryptedItem;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    }

    const finalKey = keys[keys.length - 1];
    if (current[finalKey]) {
      current[finalKey] = encryptAES(secretKey, current[finalKey]);
    }
  });

  return encryptedItem;
};

const decryptRSA = (privateKeyRaw, encryptedBase64) => {
  try {
    const privateKeyBytes = forge.util.decode64(privateKeyRaw);
    const privateAsn1 = forge.asn1.fromDer(
      forge.util.createBuffer(privateKeyBytes)
    );
    const privateKey = forge.pki.privateKeyFromAsn1(privateAsn1);

    const encryptedBytes = forge.util.decode64(encryptedBase64);
    const decryptedBytes = privateKey.decrypt(
      encryptedBytes,
      "RSAES-PKCS1-V1_5"
    );

    return forge.util.decodeUtf8(decryptedBytes);
  } catch {
    return null;
  }
};

const encryptRSA = (publicKeyRawBase64, data) => {
  try {
    const rawBytes = forge.util.decode64(publicKeyRawBase64);
    const publicAsn1 = forge.asn1.fromDer(forge.util.createBuffer(rawBytes));
    const publicKey = forge.pki.publicKeyFromAsn1(publicAsn1);

    const encryptedBytes = publicKey.encrypt(data, "RSAES-PKCS1-V1_5");
    return forge.util.encode64(encryptedBytes);
  } catch {
    return null;
  }
};

const extractBase64FromPem = (pem) => {
  return pem.replace(/-----.*-----/g, "").replace(/\s+/g, "");
};

export {
  encrypt,
  decrypt,
  encryptAES,
  decryptAES,
  decryptData,
  encryptData,
  decryptRSA,
  encryptRSA,
  extractBase64FromPem,
};
