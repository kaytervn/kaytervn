import express from "express";
import {
  createLesson,
  updateLesson,
  deleteLesson,
  getLesson,
  getListLessons,
} from "../controllers/lessonController.js";
import nLessonsAuth from "../middlewares/nLessonAuth.js";

const router = express.Router();

router.post("/create", nLessonsAuth(), createLesson);
router.put("/update", nLessonsAuth(), updateLesson);
router.get("/get/:id", nLessonsAuth(), getLesson);
router.delete("/delete/:id", nLessonsAuth(), deleteLesson);
router.get("/list", getListLessons);

export { router as lessonRouter };
