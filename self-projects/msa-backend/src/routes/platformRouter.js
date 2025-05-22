import express from "express";
import {
  createPlatform,
  updatePlatform,
  deletePlatform,
  getPlatform,
  getListPlatforms,
} from "../controllers/platformController.js";
import { bearerAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", bearerAuth, createPlatform);
router.put("/update", bearerAuth, updatePlatform);
router.delete("/delete/:id", bearerAuth, deletePlatform);
router.get("/get/:id", bearerAuth, getPlatform);
router.get("/list", bearerAuth, getListPlatforms);

export { router as platformRouter };
