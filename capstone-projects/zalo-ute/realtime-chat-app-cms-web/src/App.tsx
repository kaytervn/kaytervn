import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Loading from "./views/Loading";
import useFetch from "./hooks/useFetch";
import NotFound from "./views/NotFound";
import User from "./views/User";
import Post from "./views/Post";
import Role from "./views/Role";
import Statistic from "./views/Statistic";
import Setting from "./views/Setting";
import { useGlobalContext } from "./types/context";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setProfile } = useGlobalContext();
  const { get, post, loading } = useFetch();

  useEffect(() => {
    const checkToken = async () => {
      const token = await localStorage.getItem("accessToken");
      const res = await post("/v1/user/verify-token", { accessToken: token });
      if (res.result) {
        setIsAuthenticated(true);
      } else {
        await localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
      }
    };
    const getProfile = async () => {
      const res = await get("/v1/user/profile");
      setProfile(res.data);
    };
    getProfile();
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
                  <Route path="/" element={<User />} />
                  <Route path="/post" element={<Post />} />
                  <Route path="/statistic" element={<Statistic />} />
                  <Route path="/setting" element={<Setting />} />
                  <Route path="/role" element={<Role />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<Login />} />
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
