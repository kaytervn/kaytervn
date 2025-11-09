/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState, type SyntheticEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PAGE_CONFIG } from "../config/PageConfig";

interface TabItem {
  label: string;
  path: string;
}

interface AccessibleTabsProps {
  tabs: TabItem[];
}

export const AccessibleTabs = ({ tabs }: AccessibleTabsProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = tabs.findIndex((tab) =>
    location.pathname.startsWith(tab.path)
  );

  const [value, setValue] = useState(currentIndex === -1 ? 0 : currentIndex);

  useEffect(() => {
    if (currentIndex !== -1 && currentIndex !== value) {
      setValue(currentIndex);
    }
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
};

export const AccountTabs = () => {
  return <AccessibleTabs tabs={[PAGE_CONFIG.PLATFORM, PAGE_CONFIG.ACCOUNT]} />;
};
