import express from "express";
import {
  registerUser,
  loginUser,
  activateUser,
} from "../controllers/usersController.js";
import mailSending from "../controllers/emailController.js";

const router = express.Router();

router.post("/", registerUser);

router.post("/mail", mailSending);

router.post("/login", loginUser);

router.post("/activate", activateUser);

export { router as usersRoutes };
