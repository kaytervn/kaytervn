import { useContext } from "react";
import { UserContext } from "../src/contexts/UserContext";
import { Navigate, Outlet } from "react-router-dom";

const VerifyRoutes = () => {
  const { user } = useContext(UserContext);

  return user.email ? <Outlet /> : <Navigate to="/register" />;
};

export default VerifyRoutes;
