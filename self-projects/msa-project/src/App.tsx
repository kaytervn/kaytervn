import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuthProvider } from "./config/AuthProvider";
import { useGlobalContext } from "./config/GlobalProvider";
import Loading from "./pages/others/Loading";
import { buildRoutes } from "./AppRoutes";

const App = () => {
  const { profile } = useGlobalContext();
  const { loading } = useAuthProvider();
  if (loading) return <Loading />;
  const router = createBrowserRouter(buildRoutes(profile));
  return <RouterProvider router={router} />;
};

export default App;
