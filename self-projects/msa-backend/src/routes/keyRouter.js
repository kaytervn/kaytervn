import express from "express";
import { inputKey } from "../controllers/keyController.js";

const router = express.Router();
router.post("/input-key", inputKey);

export { router as keyRouter };
