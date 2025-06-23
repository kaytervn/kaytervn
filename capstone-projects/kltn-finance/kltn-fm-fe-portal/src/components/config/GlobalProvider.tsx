import {
  createContext,
  SetStateAction,
  useContext,
  Dispatch,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  LOCAL_STORAGE,
  SESSION_KEY_TIMEOUT,
  TOAST,
} from "../../services/constant";
import { getStorageData, setStorageData } from "../../services/storages";
import { toast } from "react-toastify";
import useWebSocket from "../../hooks/useWebSocket";
import { PAGE_CONFIG, SIDEBAR_MENUS } from "./PageConfig";

const GlobalContext = createContext<{
  authorities: any;
  setAuthorities: Dispatch<SetStateAction<any>>;
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
  tenantInfo: any;
  setTenantInfo: Dispatch<SetStateAction<any>>;
  isCustomer: any;
  setIsCustomer: Dispatch<SetStateAction<any>>;
  isSystemNotReady: any;
  setIsSystemNotReady: Dispatch<SetStateAction<any>>;
  sessionKey: any;
  setSessionKey: Dispatch<SetStateAction<any>>;
  refreshSessionTimeout: () => void;
}>({
  authorities: [],
  setAuthorities: () => {},
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
  tenantInfo: null,
  setTenantInfo: () => {},
  isCustomer: false,
  setIsCustomer: () => {},
  isSystemNotReady: false,
  setIsSystemNotReady: () => {},
  sessionKey: null,
  setSessionKey: () => {},
  refreshSessionTimeout: () => {},
});

export const GlobalProvider = ({ children }: any) => {
  const { message, sendMessage } = useWebSocket();
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isSystemNotReady, setIsSystemNotReady] = useState(false);
  const [isCustomer, setIsCustomer] = useState<any>(null);
  const [authorities, setAuthorities] = useState<any>([]);
  const [collapsedGroups, setCollapsedGroups] = useState(
    getStorageData(LOCAL_STORAGE.COLLAPSED_GROUPS, {})
  );
  const [profile, setProfile] = useState<any>(null);
  const [tenantInfo, setTenantInfo] = useState<any>(null);
  const [sessionKey, setSessionKey] = useState<any>(() => {
    const storedSession = getStorageData(LOCAL_STORAGE.SESSION_KEY, null);
    if (storedSession) {
      const { key, expirationTime } = storedSession;
      const currentTime = Date.now();
      if (currentTime < expirationTime) {
        return key;
      } else {
        localStorage.removeItem(LOCAL_STORAGE.SESSION_KEY);
        return null;
      }
    }
    return null;
  });
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const startSessionTimeout = (remainingTime: number = SESSION_KEY_TIMEOUT) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(() => {
      setSessionKey(null);
      setToast("Phiên giải mã hết hạn", TOAST.WARN as any);
      localStorage.removeItem(LOCAL_STORAGE.SESSION_KEY);
      timeoutIdRef.current = null;
    }, remainingTime);
  };

  const saveSessionToStorage = (key: any) => {
    if (key) {
      const expirationTime = Date.now() + SESSION_KEY_TIMEOUT;
      setStorageData(LOCAL_STORAGE.SESSION_KEY, {
        key,
        expirationTime,
      });
      startSessionTimeout(SESSION_KEY_TIMEOUT);
    } else {
      localStorage.removeItem(LOCAL_STORAGE.SESSION_KEY);
    }
  };

  useEffect(() => {
    if (sessionKey) {
      const storedSession = getStorageData(LOCAL_STORAGE.SESSION_KEY, null);
      if (storedSession) {
        const { expirationTime } = storedSession;
        const currentTime = Date.now();
        const remainingTime = Math.max(0, expirationTime - currentTime);
        startSessionTimeout(remainingTime);
      }
    } else if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
  }, [sessionKey]);

  useEffect(() => {
    saveSessionToStorage(sessionKey);
  }, [sessionKey]);

  const refreshSessionTimeout = () => {
    if (!sessionKey) {
      return;
    }
    startSessionTimeout(SESSION_KEY_TIMEOUT);
    saveSessionToStorage(sessionKey);
  };

  useEffect(() => {
    setStorageData(LOCAL_STORAGE.COLLAPSED_GROUPS, collapsedGroups);
  }, [collapsedGroups]);

  const getRouters = () => {
    return Object.values(PAGE_CONFIG).filter((route: any) =>
      authorities.some(
        (auth: string) => route.path && (!route.role || auth === route.role)
      )
    );
  };

  const getSidebarMenus = () => {
    const allowedRoutes = new Set(getRouters().map((route: any) => route.name));
    return SIDEBAR_MENUS.map((group: any) => ({
      ...group,
      items: group.items.filter((item: any) => allowedRoutes.has(item.name)),
    })).filter((group: any) => group.items.length > 0);
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
        setAuthorities,
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
        tenantInfo,
        setTenantInfo,
        isCustomer,
        setIsCustomer,
        isSystemNotReady,
        setIsSystemNotReady,
        sessionKey,
        setSessionKey,
        refreshSessionTimeout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
