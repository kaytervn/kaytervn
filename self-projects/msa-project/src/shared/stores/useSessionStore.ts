import { create } from "zustand";
import { LOCAL_STORAGE, SESSION_KEY_TIMEOUT, TOAST } from "@/shared/constants";
import { TEXT } from "@/shared/constants/text";
import {
  getSessionFromStorage,
  setStorageData,
} from "@/shared/services/storage";
import { useToastStore } from "./useToastStore";

interface SessionState {
  /** Decrypted session key used for user-level encryption */
  sessionKey: string | null;

  setSessionKey: (key: string | null) => void;
  /** Restart the session timeout (call on successful API requests) */
  refreshSessionTimeout: () => void;
}

/** Timeout handle stored outside state to avoid serialization issues */
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const clearSessionTimeout = (): void => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
};

const startSessionTimeout = (
  set: (partial: Partial<SessionState>) => void,
  remainingMs: number = SESSION_KEY_TIMEOUT,
): void => {
  clearSessionTimeout();
  timeoutId = setTimeout(() => {
    set({ sessionKey: null });
    useToastStore.getState().showToast(TEXT.SESSION_KEY_TIMEOUT, TOAST.WARN);
    localStorage.removeItem(LOCAL_STORAGE.SESSION_KEY);
    timeoutId = null;
  }, remainingMs);
};

const saveSessionToStorage = (
  key: string | null,
  set: (partial: Partial<SessionState>) => void,
): void => {
  if (key) {
    const expirationTime = Date.now() + SESSION_KEY_TIMEOUT;
    setStorageData(LOCAL_STORAGE.SESSION_KEY, { key, expirationTime });
    startSessionTimeout(set, SESSION_KEY_TIMEOUT);
  } else {
    localStorage.removeItem(LOCAL_STORAGE.SESSION_KEY);
    clearSessionTimeout();
  }
};

/** Initialize session key from storage if still valid */
const initSessionKey = (): string | null => {
  const stored = getSessionFromStorage();
  return stored?.key ?? null;
};

export const useSessionStore = create<SessionState>((set) => ({
  sessionKey: initSessionKey(),

  setSessionKey: (key) => {
    set({ sessionKey: key });
    saveSessionToStorage(key, set);
  },

  refreshSessionTimeout: () => {
    const { sessionKey } = useSessionStore.getState();
    if (!sessionKey) return;
    startSessionTimeout(set, SESSION_KEY_TIMEOUT);
    saveSessionToStorage(sessionKey, set);
  },
}));

// Start timeout for existing session on store creation
const initialKey = useSessionStore.getState().sessionKey;
if (initialKey) {
  const stored = getSessionFromStorage();
  if (stored) {
    const remaining = Math.max(0, stored.expirationTime - Date.now());
    startSessionTimeout(useSessionStore.setState, remaining);
  }
}
