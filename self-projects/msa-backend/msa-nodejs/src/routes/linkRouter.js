import express from "express";
import { bearerAuth } from "../middlewares/auth.js";
import {
  createLink,
  updateLink,
  deleteLink,
  getLink,
  getListLinks,
} from "../controllers/linkController.js";

const router = express.Router();

router.post("/create", bearerAuth, createLink);
router.put("/update", bearerAuth, updateLink);
router.delete("/delete/:id", bearerAuth, deleteLink);
router.get("/get/:id", bearerAuth, getLink);
router.get("/list", bearerAuth, getListLinks);

export { router as linkRouter };
