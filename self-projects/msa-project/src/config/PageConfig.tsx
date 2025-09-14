export const PAGE_CONFIG = {
  PROFILE: {
    label: "Profile",
    path: "/profile",
    // element: <Profile />,
  },
  //   ...USER_CONFIG,
  //   ...ROLE_CONFIG,
  //   ...PLATFORM_CONFIG,
  //   ...ACCOUNT_CONFIG,
  //   ...LINK_ACCOUNT_CONFIG,
  //   ...BACKUP_CODE_CONFIG,
  //   ...TAG_CONFIG,
  //   ...BANK_CONFIG,
  //   ...ID_NUMBER_CONFIG,
  //   ...CONTACT_CONFIG,
  //   ...LINK_CONFIG,
  //   ...SOFTWARE_CONFIG,
  //   ...NOTE_CONFIG,
  //   ...SCHEDULE_CONFIG,
};

export const SIDEBAR_MENUS = [
  {
    name: "User Management",
    // items: [PAGE_CONFIG.USER, PAGE_CONFIG.ROLE],
  },
  {
    name: "Account Management",
    // items: [PAGE_CONFIG.PLATFORM, PAGE_CONFIG.ACCOUNT],
  },
  {
    name: "Useful Links",
    // items: [PAGE_CONFIG.LINK, PAGE_CONFIG.SOFTWARE],
  },
  {
    name: "Key Information",
    // items: [PAGE_CONFIG.TAG, PAGE_CONFIG.ID_NUMBER, PAGE_CONFIG.BANK],
  },
  {
    name: "Others",
    // items: [PAGE_CONFIG.NOTE, PAGE_CONFIG.SCHEDULE, PAGE_CONFIG.CONTACT],
  },
];
