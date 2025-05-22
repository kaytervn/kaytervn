import express from "express";
import auth from "../middlewares/authentication.js";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getListFriendships,
  deleteFriendRequest,
  toggleFollowFriend,
} from "../controllers/friendshipController.js";
const router = express.Router();

router.post("/send", auth("FR_C"), sendFriendRequest);
router.put("/accept", auth(""), acceptFriendRequest);
router.put("/reject", auth(""), rejectFriendRequest);
router.put("/follow", auth(""), toggleFollowFriend);
router.get("/list", auth("FR_L"), getListFriendships);
router.delete("/delete/:id", auth("FR_D"), deleteFriendRequest);

export { router as friendshipRouter };
