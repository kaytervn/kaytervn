/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useGlobalContext } from "../components/config/GlobalProvider";
import { ITEMS_PER_PAGE, TOAST } from "../types/constant";
import { decryptDataByUserKey } from "../services/encryption/sessionEncryption";

const useGridViewLocal = ({
  fetchListApi,
  initQuery = {},
  filterData = (data: any[]) => data,
  decryptFields,
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
    const filtered = filterData(allData || [], query);
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
      const newData = prevData.filter((item) => item._id !== itemId);
      return newData;
    });
  };

  const handleRefreshData = async () => {
    const res = await fetchListApi({
      ...queryParams,
    });
    if (res.result) {
      const data = res?.data?.content || res?.data;
      updateData(data || []);
    } else {
      setToast(res.message, TOAST.ERROR);
      updateData([]);
    }
  };

  const updateData = (newData: any[]) => {
    if (decryptFields && sessionKey) {
      setAllData(
        newData?.map((item) =>
          decryptDataByUserKey(sessionKey, item, decryptFields)
        ) || []
      );
    } else {
      setAllData(newData || []);
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
