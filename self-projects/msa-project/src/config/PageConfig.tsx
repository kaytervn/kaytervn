import { Platform } from "../pages/platform/Platform";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { Login } from "../pages/auth/Login";
import { ResetPassword } from "../pages/auth/ResetPassword";

export const AUTH_CONFIG = {
  LOGIN: {
    path: "/login",
    element: <Login />,
  },
  FORGOT_PASSWORD: {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  RESET_PASSWORD: {
    path: "/reset-password",
    element: <ResetPassword />,
  },
};

export const PAGE_CONFIG = {
  PLATFORM: {
    label: "Nền tảng",
    path: "/platform",
    element: <Platform />,
  },
};
