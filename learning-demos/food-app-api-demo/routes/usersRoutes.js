import express from "express";
import {
  loginUser,
  registerUser,
  updateUser,
  getUser,
  resetPassword,
  forgetPassword,
} from "../controllers/usersController.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/:id", getUser);

router.post("/", registerUser);

router.post("/login", loginUser);

router.put("/:id", upload.single("image"), updateUser);

router.post("/reset-password", resetPassword);

router.post("/forget-password", forgetPassword);

export { router as usersRoutes };
