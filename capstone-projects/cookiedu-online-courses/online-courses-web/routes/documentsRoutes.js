import express from "express";
import multer from "multer";
import auth from "../middlewares/auth.js";
import {
  createDocument,
  deleteDocument,
  getLessonDocuments,
} from "../controllers/documentsController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.post("/get-lesson-documents", getLessonDocuments);

router.post("/create-document", auth, upload.single("content"), createDocument);

router.delete("/delete-document/:id", auth, deleteDocument);

export { router as documentsRoutes };
