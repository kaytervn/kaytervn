import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import UserProvider from "./contexts/UserContext.jsx";
import PostProvider from "./contexts/PostContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PostProvider>
      <UserProvider>
        <GoogleOAuthProvider clientId="508925992394-hivmr2ot5rcm2u6m2bbrc0csl1s7ungo.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </UserProvider>
    </PostProvider>
  </React.StrictMode>
);
