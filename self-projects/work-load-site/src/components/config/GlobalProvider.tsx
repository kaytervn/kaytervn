/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  SetStateAction,
  useContext,
  Dispatch,
  useState,
  useEffect,
  useRef,
} from "react";
import { getRandomGif } from "../../types/utils";
import { getStorageData, setStorageData } from "../../services/storages";
import {
  LOCAL_STORAGE,
  SESSION_KEY_TIMEOUT,
  TOAST,
} from "../../types/constant";
import { toast } from "react-toastify";
import useSocket from "../../hooks/useSocket";

const GlobalContext = createContext<{
  imgSrc: any;
  setImgSrc: Dispatch<SetStateAction<any>>;
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<any>>;
  collapsedGroups: any;
  setCollapsedGroups: Dispatch<SetStateAction<any>>;
  msaCollapsedGroups: any;
  setMsaCollapsedGroups: Dispatch<SetStateAction<any>>;
  setToast: (msg: string | null, type?: any) => void;
  profile: any;
  setProfile: Dispatch<SetStateAction<any>>;
  isUnauthorized: boolean;
  setIsUnauthorized: Dispatch<SetStateAction<any>>;
  sessionKey: any;
  setSessionKey: Dispatch<SetStateAction<any>>;
  refreshSessionTimeout: () => void;
  emit: any;
  on: any;
  off: any;
  apiKey: any;
  setApiKey: Dispatch<SetStateAction<any>>;
  nLessonsCollapsedGroups: { [key: string]: boolean };
  setNLessonsCollapsedGroups: Dispatch<
    SetStateAction<{ [key: string]: boolean }>
  >;
}>({
  imgSrc: null,
  setImgSrc: () => {},
  isCollapsed: false,
  setIsCollapsed: () => {},
  collapsedGroups: {},
  setCollapsedGroups: () => {},
  msaCollapsedGroups: {},
  setMsaCollapsedGroups: () => {},
  setToast: () => {},
  profile: null,
  setProfile: () => {},
  isUnauthorized: false,
  setIsUnauthorized: () => {},
  sessionKey: null,
  setSessionKey: () => {},
  refreshSessionTimeout: () => {},
  emit: () => {},
  on: () => {},
  off: () => {},
  apiKey: null,
  setApiKey: () => {},
  nLessonsCollapsedGroups: {},
  setNLessonsCollapsedGroups: () => {},
});

export const GlobalProvider = ({ children }: any) => {
  const [nLessonsCollapsedGroups, setNLessonsCollapsedGroups] = useState(
    getStorageData(LOCAL_STORAGE.N_LESSONS_COLLAPSED_GROUPS, {})
  );
  const [apiKey, setApiKey] = useState<any>(
    getStorageData(LOCAL_STORAGE.N_LESSONS_API_KEY, null)
  );
  const { emit, on, off } = useSocket();
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
      setToast("Session key timeout", TOAST.WARN as any);
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

  const [imgSrc, setImgSrc] = useState<any>(getRandomGif());
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    getStorageData(LOCAL_STORAGE.IS_COLLAPSED, false)
  );
  const [msaCollapsedGroups, setMsaCollapsedGroups] = useState(
    getStorageData(LOCAL_STORAGE.MSA_COLLAPSED_GROUPS, {})
  );
  const [collapsedGroups, setCollapsedGroups] = useState<{
    [key: string]: boolean;
  }>(getStorageData(LOCAL_STORAGE.COLLAPSED_GROUPS, {}));
  useEffect(() => {
    setStorageData(LOCAL_STORAGE.IS_COLLAPSED, isCollapsed);
  }, [isCollapsed]);
  useEffect(() => {
    setStorageData(LOCAL_STORAGE.COLLAPSED_GROUPS, collapsedGroups);
  }, [collapsedGroups]);

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
        imgSrc,
        setImgSrc,
        isCollapsed,
        setIsCollapsed,
        collapsedGroups,
        setCollapsedGroups,
        msaCollapsedGroups,
        setMsaCollapsedGroups,
        setToast,
        profile,
        setProfile,
        isUnauthorized,
        setIsUnauthorized,
        sessionKey,
        setSessionKey,
        refreshSessionTimeout,
        emit: emit as any,
        on: on as any,
        off: off as any,
        apiKey,
        setApiKey,
        nLessonsCollapsedGroups,
        setNLessonsCollapsedGroups,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export const useGlobalContext = () => useContext(GlobalContext);
