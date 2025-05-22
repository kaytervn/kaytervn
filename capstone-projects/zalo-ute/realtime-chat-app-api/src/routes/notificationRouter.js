import express from "express";
import auth from "../middlewares/authentication.js";
import {
  getMyNotifications,
  readNotification,
  readAllNotifications,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notificationController.js";
const router = express.Router();

router.get("/list", auth("NO_L"), getMyNotifications);
router.put("/read/:id", auth(""), readNotification);
router.put("/read-all", auth(""), readAllNotifications);
router.delete("/delete/:id", auth(""), deleteNotification);
router.delete("/delete-all", auth("NO_D"), deleteAllNotifications);

export { router as notificationRouter };
