import express from "express";
import { bearerAuth } from "../middlewares/auth.js";
import {
  createIdNumber,
  updateIdNumber,
  deleteIdNumber,
  getIdNumber,
  getListIdNumbers,
} from "../controllers/idNumberController.js";

const router = express.Router();

router.post("/create", bearerAuth, createIdNumber);
router.put("/update", bearerAuth, updateIdNumber);
router.delete("/delete/:id", bearerAuth, deleteIdNumber);
router.get("/get/:id", bearerAuth, getIdNumber);
router.get("/list", bearerAuth, getListIdNumbers);

export { router as idNumberRouter };
