export const SIDEBAR_MENUS = {
  PLATFORM: { label: "Nền tảng", path: "/" },
  ACCOUNT: { label: "Tài khoản", path: "/account" },
  TAG: { label: "Thẻ", path: "/tag" },
  BANK: { label: "Ngân hàng", path: "/bank" },
} as const;

export const PAGE_CONFIG = {
  ...SIDEBAR_MENUS,
  CREATE_ACCOUNT: { label: "Thêm tài khoản", path: "/account/create" },
  UPDATE_ACCOUNT: { label: "Sửa tài khoản", path: "/account/update/:id" },
  LINK_ACCOUNT: { label: "Liên kết tài khoản", path: "/account/link/:id" },
  CREATE_BANK: { label: "Thêm ngân hàng", path: "/bank/create" },
  UPDATE_BANK: { label: "Sửa ngân hàng", path: "/bank/update/:id" },
} as const;

export const AUTH_ROUTES = {
  LOGIN: { path: "/" },
  FORGOT_PASSWORD: { path: "/forgot-password" },
  RESET_PASSWORD: { path: "/reset-password" },
} as const;

export const ENCRYPT_PATH = [
  PAGE_CONFIG.ACCOUNT.path,
  PAGE_CONFIG.CREATE_ACCOUNT.path,
  PAGE_CONFIG.UPDATE_ACCOUNT.path,
  PAGE_CONFIG.LINK_ACCOUNT.path,
  PAGE_CONFIG.BANK.path,
  PAGE_CONFIG.CREATE_BANK.path,
  PAGE_CONFIG.UPDATE_BANK.path,
] as string[];
