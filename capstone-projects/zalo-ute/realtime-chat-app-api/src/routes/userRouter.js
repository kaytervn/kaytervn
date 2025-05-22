import express from "express";
import {
  loginUser,
  getUserProfile,
  resetUserPassword,
  forgotUserPassword,
  registerUser,
  verifyUser,
  updateUserProfile,
  verifyToken,
  deleteUser,
  getUser,
  createUser,
  updateUser,
  loginAdmin,
  getUsers,
  requestChangeUserKeyInformation,
  verifyChangeUserKeyInformation,
} from "../controllers/userController.js";
import auth from "../middlewares/authentication.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/verify-token", verifyToken);
router.get("/profile", auth(""), getUserProfile);
router.post("/register", registerUser);
router.post("/verify", verifyUser);
router.post("/reset-password", resetUserPassword);
router.post("/forgot-password", forgotUserPassword);
router.put("/update-profile", auth(""), updateUserProfile);
router.delete("/delete/:id", auth("USER_D"), deleteUser);
router.get("/list", auth("USER_L"), getUsers);
router.get("/get/:id", auth("USER_V"), getUser);
router.post("/create", auth("USER_C"), createUser);
router.put("/update", auth("USER_U"), updateUser);
router.post("/login-admin", loginAdmin);
router.post("/request-key-change", auth(""), requestChangeUserKeyInformation);
router.post("/verify-key-change", auth(""), verifyChangeUserKeyInformation);

export { router as userRouter };
