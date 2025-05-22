import express from "express";
import auth from "../middlewares/authentication.js";
import multer from "multer";
import { deleteFile, uploadFile } from "../controllers/fileController.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/upload", auth("FILE_U"), upload.single("file"), uploadFile);
router.put("/delete", auth("FILE_D"), deleteFile);

export { router as fileRouter };
