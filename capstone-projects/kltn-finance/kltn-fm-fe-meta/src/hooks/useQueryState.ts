import { useLocation, useNavigate } from "react-router-dom";

const useQueryState = ({ path }: any) => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    navigate(path, { state });
  };

  return {
    handleNavigateBack,
  };
};

export default useQueryState;
