import InvoiceItem from "../models/InvoiceItemModel.js";
import Review from "../models/ReviewModel.js";
import mongoose from "mongoose";

const createReview = async (req, res) => {
  const { courseId, reviewData } = req.body; // Trích xuất reviewData từ req.body
  const userId = req.user._id;
  try {
    const invoiceRecord = await InvoiceItem.findOne({ courseId });

    if (!invoiceRecord || !invoiceRecord.invoiceId) {
      console.log("Invoice record not found or no invoiceId.");
      return res
        .status(403)
        .json({ message: "You must purchase the course to review it." });
    }

    const alreadyReviewed = await Review.findOne({ userId, courseId });
    if (alreadyReviewed) {
      console.log("Already reviewed.");
      return res
        .status(400)
        .json({ message: "You have already reviewed this course." });
    }

    const review = new Review({
      userId,
      courseId,
      ratingStar: reviewData.ratingStar,
      content: reviewData.content, // Sử dụng content từ reviewData
    });
    await review.save();
    console.log("Review data", review);

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error("Error creating review", error);
    res
      .status(500)
      .json({ message: "Failed to add review", error: error.message });
  }
};

const getReviewCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const reviews = await Review.find({ courseId }).populate({
      path: "userId",
      select: "name",
    });

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this course." });
    }

    res.status(200).json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve reviews", error: error.message });
  }
};
const getMyReviewForCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  try {
    const review = await Review.findOne({ userId, courseId }).populate({
      path: "userId",
      select: "name",
    });

    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found for this course." });
    }

    res.status(200).json(review);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve review", error: error.message });
  }
};

export { createReview, getReviewCourse, getMyReviewForCourse };
