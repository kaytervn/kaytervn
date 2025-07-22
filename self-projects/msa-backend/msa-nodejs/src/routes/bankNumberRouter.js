import express from "express";
import { bearerAuth } from "../middlewares/auth.js";
import {
  createBankNumber,
  updateBankNumber,
  deleteBankNumber,
  getBankNumber,
  getListBankNumbers,
} from "../controllers/bankNumberController.js";

const router = express.Router();

router.post("/create", bearerAuth, createBankNumber);
router.put("/update", bearerAuth, updateBankNumber);
router.delete("/delete/:id", bearerAuth, deleteBankNumber);
router.get("/get/:id", bearerAuth, getBankNumber);
router.get("/list", bearerAuth, getListBankNumbers);

export { router as bankNumberRouter };
