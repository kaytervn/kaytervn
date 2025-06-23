import { useGlobalContext } from "../config/GlobalProvider";
import Profile from "../../pages/profile/Profile";
import ProfileEmployee from "../../pages/profile/ProfileEmployee";

const RedirecProfile = () => {
  const { isCustomer } = useGlobalContext();
  if (isCustomer) {
    return <Profile />;
  } else {
    return <ProfileEmployee />;
  }
};

export default RedirecProfile;
