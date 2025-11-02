import { useEffect, useState } from "react";

export function useFormData(
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
