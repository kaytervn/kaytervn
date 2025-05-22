import { defaultThemes } from "react-data-table-component";

export const customStyles = {
  header: {
    style: {
      minHeight: "56px",
    },
  },
  headRow: {
    style: {
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      borderTopColor: defaultThemes.default.divider.default,
      // backgroundColor: defaultThemes.default.background.paper,
      // zIndex: 0,
    },
  },
  headCells: {
    style: {
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      fontSize: "20px",
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: defaultThemes.default.divider.default,
      },
      "&:last-of-type": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: defaultThemes.default.divider.default,
      },
      "&:first-of-type": {
        borderLeftStyle: "solid",
        borderLeftWidth: "1px",
        borderLeftColor: defaultThemes.default.divider.default,
      },
    },
  },
  cells: {
    style: {
      fontSize: "16px",
      "&:not(:last-of-type)": {
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: defaultThemes.default.divider.default,
      },
      "&:last-of-type": {
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: defaultThemes.default.divider.default,
      },
      "&:first-of-type": {
        borderLeftStyle: "solid",
        borderLeftWidth: "1px",
        borderLeftColor: defaultThemes.default.divider.default,
      },
    },
  },
};
