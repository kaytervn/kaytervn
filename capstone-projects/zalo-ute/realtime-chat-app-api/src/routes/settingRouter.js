import express from "express";
import auth from "../middlewares/authentication.js";
import {
  createSetting,
  getSetting,
  getSettings,
  updateSetting,
} from "../controllers/settingController.js";
const router = express.Router();

router.post("/create", auth("SET_C"), createSetting);
router.put("/update", auth("SET_U"), updateSetting);
router.get("/get/:id", auth("SET_V"), getSetting);
router.get("/list", auth("SET_L"), getSettings);

export { router as settingRouter };
