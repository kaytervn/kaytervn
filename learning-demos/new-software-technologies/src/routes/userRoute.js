import express from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/get/:id", getUserById);

router.post("/create", createUser);

router.put("/update/:id", updateUser);

router.delete("/delete/:id", deleteUser);

router.get("/list", getAllUsers);

export { router as usersRoutes };
