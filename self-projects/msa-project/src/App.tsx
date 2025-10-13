/* eslint-disable react-hooks/exhaustive-deps */
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useGlobalContext } from "./config/GlobalProvider";
import Loading from "./pages/others/Loading";
import NotFound from "./pages/others/NotFound";
import { AUTH_CONFIG, PAGE_CONFIG } from "./config/PageConfig";
import RedirectHome from "./config/RedirectHome";
import { useAuthProvider } from "./config/AuthProvider";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  const { profile } = useGlobalContext();
  const { loading } = useAuthProvider();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
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
            <Route path="/" element={<RedirectHome />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
