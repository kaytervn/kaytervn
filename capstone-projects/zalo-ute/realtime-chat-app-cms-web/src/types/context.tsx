import {
  createContext,
  SetStateAction,
  useContext,
  Dispatch,
  useState,
} from "react";

const GlobalContext = createContext<{
  profile: any;
  setProfile: Dispatch<SetStateAction<any>>;
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}>({
  profile: null,
  setProfile: () => {},
  isCollapsed: false,
  setIsCollapsed: () => {},
});

export const GlobalProvider = ({ children }: any) => {
  const [profile, setProfile] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState<any>(false);

  return (
    <GlobalContext.Provider
      value={{ profile, setProfile, isCollapsed, setIsCollapsed }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
