import { useCallback, useEffect, useState } from "react";
import type { ApiResponse, PaginatedData } from "@/shared/types/api.types";
import type { GridQuery } from "@/shared/types/common.types";

interface UseGridViewOptions<Q extends GridQuery> {
  fetchListApi: (
    params: Q,
  ) => Promise<ApiResponse<PaginatedData<Record<string, unknown>>>>;
  initQuery: Q;
}

interface UseGridViewReturn<T, Q extends GridQuery> {
  data: T[];
  query: Q;
  setQuery: React.Dispatch<React.SetStateAction<Q>>;
  totalPages: number;
  handlePageChange: (page: number) => void;
  handleSubmitQuery: (q: Q) => Promise<void>;
}

/**
 * Manages paginated list data fetching, query state, and pagination.
 */
export const useGridView = <
  T extends Record<string, unknown>,
  Q extends GridQuery = GridQuery,
>({
  fetchListApi,
  initQuery,
}: UseGridViewOptions<Q>): UseGridViewReturn<T, Q> => {
  const [data, setData] = useState<T[]>([]);
  const [query, setQuery] = useState<Q>(initQuery);
  const [totalPages, setTotalPages] = useState(0);

  const handleSubmitQuery = useCallback(
    async (q: Q) => {
      setQuery(q);
      const res = await fetchListApi(q);
      if (res?.data) {
        setData((res.data.content ?? []) as T[]);
        setTotalPages(res.data.totalPages ?? 0);
      }
    },
    [fetchListApi],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const newQuery = { ...query, page };
      handleSubmitQuery(newQuery);
    },
    [query, handleSubmitQuery],
  );

  useEffect(() => {
    handleSubmitQuery(initQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  };
};
