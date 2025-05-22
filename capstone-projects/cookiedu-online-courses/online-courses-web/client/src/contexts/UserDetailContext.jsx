import { createContext, useState } from "react";

export const UserDetailContext = createContext();

const UserDetailProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: null,
    email: null,
    name: null,
    picture: null,
    phone: null,
    role: null,
    description: null,
    createdCourses: [],
  });

  return (
    <UserDetailContext.Provider value={{ user, setUser }}>
      {children}
    </UserDetailContext.Provider>
  );
};

export default UserDetailProvider;
