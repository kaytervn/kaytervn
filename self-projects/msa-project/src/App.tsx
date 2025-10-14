import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuthProvider } from "./config/AuthProvider";
import { useGlobalContext } from "./config/GlobalProvider";
import Loading from "./pages/others/Loading";
import { AUTH_CONFIG, PAGE_CONFIG } from "./config/PageConfig";
import RedirectHome from "./config/RedirectHome";
import NotFound from "./pages/others/NotFound";

const App = () => {
  const { profile } = useGlobalContext();
  const { loading } = useAuthProvider();

  return (
    <BrowserRouter>
      {loading ? (
        <Loading />
      ) : (
        <Routes>
          {profile
            ? Object.values(PAGE_CONFIG).map(({ path, element }: any) => (
                <Route key={path} path={path} element={element} />
              ))
            : Object.values(AUTH_CONFIG).map(({ path, element }: any) => (
                <Route key={path} path={path} element={element} />
              ))}
          {/* <Route path="/" element={<RedirectHome />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
