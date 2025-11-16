import { Platform } from "../pages/platform/Platform";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { Login } from "../pages/auth/Login";
import { ResetPassword } from "../pages/auth/ResetPassword";
import { Account } from "../pages/account/Account";
import { AccountForm } from "../pages/account/AccountForm";
import { Tag } from "../pages/tag/Tag";
import { Bank } from "../pages/bank/Bank";
import { BankForm } from "../pages/bank/BankForm";

export const AUTH_CONFIG = {
  LOGIN: {
    path: "/",
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

export const SIDEBAR_MENUS = {
  PLATFORM: {
    label: "Nền tảng",
    path: "/",
    element: <Platform />,
  },
  ACCOUNT: {
    label: "Tài khoản",
    path: "/account",
    element: <Account />,
  },
  TAG: {
    label: "Thẻ",
    path: "/tag",
    element: <Tag />,
  },
  BANK: {
    label: "Ngân hàng",
    path: "/bank",
    element: <Bank />,
  },
};

export const PAGE_CONFIG = {
  ...SIDEBAR_MENUS,
  CREATE_ACCOUNT: {
    label: "Thêm tài khoản",
    path: "/account/create",
    element: <AccountForm />,
  },
  UPDATE_ACCOUNT: {
    label: "Sửa tài khoản",
    path: "/account/update/:id",
    element: <AccountForm />,
  },
  LINK_ACCOUNT: {
    label: "Liên kết tài khoản",
    path: "/account/link/:id",
    element: <AccountForm />,
  },
  CREATE_BANK: {
    label: "Thêm ngân hàng",
    path: "/bank/create",
    element: <BankForm />,
  },
  UPDATE_BANK: {
    label: "Sửa ngân hàng",
    path: "/bank/update/:id",
    element: <BankForm />,
  },
};

export const ENCRYPT_PATH = [
  PAGE_CONFIG.ACCOUNT.path,
  PAGE_CONFIG.CREATE_ACCOUNT.path,
  PAGE_CONFIG.UPDATE_ACCOUNT.path,
  PAGE_CONFIG.LINK_ACCOUNT.path,
  PAGE_CONFIG.BANK.path,
  PAGE_CONFIG.CREATE_BANK.path,
  PAGE_CONFIG.UPDATE_BANK.path,
];
