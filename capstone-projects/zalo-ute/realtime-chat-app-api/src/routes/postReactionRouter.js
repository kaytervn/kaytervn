import express from "express";
import auth from "../middlewares/authentication.js";
import {
  createPostReaction,
  deletePostReaction,
  getPostReactions,
} from "../controllers/postReactionController.js";
const router = express.Router();

router.post("/create", auth("POST_R_C"), createPostReaction);
router.delete("/delete/:id", auth("POST_R_D"), deletePostReaction);
router.get("/list", auth("POST_R_L"), getPostReactions);

export { router as postReactionRouter };
