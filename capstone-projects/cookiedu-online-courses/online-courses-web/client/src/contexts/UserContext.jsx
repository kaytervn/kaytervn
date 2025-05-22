import { createContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: localStorage.getItem("token"),
    email: null,
    name: null,
    picture: null,
    phone: null,
    role: null,
    createdCourses: [],
    cartId: localStorage.getItem("cartId"),
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
