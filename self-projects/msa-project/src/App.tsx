/* eslint-disable react-hooks/exhaustive-deps */
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AUTH_CONFIG } from "./config/PageConfigDetails";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGlobalContext } from "./config/GlobalProvider";
import useApi from "./hooks/useApi";
import { getStorageData, removeSessionCache } from "./services/storages";
import { LOCAL_STORAGE, USER_KIND } from "./services/constant";
import { jwtDecode } from "jwt-decode";
import { getRoles } from "./services/utils";
import Loading from "./pages/others/Loading";
import NotFound from "./pages/others/NotFound";
import { PAGE_CONFIG } from "./config/PageConfig";
import RedirectHome from "./config/RedirectHome";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const AUTH_CONFIG_FILTERED = Object.values(AUTH_CONFIG).filter(
  (item: any) => item.path && item.element
);

const PAGE_CONFIG_FILTERED = Object.values(PAGE_CONFIG).filter(
  (item: any) => item.path && item.element
);

const App = () => {
  const [tokenData, setTokenData] = useState<any>(null);
  const { profile, setProfile, setAuthorities, authorities } =
    useGlobalContext();
  const { user, loading } = useApi();

  useEffect(() => {
    const accessToken = getStorageData(LOCAL_STORAGE.ACCESS_TOKEN);
    if (!accessToken) return;
    try {
      const decoded: any = jwtDecode(accessToken);
      setTokenData(decoded);
      setAuthorities(getRoles(decoded?.authorities || []));
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    const removeSession = () => {
      removeSessionCache();
      setProfile(null);
    };

    const fetchAuthData = async () => {
      if (!tokenData) return;
      try {
        const res = await user.profile();
        if (!res.result) {
          removeSession();
          return;
        }
        const data = res.data;
        if (data.kind === USER_KIND.ADMIN) {
          removeSession();
          return;
        }
        setProfile(res.data);
      } catch {
        removeSession();
      }
    };
    fetchAuthData();
  }, [tokenData]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            {profile && authorities.length > 0
              ? PAGE_CONFIG_FILTERED.map(({ path, element }: any) => (
                  <Route key={path} path={path} element={element} />
                ))
              : AUTH_CONFIG_FILTERED.map(({ path, element }: any) => (
                  <Route key={path} path={path} element={element} />
                ))}
            <Route path="/" element={<RedirectHome />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
};

export default App;
