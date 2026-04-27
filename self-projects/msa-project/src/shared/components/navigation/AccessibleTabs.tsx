import React, { useEffect, useState, type SyntheticEvent } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

interface TabItem {
  label: string;
  path: string;
}

interface AccessibleTabsProps {
  tabs: TabItem[];
}

export const AccessibleTabs: React.FC<AccessibleTabsProps> = React.memo(
  ({ tabs }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const currentIndex = tabs.findIndex((tab) =>
      location.pathname.startsWith(tab.path),
    );

    const [value, setValue] = useState(
      currentIndex === -1 ? 0 : currentIndex,
    );

    useEffect(() => {
      if (currentIndex !== -1 && currentIndex !== value) {
        setValue(currentIndex);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
      setValue(newValue);
      navigate(tabs[newValue].path);
    };

    return (
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Tabs
          onChange={handleChange}
          value={value}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>
    );
  },
);

AccessibleTabs.displayName = "AccessibleTabs";
