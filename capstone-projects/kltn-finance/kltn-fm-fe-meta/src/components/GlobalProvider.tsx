import {
  createContext,
  SetStateAction,
  useContext,
  Dispatch,
  useState,
  useEffect,
} from "react";
import banner from "../assets/cms.png";
import { LOCAL_STORAGE, TOAST } from "../services/constant";
import { getStorageData, setStorageData } from "../services/storages";
import { PAGE_CONFIG, SIDEBAR_MENUS } from "./PageConfig";
import { jwtDecode } from "jwt-decode";
import { getRoles } from "../services/utils";
import { toast } from "react-toastify";
import useWebSocket from "../hooks/useWebSocket";

const GlobalContext = createContext<{
  authorities: any;
  imgSrc: any;
  setImgSrc: Dispatch<SetStateAction<any>>;
  collapsedGroups: { [key: string]: boolean };
  setCollapsedGroups: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  profile: any;
  setProfile: Dispatch<SetStateAction<any>>;
  getRouters: () => any[];
  getSidebarMenus: () => any[];
  hasRoles: (role: string | string[]) => boolean;
  hasAnyRoles: (role: string | string[]) => boolean;
  setToast: (msg: string | null, type?: any) => void;
  isUnauthorized: boolean;
  setIsUnauthorized: Dispatch<SetStateAction<any>>;
  message: any;
  sendMessage: (message: any) => void;
}>({
  authorities: [],
  imgSrc: null,
  setImgSrc: () => {},
  collapsedGroups: {},
  setCollapsedGroups: () => {},
  profile: null,
  setProfile: () => {},
  getRouters: () => [],
  getSidebarMenus: () => [],
  hasRoles: () => false,
  hasAnyRoles: () => false,
  setToast: () => {},
  isUnauthorized: false,
  setIsUnauthorized: () => {},
  message: null,
  sendMessage: () => {},
});

export const GlobalProvider = ({ children }: any) => {
  const { message, sendMessage } = useWebSocket();
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [authorities, setAuthorities] = useState<any>([]);
  const [imgSrc, setImgSrc] = useState<any>(banner);
  const [collapsedGroups, setCollapsedGroups] = useState(
    getStorageData(LOCAL_STORAGE.COLLAPSED_GROUPS, {})
  );
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    setStorageData(LOCAL_STORAGE.COLLAPSED_GROUPS, collapsedGroups);
  }, [collapsedGroups]);

  useEffect(() => {
    if (profile) {
      const data: any = jwtDecode(getStorageData(LOCAL_STORAGE.ACCESS_TOKEN));
      setAuthorities(getRoles(data?.authorities || []));
    }
  }, [profile]);

  const getRouters = () => {
    return Object.values(PAGE_CONFIG).filter((route: any) =>
      authorities.some(
        (auth: string) => route.path && (!route.role || auth === route.role)
      )
    );
  };

  const getSidebarMenus = () => {
    const allowedRoutes = new Set(getRouters().map((route: any) => route.name));
    return SIDEBAR_MENUS.map((group) => ({
      ...group,
      items: group.items.filter((item) => allowedRoutes.has(item.name)),
    })).filter((group) => group.items.length > 0);
  };

  const hasRoles = (roles: string | string[]) => {
    if (typeof roles === "string") {
      return authorities.includes(roles);
    }
    return roles.every((role) => authorities.includes(role));
  };

  const hasAnyRoles = (roles: string | string[]) => {
    if (typeof roles === "string") {
      return authorities.includes(roles);
    }
    return roles.some((role) => authorities.includes(role));
  };

  const setToast = (
    msg: string | null,
    type: "success" | "error" | "warn" = "success"
  ) => {
    if (!msg) return;
    switch (type) {
      case TOAST.SUCCESS:
        toast.success(msg);
        break;
      case TOAST.ERROR:
        toast.error(msg);
        break;
      case TOAST.WARN:
        toast.warn(msg);
        break;
      default:
        toast.info(msg);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        authorities,
        imgSrc,
        setImgSrc,
        collapsedGroups,
        setCollapsedGroups,
        profile,
        setProfile,
        getRouters,
        getSidebarMenus,
        hasRoles,
        hasAnyRoles,
        setToast,
        isUnauthorized,
        setIsUnauthorized,
        message,
        sendMessage,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
