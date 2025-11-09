import { useEffect, useState } from "react";
import useQueryState from "./useQueryState";
import { usePageEncryption } from "./usePageLabel";
import { useFormGuard } from "./usePageBlocker";

export function useDialogFormData(
  open: boolean,
  id?: string,
  api?: any,
  onNotFound?: () => void
) {
  const [data, setData] = useState<any | undefined>(undefined);

  useEffect(() => {
    if (!open) {
      setData(undefined);
      return;
    }

    if (!id) {
      setData(undefined);
      return;
    }

    (async () => {
      const res = await api.get(id);
      if (res.result) setData(res.data);
      else onNotFound?.();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, id]);

  return data;
}

export function usePageFormData(
  isDirty: boolean,
  onFallbackPath: string,
  id?: string,
  api?: any
) {
  const encrypt = usePageEncryption();
  const [data, setData] = useState<any | undefined>(undefined);
  const { handleNavigateBack, forceBack } = useQueryState({
    path: onFallbackPath,
    requireSessionKey: encrypt,
  });
  const handleGuardedClose = useFormGuard(isDirty, handleNavigateBack);

  useEffect(() => {
    if (!id) {
      setData(undefined);
      return;
    }

    (async () => {
      const res = await api.get(id);
      if (res.result) setData(res.data);
      else handleNavigateBack();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, id]);

  return { data, onClose: handleGuardedClose, forceBack };
}
