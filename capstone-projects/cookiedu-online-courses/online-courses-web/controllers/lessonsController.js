import mongoose from "mongoose";
import Course from "../models/CourseModel.js";
import Lesson from "../models/LessonModel.js";
import Role from "../models/RoleEnum.js";
import User from "../models/UserModel.js";

const getCourseLessons = async (req, res) => {
  const { courseId } = req.body;
  try {
    const lessons = await Lesson.find({
      courseId: courseId,
      status: true,
    }).sort({
      title: 1,
    });
    res.status(200).json({ lessons, courseId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteLesson = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Incorrect ID" });
  }

  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) {
    return res.status(400).json({ error: "Lesson Not Found" });
  }

  const course = await Course.findById(lesson.courseId);
  const user = await User.findById(req.user._id);
  if (!(course.userId.equals(user._id) && user.role == Role.INSTRUCTOR)) {
    return res.status(401).json({ error: "Not authorized" });
  }

  try {
    await lesson.updateOne({ status: false });
    return res.status(200).json({
      success: "Lesson safely deleted",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createLesson = async (req, res) => {
  const { title, description, courseId } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const course = await Course.findById(courseId);
  const user = await User.findById(req.user._id);
  if (!(course.userId.equals(user._id) && user.role == Role.INSTRUCTOR)) {
    return res.status(401).json({ error: "Not authorized" });
  }

  try {
    const lesson = await Lesson.create({
      courseId: course._id,
      title,
      description,
    });
    return res.status(200).json({ lesson });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateLesson = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Incorrect ID" });
  }

  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) {
    return res.status(400).json({ error: "Lesson Not Found" });
  }

  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const course = await Course.findById(lesson.courseId);
  const user = await User.findById(req.user._id);
  if (!(course.userId.equals(user._id) && user.role == Role.INSTRUCTOR)) {
    return res.status(401).json({ error: "Not authorized" });
  }

  try {
    await lesson.updateOne({ title, description });
    return res.status(200).json({
      success: "Lesson updated",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    res.status(200).json({ lesson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getCourseLessons,
  deleteLesson,
  createLesson,
  updateLesson,
  getLesson,
};
