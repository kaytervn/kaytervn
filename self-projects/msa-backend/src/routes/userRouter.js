import express from "express";
import {
  loginUser,
  verifyCredential,
  requestForgotPassword,
  resetUserPassword,
  requestResetMfa,
  resetUserMfa,
  getMyKey,
  requestKey,
  verifyUserToken,
  changeUserPassword,
} from "../controllers/userController.js";
import { clearKey } from "../controllers/keyController.js";
import { basicAuth, bearerAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", basicAuth, loginUser);
router.post("/verify-credential", verifyCredential);
router.post("/request-forgot-password", requestForgotPassword);
router.post("/reset-password", resetUserPassword);
router.post("/reset-mfa", resetUserMfa);
router.post("/request-reset-mfa", requestResetMfa);
router.get("/my-key", bearerAuth, getMyKey);
router.post("/request-key", bearerAuth, requestKey);
router.get("/clear-key", bearerAuth, clearKey);
router.get("/verify-token", bearerAuth, verifyUserToken);
router.put("/change-password", bearerAuth, changeUserPassword);

export { router as userRouter };
