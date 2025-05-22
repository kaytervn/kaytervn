import express from "express";
import auth from "../middlewares/authentication.js";
import {
  createRole,
  getRole,
  getRoles,
  updateRole,
} from "../controllers/roleController.js";
const router = express.Router();

router.post("/create", auth("ROLE_C"), createRole);
router.put("/update", auth("ROLE_U"), updateRole);
router.get("/get/:id", auth("ROLE_V"), getRole);
router.get("/list", auth("ROLE_L"), getRoles);

export { router as roleRouter };
