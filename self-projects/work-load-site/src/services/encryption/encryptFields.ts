const ENCRYPT_FIELDS = {
  TOKEN: ["secretKey"],
  REQUEST_KEY_FORM: ["password"],
  LOGIN_FORM: ["username", "password", "totp"],
  REQUEST_FORGOT_PASSWORD_FORM: ["email"],
  REQUEST_MFA_FORM: ["email", "password"],
  RESET_PASSWORD_FORM: ["userId", "newPassword", "otp"],
  USER: ["email", "username", "password", "secret", "code"],
  ACCOUNT: ["username", "password", "note"],
  PLATFORM: ["name"],
  CREATE_PLATFORM: ["name"],
  UPDATE_PLATFORM: ["id", "name"],
  CHANGE_PASSWORD_FORM: ["oldPassword", "newPassword", "confirmPassword"],
};

export { ENCRYPT_FIELDS };
