import Account from "../../pages/account/Account";
import CreateAccount from "../../pages/account/CreateAccount";
import UpdateAccount from "../../pages/account/UpdateAccount";
import ForgotPassword from "../../pages/auth/ForgotPassword";
import Login from "../../pages/auth/Login";
import RequestResetMfa from "../../pages/auth/RequestResetMfa";
import ResetMfa from "../../pages/auth/ResetMfa";
import ResetPassword from "../../pages/auth/ResetPassword";
import Category from "../../pages/n-lessons/category/Category";
import LessonClient from "../../pages/n-lessons/client/LessonClient";
import CreateLesson from "../../pages/n-lessons/lesson/CreateLesson";
import Lesson from "../../pages/n-lessons/lesson/Lesson";
import UpdateLesson from "../../pages/n-lessons/lesson/UpdateLesson";
import CreatePlatform from "../../pages/platform/CreatePlatform";
import Platform from "../../pages/platform/Platform";
import UpdatePlatform from "../../pages/platform/UpdatePlatform";

const CATEGORY_CONFIG = {
  CATEGORY: {
    name: "category",
    label: "Danh mục",
    path: "/category",
    element: <Category />,
  },
  CREATE_CATEGORY: {
    label: "Thêm mới danh mục",
  },
  UPDATE_CATEGORY: {
    label: "Cập nhật danh mục",
  },
  DELETE_CATEGORY: {
    label: "Xóa danh mục",
  },
};

const LESSON_CONFIG = {
  LESSON: {
    name: "lesson",
    label: "Bài học",
    path: "/lesson",
    element: <Lesson />,
  },
  CREATE_LESSON: {
    label: "Thêm mới bài học",
    path: "/lesson/create",
    element: <CreateLesson />,
  },
  UPDATE_LESSON: {
    label: "Cập nhật bài học",
    path: "/lesson/update/:id",
    element: <UpdateLesson />,
  },
  DELETE_LESSON: {
    label: "Xóa bài học",
  },
};

const N_LESSONS_CONFIG = {
  CLIENT: {
    label: "N Lessons",
    path: "/n-lessons",
    element: <LessonClient />,
  },
};

const ACCOUNT_CONFIG = {
  ACCOUNT: {
    name: "account",
    label: "Account",
    path: "/account",
    element: <Account />,
  },
  CREATE_ACCOUNT: {
    label: "Create account",
    path: "/account/create",
    element: <CreateAccount />,
  },
  UPDATE_ACCOUNT: {
    label: "Update account",
    path: "/account/update/:id",
    element: <UpdateAccount />,
  },
  DELETE_ACCOUNT: {
    label: "Delete account",
  },
};

const PLATFORM_CONFIG = {
  PLATFORM: {
    name: "platform",
    label: "Platform",
    path: "/platform",
    element: <Platform />,
  },
  CREATE_PLATFORM: {
    label: "Create platform",
    path: "/platform/create",
    element: <CreatePlatform />,
  },
  UPDATE_PLATFORM: {
    label: "Update platform",
    path: "/platform/update/:id",
    element: <UpdatePlatform />,
  },
  DELETE_PLATFORM: {
    label: "Delete platform",
  },
};

const USER_CONFIG = {
  LOGIN: {
    label: "Login",
    path: "/login",
    element: <Login />,
  },
  FORGOT_PASSWORD: {
    label: "Forgot password",
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  RESET_PASSWORD: {
    label: "Reset password",
    path: "/reset-password",
    element: <ResetPassword />,
  },
  REQUEST_RESET_MFA: {
    label: "Request reset MFA",
    path: "/request-reset-mfa",
    element: <RequestResetMfa />,
  },
  RESET_MFA: {
    label: "Reset MFA",
    path: "/reset-mfa",
    element: <ResetMfa />,
  },
};

export {
  ACCOUNT_CONFIG,
  PLATFORM_CONFIG,
  USER_CONFIG,
  CATEGORY_CONFIG,
  LESSON_CONFIG,
  N_LESSONS_CONFIG,
};
