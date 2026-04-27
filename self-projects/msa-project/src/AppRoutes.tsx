import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { AUTH_ROUTES, PAGE_CONFIG } from "@/shared/constants";
import Loading from "@/pages/others/Loading";
import NotFound from "@/pages/others/NotFound";

// Lazy load pages
const Login = lazy(() => import("@/pages/auth/Login").then(m => ({ default: m.Login })));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword").then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword").then(m => ({ default: m.ResetPassword })));

const Platform = lazy(() => import("@/pages/platform/Platform").then(m => ({ default: m.Platform })));
const Account = lazy(() => import("@/pages/account/Account").then(m => ({ default: m.Account })));
const AccountForm = lazy(() => import("@/pages/account/AccountForm").then(m => ({ default: m.AccountForm })));
const Tag = lazy(() => import("@/pages/tag/Tag").then(m => ({ default: m.Tag })));
const Bank = lazy(() => import("@/pages/bank/Bank").then(m => ({ default: m.Bank })));
const BankForm = lazy(() => import("@/pages/bank/BankForm").then(m => ({ default: m.BankForm })));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

export const buildRoutes = (profile: any): RouteObject[] => {
  if (!profile) {
    return [
      { path: AUTH_ROUTES.LOGIN.path, element: withSuspense(Login) },
      { path: AUTH_ROUTES.FORGOT_PASSWORD.path, element: withSuspense(ForgotPassword) },
      { path: AUTH_ROUTES.RESET_PASSWORD.path, element: withSuspense(ResetPassword) },
      { path: "*", element: <NotFound /> },
    ];
  }

  return [
    { path: PAGE_CONFIG.PLATFORM.path, element: withSuspense(Platform) },
    { path: PAGE_CONFIG.ACCOUNT.path, element: withSuspense(Account) },
    { path: PAGE_CONFIG.CREATE_ACCOUNT.path, element: withSuspense(AccountForm) },
    { path: PAGE_CONFIG.UPDATE_ACCOUNT.path, element: withSuspense(AccountForm) },
    { path: PAGE_CONFIG.LINK_ACCOUNT.path, element: withSuspense(AccountForm) },
    { path: PAGE_CONFIG.TAG.path, element: withSuspense(Tag) },
    { path: PAGE_CONFIG.BANK.path, element: withSuspense(Bank) },
    { path: PAGE_CONFIG.CREATE_BANK.path, element: withSuspense(BankForm) },
    { path: PAGE_CONFIG.UPDATE_BANK.path, element: withSuspense(BankForm) },
    { path: "*", element: <NotFound /> },
  ];
};
