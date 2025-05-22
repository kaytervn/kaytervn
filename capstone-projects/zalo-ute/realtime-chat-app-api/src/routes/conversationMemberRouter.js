import express from "express";
import auth from "../middlewares/authentication.js";
import {
  addMember,
  removeMember,
  getConversationMembers,
} from "../controllers/conversationMemberController.js";
const router = express.Router();

router.post("/add", auth("CON_M_C"), addMember);
router.delete("/remove/:id", auth("CON_M_D"), removeMember);
router.get("/list", auth("CON_M_L"), getConversationMembers);

export { router as conversationMemberRouter };
