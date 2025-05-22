import InvoiceItem from "../models/InvoiceItemModel.js";
import User from "../models/UserModel.js";
import Course from "../models/CourseModel.js";
import Role from "../models/RoleEnum.js";

const getAllCourseStasticsAdmin = async (req, res) => {
  const UserAuth = await User.findById(req.user._id);
  if (!(UserAuth.role == Role.ADMIN)) {
    return res.status(401).json({ error: "Not authorized" });
  }
  try {
    var statistics = [];

    const courses = await Course.find();
    if (courses.length === 0) {
      return res.status(404).json({ message: "Don't have any courses" });
    }

    var totalRevenuePage = 0;
    const createStatistic = await Promise.all(
      courses.map(async (course) => {
        const invoiceItems = await InvoiceItem.find({ courseId: course._id });
        const instructor = await User.findById(course.userId);
        totalRevenuePage += invoiceItems.length * course.price;
        statistics.push({
          courseName: course.title,
          instructorName: instructor.name,
          totalBuyers: invoiceItems.length,
          totalRevenue: invoiceItems.length * course.price,
        });
        return {};
      })
    );

    res.status(200).json({ statistics, totalRevenuePage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCourseStasticsInstructor = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!(user.role == Role.INSTRUCTOR)) {
    return res.status(401).json({ error: "Not authorized" });
  }
  try {
    var statistics = [];

    const courses = await Course.find({ userId: req.user._id });
    if (courses.length === 0) {
      return res.status(404).json({ message: "Don't have any courses" });
    }

    var totalRevenueInstructor = 0;
    const createStatistic = await Promise.all(
      courses.map(async (course) => {
        const invoiceItems = await InvoiceItem.find({ courseId: course._id });
        totalRevenueInstructor += invoiceItems.length * course.price;
        statistics.push({
          courseName: course.title,
          totalBuyers: invoiceItems.length,
          totalRevenue: invoiceItems.length * course.price,
        });
        return {};
      })
    );
    console.log("statistics", statistics);
    res.status(200).json({ statistics, totalRevenueInstructor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getAllCourseStasticsAdmin, getAllCourseStasticsInstructor };
