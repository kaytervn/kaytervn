import Lesson from "../models/lessonModel.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";

const createLesson = async (req, res) => {
  try {
    const { title, description, document, category } = req.body;

    if (!title || !title.trim()) {
      return makeErrorResponse({
        res,
        message: "Title cannot be null",
      });
    }

    const lessonData = {
      title,
      description,
      document,
      category,
    };

    const lesson = await Lesson.create(lessonData);

    return makeSuccessResponse({
      res,
      message: "Create lesson success",
      data: lesson,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { id, title, description, document, category } = req.body;

    if (!title || !title.trim()) {
      return makeErrorResponse({
        res,
        message: "Title cannot be null",
      });
    }

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return makeErrorResponse({ res, message: "Lesson not found" });
    }

    const updateData = {
      title,
      description,
      document,
      category,
    };

    await lesson.updateOne(updateData);

    return makeSuccessResponse({
      res,
      message: "Lesson updated",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const id = req.params.id;
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return makeErrorResponse({ res, message: "Lesson not found" });
    }

    await lesson.deleteOne();

    return makeSuccessResponse({
      res,
      message: "Lesson deleted",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getLesson = async (req, res) => {
  try {
    const id = req.params.id;
    const lesson = await Lesson.findById(id).populate("category", "name");
    if (!lesson) {
      return makeErrorResponse({ res, message: "Lesson not found" });
    }

    return makeSuccessResponse({
      res,
      data: lesson,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListLessons = async (req, res) => {
  try {
    const { category } = req.query;

    const query = category ? { category } : {};

    const lessons = await Lesson.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return makeSuccessResponse({
      res,
      data: { content: lessons },
    });
  } catch (error) {
    return makeErrorResponse({
      res,
      message: error.message,
    });
  }
};

export { createLesson, updateLesson, deleteLesson, getLesson, getListLessons };
