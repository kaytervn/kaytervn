import express from "express";
import auth from "../middlewares/authentication.js";
import {
  getConversationsStatistic,
  getPostsStatistic,
  getUsersStatistic,
} from "../controllers/statisticController.js";
const router = express.Router();

router.get("/users", auth("STAT_U"), getUsersStatistic);
router.get("/conversations", auth("STAT_C"), getConversationsStatistic);
router.get("/posts", auth("STAT_P"), getPostsStatistic);

export { router as statisticRouter };
