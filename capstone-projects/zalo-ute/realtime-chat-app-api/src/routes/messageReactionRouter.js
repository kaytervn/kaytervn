import express from "express";
import auth from "../middlewares/authentication.js";
import {
  createMessageReaction,
  deleteMessageReaction,
  getMessageReactions,
} from "../controllers/messageReactionController.js";
const router = express.Router();

router.post("/create", auth("MES_R_C"), createMessageReaction);
router.delete("/delete/:id", auth("MES_R_D"), deleteMessageReaction);
router.get("/list", auth("MES_R_L"), getMessageReactions);

export { router as messageReactionRouter };
