/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../config/GlobalProvider";

const RedirectHome = () => {
  const { getSidebarMenus } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    const sidebarMenus = getSidebarMenus();
    if (sidebarMenus.length > 0 && sidebarMenus[0].items.length > 0) {
      navigate(sidebarMenus[0].items[0].path);
    }
  }, [getSidebarMenus]);

  return null;
};

export default RedirectHome;
