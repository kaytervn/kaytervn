import mongoose from "mongoose";
import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";

const addImage = async (_id, image) => {
  const chunkSize = 50000;
  const chunks = image.match(new RegExp(`.{1,${chunkSize}}`, "g"));
  const postData = chunks.reduce(
    (acc, chunk, index) => {
      acc[`image${index + 1}`] = chunk;
      return acc;
    },
    { _id }
  );

  await fetch("https://sheetdb.io/api/v1/nvaq9sg9hwb1u?sheet=Post", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: [postData],
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
};

const deleteImage = async (_id) => {
  await fetch(`https://sheetdb.io/api/v1/nvaq9sg9hwb1u/_id/${_id}?sheet=Post`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: "desc" });

    const response = await fetch(
      "https://sheetdb.io/api/v1/nvaq9sg9hwb1u?sheet=Post"
    );
    const data = await response.json();
    for (const item of data) {
      for (const post of posts) {
        if (post._id == item._id) {
          post.image = Object.values(item).slice(1).join("");
        }
      }
    }

    res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getUserPosts = async (req, res) => {
  const user = await User.findById(req.user._id);

  try {
    const posts = await Post.find({ user: user._id }).sort({
      createdAt: "desc",
    });

    const response = await fetch(
      "https://sheetdb.io/api/v1/nvaq9sg9hwb1u?sheet=Post"
    );
    const data = await response.json();
    for (const item of data) {
      for (const post of posts) {
        if (post._id == item._id) {
          post.image = Object.values(item).slice(1).join("");
        }
      }
    }

    res.status(200).json({ posts, email: user.email });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addPost = async (req, res) => {
  const { title, image, body } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const user = await User.findById(req.user._id);
  try {
    const post = await Post.create({
      user: user._id,
      title,
      image: null,
      body,
    });
    if (image) {
      await addImage(post._id, image);
    }
    res.status(200).json({ message: "Post created", post });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Incorrect ID" });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(400).json({ error: "Post Not Found" });
  }
  const user = await User.findById(req.user._id);
  if (!post.user.equals(user._id)) {
    return res.status(401).json({ error: "Not authorized" });
  }
  try {
    await post.deleteOne();
    await deleteImage(post._id);
    return res.status(200).json({ success: "Post Was Deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  const { title, image, body } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Incorrect ID" });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(400).json({ error: "Post Not Found" });
  }
  const user = await User.findById(req.user._id);
  if (!post.user.equals(user._id)) {
    return res.status(401).json({ error: "Not authorized" });
  }
  try {
    await post.updateOne({ title, image: null, body });
    if (image) {
      await deleteImage(post._id);
      await addImage(post._id, image);
    }
    return res.status(200).json({ success: "Post Was Updated" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { getPosts, getUserPosts, addPost, deletePost, updatePost };
