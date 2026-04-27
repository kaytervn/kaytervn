import { create } from "zustand";

interface ConfirmState {
  open: boolean;
  resolver: ((value: boolean) => void) | null;

  /**
   * Open a confirmation dialog and return a Promise that resolves
   * to true (confirmed) or false (cancelled).
   *
   * @example
   * const confirmed = await useConfirmStore.getState().confirm();
   * if (confirmed) { /* proceed * / }
   */
  confirm: () => Promise<boolean>;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  open: false,
  resolver: null,

  confirm: () => {
    return new Promise<boolean>((resolve) => {
      set({ open: true, resolver: resolve });
    });
  },

  handleConfirm: () => {
    get().resolver?.(true);
    set({ open: false, resolver: null });
  },

  handleCancel: () => {
    get().resolver?.(false);
    set({ open: false, resolver: null });
  },
}));
