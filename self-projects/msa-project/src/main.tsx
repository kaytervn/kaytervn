import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ToastProvider } from "./config/ToastProvider.tsx";
import { GlobalProvider } from "./config/GlobalProvider.tsx";
import { AuthProvider } from "./config/AuthProvider.tsx";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

createRoot(document.getElementById("root")!).render(
  <ToastProvider>
    <GlobalProvider>
      <AuthProvider>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </AuthProvider>
    </GlobalProvider>
  </ToastProvider>
);
