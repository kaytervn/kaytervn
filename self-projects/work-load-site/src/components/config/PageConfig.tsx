import {
  BookIcon,
  FolderIcon,
  KeyIcon,
  LinkIcon,
  LockKeyholeIcon,
} from "lucide-react";
import {
  ACCOUNT_CONFIG,
  BACKUP_CODE_CONFIG,
  CATEGORY_CONFIG,
  LESSON_CONFIG,
  LINK_ACCOUNT_CONFIG,
  N_LESSONS_CONFIG,
  PLATFORM_CONFIG,
} from "./PageConfigDetails";
import Profile from "../../pages/auth/Profile";

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
  PROFILE: {
    name: "profile",
    label: "Profile",
    path: "/profile",
    element: <Profile />,
  },
  ...ACCOUNT_CONFIG,
  ...PLATFORM_CONFIG,
  ...LINK_ACCOUNT_CONFIG,
  ...BACKUP_CODE_CONFIG,
};

const NOT_REQUIRE_SESSION_KEY_PAGES: Set<string> = new Set([
  PAGE_CONFIG.PROFILE.name,
]);

const DECRYPT_FIELDS = {
  ACCOUNT: [
    "username",
    "password",
    "note",
    "ref.username",
    "platform.name",
    "ref.platform.name",
  ],
  PLATFORM: ["name"],
  BACKUP_CODE: ["code"],
};

const SIDEBAR_MENUS = [
  {
    name: "Account management",
    icon: <KeyIcon size={20} />,
    items: [PAGE_CONFIG.PLATFORM, PAGE_CONFIG.ACCOUNT],
  },
  {
    name: "Useful links",
    icon: <LinkIcon size={20} />,
    items: [],
  },
  {
    name: "Key information",
    icon: <LockKeyholeIcon size={20} />,
    items: [],
  },
  {
    name: "Others",
    icon: <FolderIcon size={20} />,
    items: [],
  },
];

export {
  PAGE_CONFIG,
  SIDEBAR_MENUS,
  DECRYPT_FIELDS,
  N_LESSONS_SIDEBAR_MENUS,
  N_LESSONS_PAGE_CONFIG,
  NOT_REQUIRE_SESSION_KEY_PAGES,
};
