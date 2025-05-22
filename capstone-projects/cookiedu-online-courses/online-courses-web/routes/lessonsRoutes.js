import express from "express";
import auth from "../middlewares/auth.js";
import {
  createLesson,
  deleteLesson,
  getCourseLessons,
  getLesson,
  updateLesson,
} from "../controllers/lessonsController.js";

const router = express.Router();

router.post("/get-course-lessons", getCourseLessons);

router.delete("/delete-lesson/:id", auth, deleteLesson);

router.put("/update-lesson/:id", auth, updateLesson);

router.post("/create-lesson", auth, createLesson);

router.get("/get-lesson/:id", getLesson);

export { router as lessonsRoutes };
