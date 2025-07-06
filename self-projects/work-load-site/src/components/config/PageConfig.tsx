import { BookIcon, KeyIcon } from "lucide-react";
import {
  ACCOUNT_CONFIG,
  CATEGORY_CONFIG,
  LESSON_CONFIG,
  N_LESSONS_CONFIG,
  PLATFORM_CONFIG,
} from "./PageConfigDetails";

const N_LESSONS_PAGE_CONFIG = {
  ...CATEGORY_CONFIG,
  ...LESSON_CONFIG,
  ...N_LESSONS_CONFIG,
};

const N_LESSONS_SIDEBAR_MENUS = [
  {
    name: "Quản lý tài liệu",
    icon: <BookIcon size={16} />,
    items: [N_LESSONS_PAGE_CONFIG.LESSON, N_LESSONS_PAGE_CONFIG.CATEGORY],
  },
];

const PAGE_CONFIG = {
  ...ACCOUNT_CONFIG,
  ...PLATFORM_CONFIG,
};

const DECRYPT_FIELDS = {
  ACCOUNT: ["username", "password", "note", "ref.username", "platform.name"],
  PLATFORM: ["name"],
};

const SIDEBAR_MENUS = [
  {
    name: "Account management",
    icon: <KeyIcon size={20} />,
    items: [PAGE_CONFIG.PLATFORM, PAGE_CONFIG.ACCOUNT],
  },
];

export {
  PAGE_CONFIG,
  SIDEBAR_MENUS,
  DECRYPT_FIELDS,
  N_LESSONS_SIDEBAR_MENUS,
  N_LESSONS_PAGE_CONFIG,
};
