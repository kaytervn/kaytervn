/* eslint-disable react-hooks/exhaustive-deps */
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AUTH_CONFIG } from "./config/PageConfigDetails";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useGlobalContext } from "./config/GlobalProvider";
import Loading from "./pages/others/Loading";
import NotFound from "./pages/others/NotFound";
import { PAGE_CONFIG } from "./config/PageConfig";
import RedirectHome from "./config/RedirectHome";
import { useAuthProvider } from "./config/AuthProvider";

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
  const { profile } = useGlobalContext();
  const { loading } = useAuthProvider();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            {profile
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
