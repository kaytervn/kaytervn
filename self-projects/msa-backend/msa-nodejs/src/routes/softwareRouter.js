import express from "express";
import { bearerAuth } from "../middlewares/auth.js";
import {
  createSoftware,
  updateSoftware,
  deleteSoftware,
  getSoftware,
  getListSoftwares,
} from "../controllers/softwareController.js";

const router = express.Router();

router.post("/create", bearerAuth, createSoftware);
router.put("/update", bearerAuth, updateSoftware);
router.delete("/delete/:id", bearerAuth, deleteSoftware);
router.get("/get/:id", bearerAuth, getSoftware);
router.get("/list", bearerAuth, getListSoftwares);

export { router as softwareRouter };
