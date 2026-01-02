import { useCallback, useEffect } from "react";
import { useConfirm } from "../config/ConfirmProvider";

export const BLOCK_MESSAGE = "Bạn có thay đổi chưa lưu, chắc chắn muốn rời đi?";

export const useFormGuard = (isDirty: boolean, onClose: () => void) => {
  const { confirm } = useConfirm();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = BLOCK_MESSAGE;
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleClose = useCallback(
    async (_?: any, reason?: string) => {
      if (
        isDirty &&
        (reason === "backdropClick" || reason === "escapeKeyDown" || !reason)
      ) {
        const confirmClose = await confirm();
        if (!confirmClose) return;
      }
      onClose();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDirty, onClose]
  );

  return handleClose;
};
