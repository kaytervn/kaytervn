import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Register from "./views/Register";
import ForgotPassword from "./views/ForgotPassword";
import Home from "./views/Home";
import Verify from "./views/Verify";
// import PostPage from "./views/PostPage";
// import Friend from "./views/Friend";
import NotFound from "./views/NotFound";
import Loading from "./views/Loading";
import { useEffect, useState } from "react";
import useFetch from "./hooks/useFetch";
import { ToastContainer } from "react-toastify";
import { ZALO_UTE_PORTAL_ACCESS_TOKEN } from "./types/constant";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { post, loading } = useFetch();

  useEffect(() => {
    const checkToken = async () => {
      const token = await localStorage.getItem(ZALO_UTE_PORTAL_ACCESS_TOKEN);
      const res = await post("/v1/user/verify-token", { accessToken: token });
      if (res.result) {
        setIsAuthenticated(true);
      } else {
        await localStorage.removeItem(ZALO_UTE_PORTAL_ACCESS_TOKEN);
        setIsAuthenticated(false);
      }
    };
    
    checkToken();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <BrowserRouter>
            <Routes>
              {isAuthenticated ? (
                <>
                  <Route path="/" element={<Home />} />
                  {/* <Route path="/friends" element={<Friend />} /> */}
                  {/* <Route path="/postPage" element={<PostPage />} /> */}
                </>
              ) : (
                <>
                  <Route path="/" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify" element={<Verify />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </>
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer/>
        </>
      )}
    </>
  );
};

export default App;
