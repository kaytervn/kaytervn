import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { Login } from "../pages/login/Login";
import { Platform } from "../pages/platform/Platform";

export const PLATFORM_CONFIG = {
  PLATFORM: {
    label: "Nền tảng",
    path: "/platform",
    element: <Platform />,
  },
  CREATE_PLATFORM: {
    label: "Thêm nền tảng",
  },
  UPDATE_PLATFORM: {
    label: "Sửa nền tảng",
  },
  DELETE_PLATFORM: {
    label: "Xoá nền tảng",
  },
};

export const AUTH_CONFIG = {
  LOGIN: {
    path: "/login",
    element: <Login />,
  },
  FORGOT_PASSWORD: {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
};

export const SIDEBAR_MENUS = [PLATFORM_CONFIG.PLATFORM];
