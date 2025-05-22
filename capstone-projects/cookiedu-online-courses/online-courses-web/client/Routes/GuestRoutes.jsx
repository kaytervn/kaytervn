import { useContext } from "react";
import { UserContext } from "../src/contexts/UserContext";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoutes = () => {
  const { user } = useContext(UserContext);

  return !user.token ? <Outlet /> : <Navigate to="/" />;
};

export default GuestRoutes;
