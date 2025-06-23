import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "codemirror/lib/codemirror.css";
import { GlobalProvider } from "./components/config/GlobalProvider.tsx";
import MyToastContainer from "./components/page/MyToastContainer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalProvider>
      <MyToastContainer />
      <App />
    </GlobalProvider>
  </StrictMode>
);
