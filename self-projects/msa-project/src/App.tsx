import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AUTH_CONFIG } from "./config/PageConfigDetails";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const AUTH_CONFIG_FILTERED = Object.values(AUTH_CONFIG).filter(
  (item: any) => item.path && item.element
);

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {AUTH_CONFIG_FILTERED.map(({ path, element }: any) => (
            <Route path={path} element={element} />
          ))}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
