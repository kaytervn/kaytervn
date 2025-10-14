/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, createContext, useState } from "react";
import useApi from "../hooks/useApi";
import { getStorageData, removeSessionCache } from "../services/storages";
import { LOCAL_STORAGE, USER_KIND } from "../services/constant";
import { jwtDecode } from "jwt-decode";
import { useGlobalContext } from "./GlobalProvider";

export const AuthContext = createContext<{
  loading: boolean;
}>({
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setAuthorities, setProfile, isUnauthorized } = useGlobalContext();
  const { user } = useApi();
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setLoading(false);
    setProfile(null);
    removeSessionCache();
  };

  const getProfile = async () => {
    const res = await user.profile();
    if (res?.result) {
      const data = res.data;
      if (data.kind === USER_KIND.ADMIN) {
        logout();
      } else {
        setProfile(res.data);
        setLoading(false);
      }
    } else {
      logout();
    }
  };

  useEffect(() => {
    const accessToken = getStorageData(LOCAL_STORAGE.ACCESS_TOKEN);
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const decoded: any = jwtDecode(accessToken);
      const roles = decoded?.authorities || [];
      setAuthorities(roles);
      getProfile();
    } catch {
      logout();
    }
  }, []);

  useEffect(() => {
    if (isUnauthorized) {
      logout();
      window.location.href = "/";
    }
  }, [isUnauthorized]);

  return (
    <AuthContext.Provider value={{ loading }}>{children}</AuthContext.Provider>
  );
};

export const useAuthProvider = () => useContext(AuthContext);
