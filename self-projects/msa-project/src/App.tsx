/* eslint-disable react-hooks/exhaustive-deps */
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AUTH_CONFIG } from "./config/PageConfigDetails";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGlobalContext } from "./config/GlobalProvider";
import useApi from "./hooks/useApi";
import { getStorageData } from "./services/storages";
import { LOCAL_STORAGE } from "./services/constant";
import { jwtDecode } from "jwt-decode";
import { getRoles } from "./services/utils";
import Loading from "./pages/others/Loading";
import NotFound from "./pages/others/NotFound";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const AUTH_CONFIG_FILTERED = Object.values(AUTH_CONFIG).filter(
  (item: any) => item.path && item.element
);

const App = () => {
  const [tokenData, setTokenData] = useState<any>(null);
  const { profile, setProfile, getRouters, setAuthorities, getSidebarMenus } =
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
    const fetchAuthData = async () => {
      if (!tokenData) return;
      try {
        const res = await user.profile();
        if (!res.result) {
          setProfile(null);
          return;
        }
        setProfile(res.data);
      } catch {
        setProfile(null);
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
            {profile ? (
              <>
                {getRouters().map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
              </>
            ) : (
              AUTH_CONFIG_FILTERED.map(({ path, element }: any) => (
                <Route key={path} path={path} element={element} />
              ))
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
};

export default App;
