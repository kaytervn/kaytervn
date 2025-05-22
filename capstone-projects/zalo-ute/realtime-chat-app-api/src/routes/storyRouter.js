import express from "express";
import auth from "../middlewares/authentication.js";
import {
  createStory,
  deleteStory,
  getStories,
  getStory,
} from "../controllers/storyController.js";
const router = express.Router();

router.post("/create", auth("ST_C"), createStory);
router.get("/get/:id", auth("ST_V"), getStory);
router.delete("/delete/:id", auth("ST_D"), deleteStory);
router.get("/list", auth("ST_L"), getStories);

export { router as storyRouter };
