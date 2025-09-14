/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../config/GlobalProvider";
import { AUTH_CONFIG } from "./PageConfigDetails";

const RedirectHome = () => {
  const { profile, getSidebarMenus } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) {
      navigate(AUTH_CONFIG.LOGIN.path);
    } else {
      const sidebarMenus = getSidebarMenus();
      if (sidebarMenus.length > 0 && sidebarMenus[0].items.length > 0) {
        navigate(sidebarMenus[0].items[0].path);
      }
    }
  }, [getSidebarMenus]);

  return null;
};

export default RedirectHome;
