/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../config/GlobalProvider";
import { AUTH_CONFIG } from "./PageConfigDetails";
import { PAGE_CONFIG } from "./PageConfig";

const RedirectHome = () => {
  const { profile } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      navigate(PAGE_CONFIG.PLATFORM.path);
    } else {
      navigate(AUTH_CONFIG.LOGIN.path);
    }
  }, [profile]);

  return null;
};

export default RedirectHome;
