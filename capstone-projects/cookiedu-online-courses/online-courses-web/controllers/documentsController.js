import mongoose from "mongoose";
import Course from "../models/CourseModel.js";
import Document from "../models/DocumentModel.js";
import Lesson from "../models/LessonModel.js";
import Role from "../models/RoleEnum.js";
import User from "../models/UserModel.js";
import cloudinary from "../utils/cloudinary.js";

const getLessonDocuments = async (req, res) => {
  const { lessonId } = req.body;
  try {
    const documents = await Document.find({
      lessonId: lessonId,
    }).sort({
      title: 1,
    });
    res.status(200).json({ documents, lessonId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const { title, description, lessonId } = req.body;

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    return res.status(400).json({ error: "Lesson Not Found" });
  }

  if (!title || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const course = await Course.findById(lesson.courseId);
  const user = await User.findById(req.user._id);
  if (!(course.userId.equals(user._id) && user.role == Role.INSTRUCTOR)) {
    return res.status(401).json({ error: "Not authorized" });
  }

  try {
    const uploadResponse = await new Promise((resolve, reject) => {
      const bufferData = req.file.buffer;
      cloudinary.uploader
        .upload_stream({ resource_type: "video" }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(bufferData);
    });
    const document = await Document.create({
      lessonId: lesson._id,
      cloudinary: uploadResponse.public_id,
      content: uploadResponse.secure_url,
      title,
      description,
    });
    return res.status(200).json({ document });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteDocument = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Incorrect ID" });
  }

  const document = await Document.findById(req.params.id);
  if (!document) {
    return res.status(404).json({ error: "Document not found" });
  }

  const lesson = await Lesson.findById(document.lessonId);
  const course = await Course.findById(lesson.courseId);
  const user = await User.findById(req.user._id);
  if (!(course.userId.equals(user._id) && user.role == Role.INSTRUCTOR)) {
    return res.status(401).json({ error: "Not authorized" });
  }

  if (document.cloudinary) {
    await cloudinary.uploader.destroy(document.cloudinary);
  }

  try {
    await document.deleteOne();
    return res.status(200).json({ success: "Document deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { getLessonDocuments, createDocument, deleteDocument };
