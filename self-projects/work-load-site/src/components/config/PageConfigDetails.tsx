import Account from "../../pages/account/Account";
import BackupCode from "../../pages/account/backup/BackupCode";
import CreateAccount from "../../pages/account/CreateAccount";
import LinkAccount from "../../pages/account/link/LinkAccount";
import UpdateAccount from "../../pages/account/UpdateAccount";
import ForgotPassword from "../../pages/auth/ForgotPassword";
import Login from "../../pages/auth/Login";
import ResetPassword from "../../pages/auth/ResetPassword";
import Category from "../../pages/n-lessons/category/Category";
import LessonClient from "../../pages/n-lessons/client/LessonClient";
import CreateLesson from "../../pages/n-lessons/lesson/CreateLesson";
import Lesson from "../../pages/n-lessons/lesson/Lesson";
import UpdateLesson from "../../pages/n-lessons/lesson/UpdateLesson";
import CreatePlatform from "../../pages/platform/CreatePlatform";
import Platform from "../../pages/platform/Platform";
import UpdatePlatform from "../../pages/platform/UpdatePlatform";
import CreateRole from "../../pages/role/CreateRole";
import Role from "../../pages/role/Role";
import UpdateRole from "../../pages/role/UpdateRole";
import CreateUser from "../../pages/user/CreateUser";
import UpdateUser from "../../pages/user/UpdateUser";
import User from "../../pages/user/User";

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

const AUTH_CONFIG = {
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
};

const USER_CONFIG = {
  USER: {
    name: "user",
    label: "User",
    path: "/user",
    role: "US_L",
    element: <User />,
  },
  CREATE_USER: {
    label: "Create user",
    path: "/user/create",
    role: "US_C",
    element: <CreateUser />,
  },
  UPDATE_USER: {
    label: "Update user",
    path: "/user/update/:id",
    role: ["US_U", "US_V"],
    element: <UpdateUser />,
  },
  RESET_MFA_USER: {
    label: "Reset MFA",
    role: "US_R_M",
  },
};

const ROLE_CONFIG = {
  ROLE: {
    name: "role",
    label: "Role",
    path: "/role",
    role: "GR_L",
    element: <Role />,
  },
  UPDATE_ROLE: {
    label: "Update role",
    path: "/role/update/:id",
    role: ["GR_U", "GR_V", "PER_L"],
    element: <UpdateRole />,
  },
  CREATE_ROLE: {
    label: "Create role",
    path: "/role/create",
    role: ["GR_C", "PER_L"],
    element: <CreateRole />,
  },
  DELETE_ROLE: {
    label: "Delete role",
    role: "GR_D",
  },
};

const PLATFORM_CONFIG = {
  PLATFORM: {
    name: "platform",
    label: "Platform",
    path: "/platform",
    role: "PL_L",
    element: <Platform />,
  },
  CREATE_PLATFORM: {
    label: "Create platform",
    role: "PL_C",
    element: <CreatePlatform />,
  },
  UPDATE_PLATFORM: {
    label: "Update platform",
    role: ["PL_U", "PL_V"],
    element: <UpdatePlatform />,
  },
  DELETE_PLATFORM: {
    label: "Delete platform",
    role: "PL_D",
  },
};

const ACCOUNT_CONFIG = {
  ACCOUNT: {
    name: "account",
    label: "Account",
    path: "/account",
    role: "ACC_L",
    element: <Account />,
  },
  CREATE_ACCOUNT: {
    label: "Create account",
    path: "/account/create",
    role: "ACC_C",
    element: <CreateAccount />,
  },
  UPDATE_ACCOUNT: {
    label: "Update account",
    path: "/account/update/:id",
    role: ["ACC_U", "ACC_V"],
    element: <UpdateAccount />,
  },
  DELETE_ACCOUNT: {
    role: "ACC_D",
    label: "Delete account",
  },
};

const LINK_ACCOUNT_CONFIG = {
  LINK_ACCOUNT: {
    name: "link_account",
    label: "Link accounts",
    path: "/account/link-account/:parentId",
    role: ["ACC_V", "ACC_L"],
    element: <LinkAccount />,
  },
  CREATE_LINK_ACCOUNT: {
    label: "Create link account",
    role: "ACC_C",
  },
  UPDATE_LINK_ACCOUNT: {
    label: "Update link account",
    role: ["ACC_V", "ACC_U"],
  },
  DELETE_LINK_ACCOUNT: {
    label: "Delete link account",
    role: "ACC_D",
  },
};

const BACKUP_CODE_CONFIG = {
  BACKUP_CODE: {
    name: "backup_code",
    label: "Backup codes",
    path: "/account/backup-code/:accountId",
    role: "BA_C_L",
    element: <BackupCode />,
  },
  CREATE_BACKUP_CODE: {
    label: "Create backup code",
    role: "BA_C_C",
  },
  DELETE_BACKUP_CODE: {
    label: "Delete backup code",
    role: "BA_C_D",
  },
};

export {
  USER_CONFIG,
  CATEGORY_CONFIG,
  LESSON_CONFIG,
  N_LESSONS_CONFIG,
  AUTH_CONFIG,
  ROLE_CONFIG,
  PLATFORM_CONFIG,
  ACCOUNT_CONFIG,
  LINK_ACCOUNT_CONFIG,
  BACKUP_CODE_CONFIG,
};
