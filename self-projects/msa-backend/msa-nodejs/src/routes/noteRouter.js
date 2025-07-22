import express from "express";
import { bearerAuth } from "../middlewares/auth.js";
import {
  createNote,
  updateNote,
  deleteNote,
  getNote,
  getListNotes,
} from "../controllers/noteController.js";

const router = express.Router();

router.post("/create", bearerAuth, createNote);
router.put("/update", bearerAuth, updateNote);
router.delete("/delete/:id", bearerAuth, deleteNote);
router.get("/get/:id", bearerAuth, getNote);
router.get("/list", bearerAuth, getListNotes);

export { router as noteRouter };
