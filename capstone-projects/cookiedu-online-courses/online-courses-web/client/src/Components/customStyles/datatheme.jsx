export const themes = {
  light: {
    sidebar: {
      backgroundColor: "#ffffff",
      color: "#607489",
    },
    menu: {
      menuContent: "#fbfcfd",
      icon: "#0098e5",
      hover: {
        backgroundColor: "#c5e4ff",
        color: "#44596e",
      },
      disabled: {
        color: "#9fb6cf",
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: "#0b2948",
      color: "#8ba1b7",
    },
    menu: {
      menuContent: "#082440",
      icon: "#59d0ff",
      hover: {
        backgroundColor: "#00458b",
        color: "#b6c8d9",
      },
      disabled: {
        color: "#3e5e7e",
      },
    },
  },
};

//  const MenuItemStyles = {
//    root: {
//      fontSize: "13px",
//      fontWeight: 400,
//    },
//    icon: {
//      color: themes[theme].menu.icon,
//      [`&.${menuClasses.disabled}`]: {
//        color: themes[theme].menu.disabled.color,
//      },
//    },
//    SubMenuExpandIcon: {
//      color: "#b6b7b9",
//    },
//    subMenuContent: ({ level }) => ({
//      backgroundColor:
//        level === 0
//          ? hexToRgba(
//              themes[theme].menu.menuContent,
//              hasImage && !collapsed ? 0.4 : 1
//            )
//          : "transparent",
//    }),
//    button: {
//      [`&.${menuClasses.disabled}`]: {
//        color: themes[theme].menu.disabled.color,
//      },
//      "&:hover": {
//        backgroundColor: hexToRgba(
//          themes[theme].menu.hover.backgroundColor,
//          hasImage ? 0.8 : 1
//        ),
//        color: themes[theme].menu.hover.color,
//      },
//    },
//    label: ({ open }) => ({
//      fontWeight: open ? 600 : undefined,
//    }),
//  };
