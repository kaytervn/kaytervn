import React, { createContext, useContext, useState, ReactNode } from "react";
import { Profile } from "../models/profile/Profile";


interface UserContextType {
  profile: Profile | null; // User có thể null nếu chưa đăng nhập
  setProfile: (profile: Profile | null) => void; // Hàm để cập nhật user
}

// Khởi tạo context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Tạo provider để bọc ứng dụng
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null); // State để lưu thông tin user

  return (
    <UserContext.Provider value={{ profile, setProfile }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook để sử dụng UserContext
export const useProfile = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser phải được sử dụng trong UserProvider");
  }
  return context;
};
