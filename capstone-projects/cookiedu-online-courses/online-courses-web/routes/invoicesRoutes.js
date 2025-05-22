import express from "express";

import auth from "../middlewares/auth.js";
import {
  checkout,
  getMyCourses,
  myInvoice,
  searchByName,
  searchByTopic,
  searchByTimeUpdate,
} from "../controllers/invoicesController.js";

const router = express.Router();

//router.post("/createInvoice", auth, createInvoice);

router.get("/my_invoice", auth, myInvoice);

router.post("/checkout", auth, checkout);

router.get("/my_course", auth, getMyCourses);

router.get("/my_course/searchByName/:str", auth, searchByName);

router.get("/my_course/searchByTopic/:str", auth, searchByTopic);

router.get("/my_course/searchByTimeUpdate", auth, searchByTimeUpdate);

// router.get("/get_course", getCourse);

// router.post("/review_course", auth, reviewCourse);
export { router as invoicesRoutes };
