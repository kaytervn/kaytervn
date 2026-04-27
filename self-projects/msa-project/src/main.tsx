import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/services/queryClient";
import { ToastListener } from "@/app/providers/ToastListener";
import { ConfirmListener } from "@/app/providers/ConfirmListener";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
      <ToastListener />
      <ConfirmListener />
    </ThemeProvider>
  </QueryClientProvider>
);
