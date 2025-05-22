import express from "express";
import auth from "../middlewares/authentication.js";
import {
  createCommentReaction,
  deleteCommentReaction,
  getCommentReactions,
} from "../controllers/commentReactionController.js";
const router = express.Router();

router.post("/create", auth("COM_R_C"), createCommentReaction);
router.delete("/delete/:id", auth("COM_R_D"), deleteCommentReaction);
router.get("/list", auth("COM_R_L"), getCommentReactions);

export { router as commentReactionRouter };
