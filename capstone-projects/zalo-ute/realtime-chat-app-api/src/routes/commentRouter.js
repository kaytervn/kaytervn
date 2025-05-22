import express from "express";
import auth from "../middlewares/authentication.js";
import {
  createComment,
  updateComment,
  deleteComment,
  getComment,
  getComments,
} from "../controllers/commentController.js";
const router = express.Router();

router.post("/create", auth("COM_C"), createComment);
router.put("/update", auth("COM_U"), updateComment);
router.get("/get/:id", auth("COM_V"), getComment);
router.delete("/delete/:id", auth("COM_D"), deleteComment);
router.get("/list", auth("COM_L"), getComments);

export { router as commentRouter };
