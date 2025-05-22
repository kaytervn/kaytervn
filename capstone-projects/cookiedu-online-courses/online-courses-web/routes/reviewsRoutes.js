import express from "express";

import auth from "../middlewares/auth.js";
import {
  createReview,
  getReviewCourse,
  getMyReviewForCourse,
} from "../controllers/reviewsController.js";

const router = express.Router();

router.post("/create_review/:courseId", auth, createReview);

router.get("/get-review-course/:courseId", getReviewCourse);

router.get("/get-my-review-for-course/:courseId", auth, getMyReviewForCourse);

export { router as reviewsRoutes };
