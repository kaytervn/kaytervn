import express from "express";
import multer from "multer";
import nLessonsAuth from "../middlewares/nLessonAuth.js";
import { deleteFile, uploadFile } from "../controllers/cloudinaryController.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/upload", nLessonsAuth(), upload.single("file"), uploadFile);
router.put("/delete", nLessonsAuth(), deleteFile);

export { router as cloudinaryRouter };
