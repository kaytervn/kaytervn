import { useEffect, useState } from "react";
import {
  IS_PAGED,
  ITEMS_PER_PAGE,
  SORT_DATE,
  TOAST,
} from "../services/constant";
import { decryptData } from "../services/utils";
import { useGlobalContext } from "../components/config/GlobalProvider";

const useGridViewLocal = ({
  fetchListApi,
  initQuery = {},
  filterData = (data: any[]) => data,
  decryptFields,
  secretKey,
  queryParams,
  pageAccesor = "page",
}: any) => {
  const { sessionKey, setToast } = useGlobalContext();
  const [allData, setAllData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [query, setQuery] = useState({
    [`${pageAccesor}`]: 0,
    size: ITEMS_PER_PAGE,
    ...initQuery,
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  useEffect(() => {
    handleRefreshData();
  }, [sessionKey]);

  useEffect(() => {
    const filtered = filterData(allData, query);
    const newTotalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = query[pageAccesor] * ITEMS_PER_PAGE;
    const paginatedData = filtered.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

    if (query[pageAccesor] >= newTotalPages && newTotalPages > 0) {
      setQuery((prev: any) => ({
        ...prev,
        [`${pageAccesor}`]: newTotalPages - 1,
      }));
    } else if (query[pageAccesor] < 0) {
      setQuery((prev: any) => ({ ...prev, [`${pageAccesor}`]: 0 }));
    }

    setFilteredData(filtered);
    setData(paginatedData);
  }, [query, allData, filterData]);

  const [data, setData] = useState(() => {
    const filtered = filterData(allData, query);
    const startIndex = query[pageAccesor] * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  });

  const handlePageChange = (page: number) => {
    setQuery((prev: any) => ({
      ...prev,
      [`${pageAccesor}`]: Math.max(0, Math.min(page, totalPages - 1)),
    }));
  };

  const handleSubmitQuery = (newQuery: any) => {
    setQuery((prev: any) => ({
      ...prev,
      ...newQuery,
      [`${pageAccesor}`]: 0,
    }));
  };

  const handleDeleteItem = (itemId: any) => {
    setAllData((prevData) => {
      const newData = prevData.filter((item) => item.id !== itemId);
      return newData;
    });
  };

  const handleRefreshData = async () => {
    if (!sessionKey) {
      updateData([]);
      return;
    }
    const res = await fetchListApi({
      sortDate: SORT_DATE.DESC,
      isPaged: IS_PAGED.FALSE,
      ...queryParams,
    });
    if (res.result) {
      const data = res.data;
      updateData(data?.content || []);
    } else {
      setToast(res.message, TOAST.ERROR);
      updateData([]);
    }
  };

  const updateData = (newData: any[]) => {
    if (decryptFields && secretKey) {
      setAllData(
        newData?.map((item) => decryptData(secretKey, item, decryptFields))
      );
    } else {
      setAllData(newData);
    }
  };

  return {
    data,
    allData,
    totalPages,
    query,
    updateData,
    setQuery,
    handlePageChange,
    handleSubmitQuery,
    handleDeleteItem,
    handleRefreshData,
  };
};

export default useGridViewLocal;
