import { create } from "zustand";
import type { UserProfile } from "@/shared/types/common.types";

interface AuthState {
  /** Current authenticated user profile, null when logged out */
  profile: UserProfile | null;
  /** Decoded JWT authorities/roles */
  authorities: string[];
  /** Flag set on 401 — triggers logout flow */
  isUnauthorized: boolean;
  loading: boolean;

  setProfile: (profile: UserProfile | null) => void;
  setAuthorities: (authorities: string[]) => void;
  setIsUnauthorized: (value: boolean) => void;
  setLoading: (value: boolean) => void;

  /** Check if user has ALL of the specified roles */
  hasRoles: (roles?: string | string[]) => boolean;
  /** Check if user has ANY of the specified roles */
  hasAnyRoles: (roles: string | string[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  profile: null,
  authorities: [],
  isUnauthorized: false,
  loading: false,

  setProfile: (profile) => set({ profile }),
  setAuthorities: (authorities) => set({ authorities }),
  setIsUnauthorized: (isUnauthorized) => set({ isUnauthorized }),
  setLoading: (loading) => set({ loading }),

  hasRoles: (roles) => {
    if (!roles) return true;
    const { authorities } = get();
    if (typeof roles === "string") return authorities.includes(roles);
    return roles.every((r) => authorities.includes(r));
  },

  hasAnyRoles: (roles) => {
    const { authorities } = get();
    if (typeof roles === "string") return authorities.includes(roles);
    return roles.some((role) => authorities.includes(role));
  },
}));
