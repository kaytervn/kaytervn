import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { Login } from "../pages/login/Login";
import RedirectHome from "./RedirectHome";

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
