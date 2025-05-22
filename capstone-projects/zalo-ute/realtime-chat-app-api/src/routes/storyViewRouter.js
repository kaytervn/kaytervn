import express from "express";
import auth from "../middlewares/authentication.js";
import { getStoryViews } from "../controllers/storyViewController.js";
const router = express.Router();

router.get("/list", auth("ST_V_L"), getStoryViews);

export { router as storyViewRouter };
