import express from "express";
import auth from "../middlewares/auth.js";
import {
  createComment,
  getLessonComments,
} from "../controllers/commentsController.js";

const router = express.Router();

router.post("/get-lesson-comments", getLessonComments);

router.post("/create-comment", auth, createComment);

export { router as commentsRoutes };
