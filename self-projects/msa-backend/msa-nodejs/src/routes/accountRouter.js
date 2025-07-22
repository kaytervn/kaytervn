import express from "express";
import { bearerAuth } from "../middlewares/auth.js";
import {
  createAccount,
  updateAccount,
  deleteAccount,
  getAccount,
  getListAccounts,
} from "../controllers/accountController.js";

const router = express.Router();

router.post("/create", bearerAuth, createAccount);
router.put("/update", bearerAuth, updateAccount);
router.delete("/delete/:id", bearerAuth, deleteAccount);
router.get("/get/:id", bearerAuth, getAccount);
router.get("/list", bearerAuth, getListAccounts);

export { router as accountRouter };
