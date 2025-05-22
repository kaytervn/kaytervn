import express from "express";
import auth from "../middlewares/authentication.js";
import {
  createMessage,
  updateMessage,
  deleteMessage,
  getMessage,
  getMessages,
} from "../controllers/messageController.js";
const router = express.Router();

router.post("/create", auth("MES_C"), createMessage);
router.put("/update", auth("MES_U"), updateMessage);
router.get("/get/:id", auth("MES_V"), getMessage);
router.delete("/delete/:id", auth("MES_D"), deleteMessage);
router.get("/list", auth("MES_L"), getMessages);

export { router as messageRouter };
