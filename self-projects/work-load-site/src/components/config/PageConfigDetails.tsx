import Account from "../../pages/account/Account";
import BackupCode from "../../pages/account/backup/BackupCode";
import CreateAccount from "../../pages/account/CreateAccount";
import LinkAccount from "../../pages/account/link/LinkAccount";
import UpdateAccount from "../../pages/account/UpdateAccount";
import ViewAccount from "../../pages/account/ViewAccount";
import ForgotPassword from "../../pages/auth/ForgotPassword";
import Login from "../../pages/auth/Login";
import ResetPassword from "../../pages/auth/ResetPassword";
import Bank from "../../pages/bank/Bank";
import CreateBank from "../../pages/bank/CreateBank";
import UpdateBank from "../../pages/bank/UpdateBank";
import ViewBank from "../../pages/bank/ViewBank";
import Contact from "../../pages/contact/Contact";
import CreateContact from "../../pages/contact/CreateContact";
import UpdateContact from "../../pages/contact/UpdateContact";
import CreateIdNumber from "../../pages/id-number/CreateIdNumber";
import IdNumber from "../../pages/id-number/IdNumber";
import UpdateIdNumber from "../../pages/id-number/UpdateIdNumber";
import CreateLink from "../../pages/link/CreateLink";
import Link from "../../pages/link/Link";
import UpdateLink from "../../pages/link/UpdateLink";
import Category from "../../pages/n-lessons/category/Category";
import LessonClient from "../../pages/n-lessons/client/LessonClient";
import CreateLesson from "../../pages/n-lessons/lesson/CreateLesson";
import Lesson from "../../pages/n-lessons/lesson/Lesson";
import UpdateLesson from "../../pages/n-lessons/lesson/UpdateLesson";
import CreateNote from "../../pages/note/CreateNote";
import Note from "../../pages/note/Note";
import UpdateNote from "../../pages/note/UpdateNote";
import Platform from "../../pages/platform/Platform";
import CreateRole from "../../pages/role/CreateRole";
import Role from "../../pages/role/Role";
import UpdateRole from "../../pages/role/UpdateRole";
import CreateSoftware from "../../pages/software/CreateSoftware";
import Software from "../../pages/software/Software";
import UpdateSoftware from "../../pages/software/UpdateSoftware";
import Tag from "../../pages/tag/Tag";
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
  },
  UPDATE_PLATFORM: {
    label: "Update platform",
    role: ["PL_U", "PL_V"],
  },
  DELETE_PLATFORM: {
    label: "Delete platform",
    role: "PL_D",
  },
};

const TAG_CONFIG = {
  TAG: {
    name: "tag",
    label: "Tag",
    path: "/tag",
    role: "TA_L",
    element: <Tag />,
  },
  CREATE_TAG: {
    label: "Create tag",
    role: "TA_C",
  },
  UPDATE_TAG: {
    label: "Update tag",
    role: ["TA_V", "TA_U"],
  },
  DELETE_TAG: {
    label: "Delete tag",
    role: "TA_D",
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
  VIEW_ACCOUNT: {
    label: "View account",
    path: "/account/view/:id",
    role: "ACC_V",
    element: <ViewAccount />,
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

export const BANK_CONFIG = {
  BANK: {
    name: "bank",
    label: "Bank",
    path: "/bank",
    role: "BA_L",
    element: <Bank />,
  },
  CREATE_BANK: {
    label: "Create bank",
    path: "/bank/create",
    role: "BA_C",
    element: <CreateBank />,
  },
  VIEW_BANK: {
    label: "View bank",
    path: "/bank/view/:id",
    role: "BA_V",
    element: <ViewBank />,
  },
  UPDATE_BANK: {
    label: "Update bank",
    path: "/bank/update/:id",
    role: ["BA_U", "BA_V"],
    element: <UpdateBank />,
  },
  DELETE_BANK: {
    role: "BA_D",
    label: "Delete bank",
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

export const ID_NUMBER_CONFIG = {
  ID_NUMBER: {
    name: "id_number",
    label: "ID Number",
    path: "/id-number",
    role: "ID_N_L",
    element: <IdNumber />,
  },
  CREATE_ID_NUMBER: {
    label: "Create ID number",
    path: "/id-number/create",
    role: "ID_N_C",
    element: <CreateIdNumber />,
  },
  UPDATE_ID_NUMBER: {
    label: "Update ID number",
    path: "/id-number/update/:id",
    role: ["ID_N_U", "ID_N_V"],
    element: <UpdateIdNumber />,
  },
  DELETE_ID_NUMBER: {
    role: "ID_N_D",
    label: "Delete ID number",
  },
};

export const CONTACT_CONFIG = {
  CONTACT: {
    name: "contact",
    label: "Contact",
    path: "/contact",
    role: "CO_L",
    element: <Contact />,
  },
  CREATE_CONTACT: {
    label: "Create contact",
    path: "/contact/create",
    role: "CO_C",
    element: <CreateContact />,
  },
  UPDATE_CONTACT: {
    label: "Update contact",
    path: "/contact/update/:id",
    role: ["CO_V", "CO_U"],
    element: <UpdateContact />,
  },
  DELETE_CONTACT: {
    label: "Delete contact",
    role: "CO_D",
  },
};

export const LINK_CONFIG = {
  LINK: {
    name: "link",
    label: "Link",
    path: "/link",
    role: "LI_L",
    element: <Link />,
  },
  CREATE_LINK: {
    label: "Create link",
    path: "/link/create",
    role: "LI_C",
    element: <CreateLink />,
  },
  UPDATE_LINK: {
    label: "Update link",
    path: "/link/update/:id",
    role: ["LI_V", "LI_U"],
    element: <UpdateLink />,
  },
  DELETE_LINK: {
    label: "Delete link",
    role: "LI_D",
  },
};

export const SOFTWARE_CONFIG = {
  SOFTWARE: {
    name: "software",
    label: "Software",
    path: "/software",
    role: "SO_L",
    element: <Software />,
  },
  CREATE_SOFTWARE: {
    label: "Create software",
    path: "/software/create",
    role: "SO_C",
    element: <CreateSoftware />,
  },
  UPDATE_SOFTWARE: {
    label: "Update software",
    path: "/software/update/:id",
    role: ["SO_V", "SO_U"],
    element: <UpdateSoftware />,
  },
  DELETE_SOFTWARE: {
    label: "Delete software",
    role: "SO_D",
  },
};

export const NOTE_CONFIG = {
  NOTE: {
    name: "note",
    label: "Note",
    path: "/note",
    role: "NO_L",
    element: <Note />,
  },
  CREATE_NOTE: {
    label: "Create note",
    path: "/note/create",
    role: "NO_C",
    element: <CreateNote />,
  },
  UPDATE_NOTE: {
    label: "Update note",
    path: "/note/update/:id",
    role: ["NO_V", "NO_U"],
    element: <UpdateNote />,
  },
  DELETE_NOTE: {
    label: "Delete note",
    role: "NO_D",
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
  TAG_CONFIG,
};
