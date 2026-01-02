import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ToastProvider } from "./config/ToastProvider.tsx";
import { GlobalProvider } from "./config/GlobalProvider.tsx";
import { AuthProvider } from "./config/AuthProvider.tsx";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { ConfirmProvider } from "./config/ConfirmProvider.tsx";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

createRoot(document.getElementById("root")!).render(
  <ToastProvider>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ConfirmProvider>
        <GlobalProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </GlobalProvider>
      </ConfirmProvider>
    </ThemeProvider>
  </ToastProvider>
);
