import express from "express";
import auth from "../middlewares/authentication.js";
import { sendMessageGenAi } from "../services/geminiService.js";
const router = express.Router();

router.post("/send-message", auth(), sendMessageGenAi);

export { router as geminiRouter };
