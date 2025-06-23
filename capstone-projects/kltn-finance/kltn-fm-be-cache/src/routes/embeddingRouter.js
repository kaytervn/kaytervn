import express from "express";
import auth from "../middlewares/authentication.js";
import {
  deleteFaceId,
  getListEmbeddings,
} from "../services/embeddingService.js";
const router = express.Router();

router.get("/list", auth(), getListEmbeddings);
router.delete("/delete/:id", auth(), deleteFaceId);

export { router as embeddingRouter };
