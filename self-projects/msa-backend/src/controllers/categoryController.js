import Category from "../models/categoryModel.js";
import Lesson from "../models/lessonModel.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return makeErrorResponse({
        res,
        message: "Name cannot be null",
      });
    }
    await Category.create({ name });
    return makeSuccessResponse({
      res,
      message: "Create category success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!name || !name.trim()) {
      return makeErrorResponse({
        res,
        message: "Name cannot be null",
      });
    }
    const category = await Category.findById(id);
    if (!category) {
      return makeErrorResponse({ res, message: "Category not found" });
    }
    await category.updateOne({ name });
    return makeSuccessResponse({ res, message: "Category updated" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) {
      return makeErrorResponse({ res, message: "Category not found" });
    }
    const isUsed = await Lesson.exists({ category: id });
    if (isUsed) {
      return makeErrorResponse({
        res,
        message: "Cannot delete category",
      });
    }
    await category.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Category deleted",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) {
      return makeErrorResponse({ res, message: "Category not found" });
    }
    return makeSuccessResponse({
      res,
      data: category,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListCategories = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "lessons",
          localField: "_id",
          foreignField: "category",
          as: "lessons",
        },
      },
      {
        $project: {
          name: 1,
          canDelete: {
            $cond: {
              if: { $eq: [{ $size: "$lessons" }, 0] },
              then: 1,
              else: 0,
            },
          },
        },
      },
      {
        $sort: { name: 1 },
      },
    ]);

    return makeSuccessResponse({
      res,
      data: { content: categories },
    });
  } catch (error) {
    return makeErrorResponse({
      res,
      message: error.message,
    });
  }
};

export {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getListCategories,
};
