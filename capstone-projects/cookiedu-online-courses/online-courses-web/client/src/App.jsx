import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import Login from "./pages/users/Login";
import ForgotPassword from "./pages/users/ForgotPassword";
import HomePage from "./pages/users/HomePage";
import MyProfilePage from "./pages/users/MyProfilePage/MyProfilePage";
import ResetPassword from "./pages/users/ResetPassword";
import NotFoundPage from "./pages/NotFoundPage";
import GuestRoutes from "../Routes/GuestRoutes";
import Register from "./pages/users/Register";
import UserManager from "./pages/admin/UserManager";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./contexts/UserContext";
import Role from "../../models/RoleEnum.js";
import { getUser } from "./services/usersService";
import MyCreatedCourses from "./pages/instructors/MyCreatedCourses.jsx";
import Loading from "./pages/Loading";
import CreateCourse from "./pages/instructors/CreateCourse";
import CartPage from "./pages/students/CartPage";
import PersonalRevenue from "./pages/instructors/PersonalRevenue";
import InstructorManager from "./pages/admin/InstructorManager";
import CoursePage from "./pages/students/CoursePage";
import EditCourse from "./pages/instructors/EditCourse.jsx";
import EditProfile from "./pages/users/MyProfilePage/EditProfile";
import CourseManager from "./pages/admin/CourseManager";

import RevenueStatistic from "./pages/admin/RevenueStatistic";
import UpdateCourseIntro from "./pages/instructors/UpdateCourseIntro.jsx";
import UserDetail from "./pages/admin/UserDetail";

import ChangePassword from "./pages/users/MyProfilePage/ChangePassword";
import UpdateCourseDetails from "./pages/instructors/UpdateCourseDetails";
import CreateLesson from "./pages/instructors/CreateLesson";
import CheckoutPage from "./pages/students/CheckoutPage";
import MyCoursePage from "./pages/students/MyCoursePage";
import UpdateLesson from "./pages/instructors/UpdateLesson";
import UpdateLessonDetails from "./pages/instructors/UpdateLessonDetails";
import CreateDocument from "./pages/instructors/CreateDocument";
import CreateComment from "./pages/instructors/CreateComment.jsx";
import InstructorRegister from "./pages/admin/InstructorRegister";
import CourseIntroPage from "./pages/students/CourseIntroPage";
import OTPInput from "./pages/users/OTPInput.jsx";
import CourseDetails from "./pages/students/CourseDetails.jsx";
import LessonDetailsPage from "./pages/students/LessonDetailsPage.jsx";

const App = () => {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const dataUser = await getUser(token);
        setUser({
          token,
          email: dataUser.email,
          name: dataUser.name,
          picture: dataUser.picture,
          phone: dataUser.phone,
          role: dataUser.role,
        });
        setLoading(false);
      }
    }, 0);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {!user.token ||
          (loading && !user.role && <Route index element={<Loading />} />)}
        <Route element={<Layout />}>
          {user.role == Role.ADMIN && (
            <>
              <Route index element={<UserManager />} />
              <Route path="/instructor" element={<InstructorManager />} />
              <Route path="/course" element={<CourseManager />} />
              <Route path="/statistics" element={<RevenueStatistic />} />
              <Route path="/user" element={<UserDetail />} />
              <Route path="/register" element={<InstructorRegister />} />
              {/* <Route path="/course-manager" element={<CourseManager />}></Route> */}
            </>
          )}
          {user.role == Role.INSTRUCTOR && (
            <>
              <Route index element={<MyCreatedCourses />} />
              <Route path="/create-course" element={<CreateCourse />}></Route>
              <Route path="/edit-course" element={<EditCourse />}></Route>
              <Route path="/create-lesson" element={<CreateLesson />}></Route>
              <Route path="/update-lesson" element={<UpdateLesson />}></Route>
              <Route
                path="/create-document"
                element={<CreateDocument />}
              ></Route>
              <Route path="/create-comment" element={<CreateComment />}></Route>
              <Route
                path="/update-lesson-details"
                element={<UpdateLessonDetails />}
              ></Route>
              <Route
                path="/update-course-details"
                element={<UpdateCourseDetails />}
              ></Route>
              <Route
                path="/personal-revenue"
                element={<PersonalRevenue />}
              ></Route>
              <Route
                path="/update-course-intro"
                element={<UpdateCourseIntro />}
              ></Route>
            </>
          )}
          {user.role != Role.ADMIN && user.role != Role.INSTRUCTOR && (
            <>
              <Route index element={<HomePage />} />
              <Route path="/cart" element={<CartPage />}></Route>
              <Route path="/list-courses" element={<CoursePage />}></Route>
              <Route path="/checkout" element={<CheckoutPage />}></Route>
              <Route path="/my-course" element={<MyCoursePage />}></Route>
              <Route path="/course-intro" element={<CourseIntroPage />}></Route>
              <Route path="/course-details" element={<CourseDetails />}></Route>
              <Route
                path="/lesson-details"
                element={<LessonDetailsPage />}
              ></Route>
              <Route path="/create-comment" element={<CreateComment />}></Route>
            </>
          )}
          {user.token && (
            <>
              <Route path="/my-profile" element={<MyProfilePage />}></Route>
              <Route path="/my-profile/edit" element={<EditProfile />}></Route>
              <Route
                path="/my-profile/change-password"
                element={<ChangePassword />}
              ></Route>
            </>
          )}
          <Route element={<GuestRoutes />}>
            <Route path="/list-courses" element={<CoursePage />}></Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/otp-authentication" element={<OTPInput />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/reset-password/:id/:token"
              element={<ResetPassword />}
            />
          </Route>
          {!loading && <Route path="*" element={<NotFoundPage />} />}
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
