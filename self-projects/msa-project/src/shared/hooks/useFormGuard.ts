import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useConfirmStore } from "@/shared/stores/useConfirmStore";

/**
 * Guard for unsaved form changes in dialogs.
 * Returns a close handler that shows confirmation if form is dirty.
 */
export const useFormGuard = (
  isDirty: boolean,
  onClose: () => void,
): (() => void) => {
  const confirm = useConfirmStore((s) => s.confirm);

  return useCallback(async () => {
    if (!isDirty) {
      onClose();
      return;
    }
    const confirmed = await confirm();
    if (confirmed) onClose();
  }, [isDirty, onClose, confirm]);
};

/**
 * Guard for unsaved form changes on page navigation.
 * Returns a navigate-back handler that shows confirmation if form is dirty.
 */
export const usePageFormGuard = (
  isDirty: boolean,
  backPath: string,
): {
  onClose: () => void;
  forceBack: () => void;
} => {
  const navigate = useNavigate();
  const confirm = useConfirmStore((s) => s.confirm);

  const onClose = useCallback(async () => {
    if (!isDirty) {
      navigate(backPath);
      return;
    }
    const confirmed = await confirm();
    if (confirmed) navigate(backPath);
  }, [isDirty, backPath, navigate, confirm]);

  const forceBack = useCallback(() => {
    navigate(backPath);
  }, [backPath, navigate]);

  return { onClose, forceBack };
};
