import express from "express";
import { bearerAuth } from "../middlewares/auth.js";
import {
  createBank,
  updateBank,
  deleteBank,
  getBank,
  getListBanks,
} from "../controllers/bankController.js";

const router = express.Router();

router.post("/create", bearerAuth, createBank);
router.put("/update", bearerAuth, updateBank);
router.delete("/delete/:id", bearerAuth, deleteBank);
router.get("/get/:id", bearerAuth, getBank);
router.get("/list", bearerAuth, getListBanks);

export { router as bankRouter };
