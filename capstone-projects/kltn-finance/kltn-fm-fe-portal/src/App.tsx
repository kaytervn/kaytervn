import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import NotFound from "./pages/NotFound";
import Loading from "./pages/Loading";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { useGlobalContext } from "./components/config/GlobalProvider";
import useApi from "./hooks/useApi";
import { getStorageData } from "./services/storages";
import { GRANT_TYPE, LOCAL_STORAGE } from "./services/constant";
import { getRoles } from "./services/utils";
import RedirectHome from "./components/redirect/RedirectHome";
import LoginQrCode from "./pages/auth/LoginQrCode";
import InternalChatPage from "./pages/chat/InternalChatPage";

const App = () => {
  const [tokenData, setTokenData] = useState<any>(null);
  const {
    profile,
    setTenantInfo,
    getSidebarMenus,
    setProfile,
    getRouters,
    setAuthorities,
    setIsCustomer,
    isCustomer,
  } = useGlobalContext();
  const { auth, loading } = useApi();

  useEffect(() => {
    const accessToken = getStorageData(LOCAL_STORAGE.ACCESS_TOKEN);
    if (!accessToken) return;
    try {
      const decoded: any = jwtDecode(accessToken);
      setTokenData(decoded);
      setAuthorities(getRoles(decoded?.authorities || []));
      setIsCustomer(decoded.grant_type === GRANT_TYPE.CUSTOMER);
    } catch (error) {}
  }, []);

  useEffect(() => {
    const fetchAuthData = async () => {
      if (!tokenData) return;

      try {
        const [prof, tenant] = await Promise.all([
          auth.profile(),
          auth.myLocation(),
        ]);

        if (!prof.result || !tenant.result) {
          setProfile(null);
          setTenantInfo(null);
          return;
        }

        setProfile(prof.data);
        setTenantInfo(tenant.data);
      } catch (error) {
        setProfile(null);
        setTenantInfo(null);
      }
    };
    fetchAuthData();
  }, [tokenData]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            {profile && getSidebarMenus().length > 0 ? (
              <>
                <Route path="/" element={<RedirectHome />} />
                {!isCustomer && (
                  <Route path="/chat" element={<InternalChatPage />} />
                )}
                {getRouters().map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
              </>
            ) : (
              <>
                <Route path="/" element={<Login />} />
                <Route path="/login-qr" element={<LoginQrCode />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
