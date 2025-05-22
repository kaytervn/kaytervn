import Food from "../models/FoodModel.js";
import { mongoose } from "mongoose";
import cloudinary from "../utils/cloudinary.js";

const getFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    return res.status(200).json({ food });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: "desc" });
    return res.status(200).json({ foods });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const searchFoods = async (req, res) => {
  try {
    const { title } = req.body;
    let foods;
    if (!title || title.trim() == "") {
      foods = await Food.find().sort({ createdAt: "desc" });
    } else {
      foods = await Food.find({ title: { $regex: title, $options: "i" } }).sort(
        { createdAt: "desc" }
      );
    }
    return res.status(200).json({ foods });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getFoodsLazy = async (req, res) => {
  try {
    const { page, limit } = req.body;
    const skip = (page - 1) * limit;
    const foods = await Food.find()
      .sort({ createdAt: "desc" })
      .skip(skip)
      .limit(limit);
    return res.status(200).json({ foods });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createFood = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const { title, price, description } = req.body;
  if (!title || !price || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const uploadResponse = await new Promise((resolve, reject) => {
      const bufferData = req.file.buffer;
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(bufferData);
    });
    const food = await Food.create({
      cloudinary: uploadResponse.public_id,
      image: uploadResponse.secure_url,
      title,
      price,
      description,
    });
    return res.status(200).json({ food });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteFood = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Incorrect ID" });
  }

  const food = await Food.findById(req.params.id);
  if (!food) {
    return res.status(404).json({ error: "Food not found" });
  }

  if (food.cloudinary) {
    await cloudinary.uploader.destroy(food.cloudinary);
  }

  try {
    await food.deleteOne();
    return res.status(200).json({ success: "Food deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { getFoods, createFood, deleteFood, getFood, searchFoods, getFoodsLazy };
