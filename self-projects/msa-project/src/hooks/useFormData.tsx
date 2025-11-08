import { useEffect, useState } from "react";
import useQueryState from "./useQueryState";
import { useLocation } from "react-router-dom";
import { ENCRYPT_PATH } from "../config/PageConfig";

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
  onFallbackPath: string,
  id?: string,
  api?: any
) {
  const location = useLocation();
  const [data, setData] = useState<any | undefined>(undefined);
  const { handleNavigateBack } = useQueryState({
    path: onFallbackPath,
    // requireSessionKey: ENCRYPT_PATH.includes(location.pathname),
  });

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

  return { data, onClose: handleNavigateBack };
}
