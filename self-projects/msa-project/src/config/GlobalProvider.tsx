/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  useContext,
  useEffect,
  useRef,
  useState,
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import useWebSocket from "../hooks/useWebSocket";
import {
  LOCAL_STORAGE,
  SESSION_KEY_TIMEOUT,
  TEXT,
  TOAST,
} from "../services/constant";
import { getStorageData, setStorageData } from "../services/storages";
import { useToast } from "./ToastProvider";

const GlobalContext = createContext<{
  authorities: any;
  setAuthorities: Dispatch<SetStateAction<any>>;
  profile: any;
  setProfile: Dispatch<SetStateAction<any>>;
  hasRoles: (role: string | string[]) => boolean;
  hasAnyRoles: (role: string | string[]) => boolean;
  isUnauthorized: boolean;
  setIsUnauthorized: Dispatch<SetStateAction<any>>;
  sessionKey: any;
  setSessionKey: Dispatch<SetStateAction<any>>;
  refreshSessionTimeout: () => void;
  message: any;
  sendMessage: (message: any) => void;
}>({
  authorities: [],
  setAuthorities: () => {},
  profile: null,
  setProfile: () => {},
  hasRoles: () => false,
  hasAnyRoles: () => false,
  isUnauthorized: false,
  setIsUnauthorized: () => {},
  sessionKey: null,
  setSessionKey: () => {},
  refreshSessionTimeout: () => {},
  message: null,
  sendMessage: () => {},
});

export const GlobalProvider = ({ children }: any) => {
  const { showToast } = useToast();
  const { message, sendMessage } = useWebSocket();
  const [authorities, setAuthorities] = useState<any>([]);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [profile, setProfile] = useState<any>(null);

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
  const timeoutIdRef = useRef<any>(null);

  const startSessionTimeout = (remainingTime: number = SESSION_KEY_TIMEOUT) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(() => {
      setSessionKey(null);
      showToast(TEXT.SESSION_KEY_TIMEOUT, TOAST.WARN as any);
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

  const hasRoles = (roles?: string | string[]) => {
    if (!roles) return true;
    if (typeof roles === "string") return authorities.includes(roles);
    return roles.some((r) => authorities.includes(r));
  };

  const hasAnyRoles = (roles: string | string[]) => {
    if (typeof roles === "string") {
      return authorities.includes(roles);
    }
    return roles.some((role) => authorities.includes(role));
  };

  return (
    <GlobalContext.Provider
      value={{
        authorities,
        setAuthorities,
        hasRoles,
        hasAnyRoles,
        message,
        sendMessage,
        profile,
        setProfile,
        isUnauthorized,
        setIsUnauthorized,
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
