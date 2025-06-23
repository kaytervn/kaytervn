import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useGlobalContext } from "./components/GlobalProvider";
import Loading from "./pages/Loading";
import Login from "./pages/auth/Login";
import useApi from "./hooks/useApi";
import RedirectHome from "./components/RedirectHome";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

const App = () => {
  const { profile, getSidebarMenus, setProfile, getRouters } =
    useGlobalContext();
  const { auth, loading } = useApi();

  useEffect(() => {
    const getProfile = async () => {
      const res: any = await auth.profile();
      if (res?.result) {
        setProfile(res.data);
      } else {
        setProfile(null);
      }
    };
    getProfile();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <BrowserRouter>
            <Routes>
              {profile && getSidebarMenus().length > 0 ? (
                <>
                  <Route path="/" element={<RedirectHome />} />
                  {getRouters().map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                  ))}
                </>
              ) : (
                <>
                  <Route path="/" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                </>
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </>
      )}
    </>
  );
};

export default App;
