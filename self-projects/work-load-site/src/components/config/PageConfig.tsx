import {
  BookIcon,
  FolderIcon,
  KeyIcon,
  LinkIcon,
  LockKeyholeIcon,
  UsersIcon,
} from "lucide-react";
import {
  ACCOUNT_CONFIG,
  BACKUP_CODE_CONFIG,
  BANK_CONFIG,
  CATEGORY_CONFIG,
  CONTACT_CONFIG,
  ID_NUMBER_CONFIG,
  LESSON_CONFIG,
  LINK_ACCOUNT_CONFIG,
  LINK_CONFIG,
  N_LESSONS_CONFIG,
  PLATFORM_CONFIG,
  ROLE_CONFIG,
  TAG_CONFIG,
  USER_CONFIG,
} from "./PageConfigDetails";
import RedirectHome from "./RedirectHome";
import Profile from "../../pages/user/Profile";
import ActivateAccount from "../../pages/user/ActivateAccount";

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
  MSA_HOME: {
    path: "/msa-home",
    element: <RedirectHome />,
  },
  PROFILE: {
    label: "Profile",
    path: "/profile",
    element: <Profile />,
  },
  ...USER_CONFIG,
  ...ROLE_CONFIG,
  ...PLATFORM_CONFIG,
  ...ACCOUNT_CONFIG,
  ...LINK_ACCOUNT_CONFIG,
  ...BACKUP_CODE_CONFIG,
  ...TAG_CONFIG,
  ...BANK_CONFIG,
  ...ID_NUMBER_CONFIG,
  ...CONTACT_CONFIG,
  ...LINK_CONFIG,
};

const SESSION_KEY_PAGES: Set<string> = new Set([
  PAGE_CONFIG.ACCOUNT.name,
  PAGE_CONFIG.BANK.name,
]);

const BASIC_PAGE_CONFIG = {
  ACTIVATE_ACCOUNT: {
    label: "Activate account",
    path: "/activate-account/:token",
    element: <ActivateAccount />,
  },
};

const SIDEBAR_MENUS = [
  {
    name: "User management",
    icon: <UsersIcon size={20} />,
    items: [PAGE_CONFIG.USER, PAGE_CONFIG.ROLE],
  },
  {
    name: "Account management",
    icon: <KeyIcon size={20} />,
    items: [PAGE_CONFIG.PLATFORM, PAGE_CONFIG.ACCOUNT],
  },
  {
    name: "Useful links",
    icon: <LinkIcon size={20} />,
    items: [PAGE_CONFIG.LINK],
  },
  {
    name: "Key information",
    icon: <LockKeyholeIcon size={20} />,
    items: [PAGE_CONFIG.TAG, PAGE_CONFIG.ID_NUMBER, PAGE_CONFIG.BANK],
  },
  {
    name: "Others",
    icon: <FolderIcon size={20} />,
    items: [PAGE_CONFIG.CONTACT],
  },
];

export {
  PAGE_CONFIG,
  SIDEBAR_MENUS,
  N_LESSONS_SIDEBAR_MENUS,
  N_LESSONS_PAGE_CONFIG,
  SESSION_KEY_PAGES,
  BASIC_PAGE_CONFIG,
};
