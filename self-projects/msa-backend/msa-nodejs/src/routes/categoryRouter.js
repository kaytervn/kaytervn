import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
  getListCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import nLessonsAuth from "../middlewares/nLessonAuth.js";

const router = express.Router();

router.post("/create", nLessonsAuth(), createCategory);
router.put("/update", nLessonsAuth(), updateCategory);
router.get("/get/:id", nLessonsAuth(), getCategory);
router.delete("/delete/:id", nLessonsAuth(), deleteCategory);
router.get("/list", getListCategories);

export { router as categoryRouter };
