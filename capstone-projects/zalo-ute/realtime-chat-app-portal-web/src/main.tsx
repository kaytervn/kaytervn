import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { UserProvider } from "./types/UserContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
     <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
