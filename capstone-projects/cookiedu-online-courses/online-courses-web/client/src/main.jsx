import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import UserProvider from "./contexts/UserContext.jsx";
import UsersProvider from "./contexts/UsersContext.jsx";
import CartProvider from "./contexts/CartContext.jsx";
import CoursesProvider from "./contexts/CoursesContext.jsx";
import NotificationProvider from "./contexts/NotificationContext .jsx";
import StatisticsProvider from "./contexts/StatisticsContext.jsx";
import UserDetail from "./pages/admin/UserDetail.jsx";
import UserDetailProvider from "./contexts/UserDetailContext.jsx";
import StatisticsInstructorProvider from "./contexts/StatisticsIntructorContext.jsx";
import CoursesByUserProvider, {
  CoursesByUserContext,
} from "./contexts/CoursesByUserContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CoursesByUserProvider>
      <StatisticsProvider>
        <StatisticsInstructorProvider>
          <NotificationProvider>
            <UserDetailProvider>
              <CoursesProvider>
                <CartProvider>
                  <CoursesProvider>
                    <UsersProvider>
                      <UserProvider>
                        <App />
                      </UserProvider>
                    </UsersProvider>
                  </CoursesProvider>
                </CartProvider>
              </CoursesProvider>
            </UserDetailProvider>
          </NotificationProvider>
        </StatisticsInstructorProvider>
      </StatisticsProvider>
    </CoursesByUserProvider>
  </React.StrictMode>
);
