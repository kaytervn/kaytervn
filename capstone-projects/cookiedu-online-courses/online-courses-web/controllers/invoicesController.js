import express from "express";
import mongoose from "mongoose";
import Invoice from "../models/InvoiceModel.js";
import InvoiceItem from "../models/InvoiceItemModel.js";
import Cart from "../models/CartModel.js";
import CartItem from "../models/CartItemModel.js";
import auth from "../middlewares/auth.js";
import PaymentMethod from "../models/PaymentMethodEnum.js";
import Course from "../models/CourseModel.js";
import Topic from "../models/TopicEnum.js";
import User from "../models/UserModel.js";

const router = express.Router();

// Điểm cuối API để xử lý quá trình checkout
const checkout = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user._id; // ID người dùng từ middleware xác thực

    // Tìm giỏ hàng của người dùng
    const userCart = await Cart.findOne({ userId: userId }).session(session);
    if (!userCart) {
      return res.status(404).json({ error: "Giỏ hàng không tồn tại." });
    }

    // Tìm tất cả mục trong giỏ hàng
    const cartItems = await CartItem.find({ cartId: userCart._id }).session(
      session
    );

    if (cartItems.length === 0) {
      return res
        .status(400)
        .json({ error: "Không có sản phẩm nào trong giỏ hàng để thanh toán." });
    }

    // Tạo hóa đơn mới
    const invoice = new Invoice({
      userId: userId,
      paymentMethod: req.body.paymentMethod || PaymentMethod.PAYPAL, // Thiết lập mặc định nếu không được cung cấp
    });
    await invoice.save({ session });

    // Tạo các mục hóa đơn dựa trên các mục trong giỏ hàng
    for (let item of cartItems) {
      const invoiceItem = new InvoiceItem({
        invoiceId: invoice._id,
        courseId: item.courseId,
      });
      await invoiceItem.save({ session });
    }

    // Xóa các mục trong giỏ hàng sau khi đã checkout thành công
    await CartItem.deleteMany({ cartId: userCart._id }).session(session);

    await session.commitTransaction();
    session.endSession();
    res
      .status(201)
      .json({ message: "Thanh toán thành công", invoiceId: invoice._id });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res
      .status(500)
      .json({ error: "Lỗi trong quá trình thanh toán: " + error.message });
  }
};

// const myInvoice = async(req, res)=>{
//   try {
//     const userId = req.user._id; // ID người dùng từ middleware xác thực

//     // Tìm giỏ hàng của người dùng
//     const userCart = await Cart.findOne({ userId: userId });
//     if (!userCart) {
//       return res.status(404).json({ error: "Giỏ hàng không tồn tại." });
//     }

//     // Tìm tất cả mục trong giỏ hàng
//     const cartItems = await CartItem.find({ cartId: userCart._id });

//     if (cartItems.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "Không có sản phẩm nào trong giỏ hàng." });
//     }

//     res.status(200).json({cartItems})
//   }catch (error) {
//       res
//         .status(500)
//         .json({ error:error.message });
//     }
// };
const myInvoice = async (req, res) => {
  const userId = req.user._id;
  try {
    const invoices = await Invoice.find({ userId: userId });
    if (invoices.length === 0) {
      return res.status(404).json({ message: "Không có hóa đơn" });
    }
    res.status(200).json({ invoices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyCourses = async (req, res) => {
  const userId = req.user._id;
  try {
    // Lấy tất cả hóa đơn của người dùng
    const invoices = await Invoice.find({ userId: userId });
  
    // Duyệt qua từng hóa đơn và thu thập các courseId từ các mục hóa đơn
    let courseIds = new Set();
    for (let invoice of invoices) {
      const items = await InvoiceItem.find({ invoiceId: invoice._id });
      items.forEach((item) => courseIds.add(item.courseId.toString()));
    }

    // Lấy chi tiết các khóa học dựa trên courseId
    const courses = await Course.find({
      _id: { $in: Array.from(courseIds) },
    });

    const newCourses = await Promise.all(
      courses.map(async (course) => {
        const user = await User.findById(course.userId);
        return {
          ...course.toObject(),
          instructorName: user.name,
        };
      })
    );

    // Gửi chi tiết các khóa học về cho client
    res.status(200).json({ courses: newCourses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchByName = async (req, res) => {
  const name = req.params.str;
  const userId = req.user._id;

  try {
    // Tìm tất cả hóa đơn của người dùng
    const invoices = await Invoice.find({ userId: userId });
    let courseIds = new Set();

    // Duyệt qua từng hóa đơn để lấy courseId
    for (let invoice of invoices) {
      const items = await InvoiceItem.find({ invoiceId: invoice._id });
      items.forEach((item) => courseIds.add(item.courseId.toString()));
    }

    // Tìm kiếm khóa học theo tên và chỉ trong số các khóa học của người dùng
    const courses = await Course.find({
      _id: { $in: Array.from(courseIds) },
      title: { $regex: new RegExp(name, "i") }, // Tìm kiếm không phân biệt hoa thường
    });

    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy khóa học nào phù hợp." });
    }

    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchByTopic = async (req, res) => {
  const userId = req.user._id;
  const topicName = req.params.str;

  try {
    if (!(topicName in Topic)) {
      return res.status(404).json({ message: "Chủ đề không tồn tại." });
    }

    // Tìm các khóa học theo userId và topicId
    const courses = await Course.find({
      userId: userId,
      topic: topicName,
    }).sort({ createdAt: -1 });

    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có khóa học nào trong chủ đề này." });
    }

    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchByTimeUpdate = async (req, res) => {
  const userId = req.user._id;

  try {
    // Lấy tất cả hóa đơn của người dùng
    const invoices = await Invoice.find({ userId: userId });
    let courseIds = new Set();

    // Duyệt qua từng hóa đơn để lấy courseId
    for (let invoice of invoices) {
      const items = await InvoiceItem.find({ invoiceId: invoice._id });
      items.forEach((item) => courseIds.add(item.courseId.toString()));
    }

    // Lấy chi tiết các khóa học dựa trên courseId và sắp xếp theo thời gian cập nhật
    const courses = await Course.find({
      _id: { $in: Array.from(courseIds) },
    }).sort({ updatedAt: -1 }); // Sắp xếp theo thời gian cập nhật mới nhất

    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  checkout,
  myInvoice,
  getMyCourses,
  searchByName,
  searchByTopic,
  searchByTimeUpdate,
};
