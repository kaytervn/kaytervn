import express from "express";
import {
  addPost,
  getPosts,
  getUserPosts,
  deletePost,
  updatePost,
} from "../controllers/postsController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getPosts);

router.get("/user", auth, getUserPosts);

router.post("/", auth, addPost);

router.delete("/:id", auth, deletePost);

router.put("/:id", auth, updatePost);

export { router as postsRoutes };
