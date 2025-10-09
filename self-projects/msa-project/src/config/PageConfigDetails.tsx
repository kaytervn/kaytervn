import { Account } from "../pages/account/Account";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { Login } from "../pages/login/Login";
import RedirectHome from "./RedirectHome";

export const PLATFORM_CONFIG = {
  PLATFORM: {
    name: "platform",
    label: "Platform",
    path: "/platform",
    role: "PL_L",
    element: <Account />,
  },
  CREATE_PLATFORM: {
    label: "Create Platform",
    role: "PL_C",
  },
  UPDATE_PLATFORM: {
    label: "Update Platform",
    role: ["PL_U", "PL_V"],
  },
  DELETE_PLATFORM: {
    label: "Delete Platform",
    role: "PL_D",
  },
};

export const AUTH_CONFIG = {
  HOME: {
    path: "/",
    element: <RedirectHome />,
  },
  LOGIN: {
    path: "/login",
    element: <Login />,
  },
  FORGOT_PASSWORD: {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
};
