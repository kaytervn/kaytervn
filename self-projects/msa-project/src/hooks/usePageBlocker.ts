import { useCallback, useEffect } from "react";
import { useBlocker } from "react-router-dom";

const MESSAGE = "Bạn có thay đổi chưa lưu, chắc chắn muốn rời đi?";

export const usePageBlocker = (shouldBlock: boolean, message?: string) => {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!shouldBlock) return;
      e.preventDefault();
      e.returnValue = message || MESSAGE;
    };

    window.addEventListener("beforeunload", handler);

    return () => window.removeEventListener("beforeunload", handler);
  }, [shouldBlock, message]);
};

export const useNavigationBlocker = (
  shouldBlock: boolean,
  onConfirm: () => void
) => {
  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmed = window.confirm(MESSAGE);
      if (confirmed) onConfirm();
      else blocker.reset();
    }
  }, [blocker, onConfirm]);
};

export function useFormGuard(isDirty: boolean, onClose: () => void) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = MESSAGE;
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleClose = useCallback(
    (_?: any, reason?: string) => {
      if (
        isDirty &&
        (reason === "backdropClick" || reason === "escapeKeyDown" || !reason)
      ) {
        const confirmClose = window.confirm(MESSAGE);
        if (!confirmClose) return;
      }
      onClose();
    },
    [isDirty, onClose]
  );

  return handleClose;
}
