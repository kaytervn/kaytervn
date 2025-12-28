import { useCallback, useEffect } from "react";

const MESSAGE = "Bạn có thay đổi chưa lưu, chắc chắn muốn rời đi?";

export const useFormGuard = (isDirty: boolean, onClose: () => void) => {
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
};
