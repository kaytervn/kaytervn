import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "codemirror/lib/codemirror.css";
import { GlobalProvider } from "./components/config/GlobalProvider.tsx";
import MyToastContainer from "./components/config/MyToastContainer.tsx";

createRoot(document.getElementById("root")!).render(
  <GlobalProvider>
    <MyToastContainer />
    <App />
  </GlobalProvider>
);
