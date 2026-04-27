import { create } from "zustand";
import type { ToastType } from "@/shared/types/api.types";

interface ToastState {
  open: boolean;
  message: string;
  type: ToastType;

  /**
   * Show a toast notification.
   * Callable from anywhere — inside or outside React components.
   *
   * @example
   * // From a React component:
   * const { showToast } = useToastStore();
   * showToast('Saved!', 'success');
   *
   * // From httpClient or any non-React code:
   * useToastStore.getState().showToast('Error!', 'error');
   */
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  open: false,
  message: "",
  type: "info",

  showToast: (message, type = "info") => {
    set({ open: true, message, type });
  },

  hideToast: () => {
    set({ open: false });
  },
}));
