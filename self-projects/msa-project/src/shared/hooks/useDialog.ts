import { useCallback, useState } from "react";
import type { DialogType } from "@/shared/types/common.types";
import { DIALOG_TYPE } from "@/shared/types/common.types";

interface DialogData {
  id?: number;
  [key: string]: unknown;
}

interface DialogManagerReturn {
  visible: boolean;
  type: DialogType;
  data: DialogData | undefined;
  open: (data?: DialogData, type?: DialogType) => void;
  close: () => void;
}

/**
 * Manages dialog visibility, type (FORM/DELETE), and associated data.
 * All callbacks are memoized with useCallback to prevent unnecessary re-renders.
 */
export const useDialogManager = (): DialogManagerReturn => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<DialogType>(DIALOG_TYPE.FORM);
  const [data, setData] = useState<DialogData | undefined>(undefined);

  const open = useCallback(
    (newData?: DialogData, newType: DialogType = DIALOG_TYPE.FORM) => {
      setData(newData);
      setType(newType);
      setVisible(true);
    },
    [],
  );

  const close = useCallback(() => {
    setVisible(false);
    setData(undefined);
    setType(DIALOG_TYPE.FORM);
  }, []);

  return { visible, type, data, open, close };
};

/**
 * Simple boolean dialog hook for single-purpose dialogs.
 */
export const useDialog = () => {
  const [isVisible, setIsVisible] = useState(false);

  const onOpen = useCallback(() => setIsVisible(true), []);
  const onClose = useCallback(() => setIsVisible(false), []);

  return { isVisible, onOpen, onClose };
};
