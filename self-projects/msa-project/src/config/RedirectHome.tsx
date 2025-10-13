/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../config/GlobalProvider";
import { AUTH_CONFIG, PAGE_CONFIG } from "./PageConfig";
import { useAuthProvider } from "./AuthProvider";

const RedirectHome = () => {
  const { profile } = useGlobalContext();
  const { loading } = useAuthProvider();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (profile) {
      navigate(PAGE_CONFIG.PLATFORM.path);
    } else {
      navigate(AUTH_CONFIG.LOGIN.path);
    }
  }, [profile, loading]);

  return null;
};

export default RedirectHome;
