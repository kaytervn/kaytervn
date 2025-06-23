import { useEffect, useState } from "react";

const useGridView = ({ fetchListApi, initQuery }: any) => {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState(initQuery);

  const getData = async (currentQuery: any) => {
    const res = await fetchListApi(currentQuery);
    const items = res?.data?.content || [];
    const totalPages = res?.data?.totalPages || 0;
    if (items.length === 0 && currentQuery.page > 0) {
      await handlePageChange(Math.max(totalPages - 1, 0));
      return;
    }
    setData(items);
    setTotalPages(totalPages);
  };

  useEffect(() => {
    const fetchData = async () => {
      await handleSubmitQuery(query);
    };
    fetchData();
  }, []);

  const handlePageChange = async (page: any) => {
    const newQuery = { ...query, page };
    setQuery(newQuery);
    await getData(newQuery);
  };

  const handleSubmitQuery = async (newQuery: any) => {
    setQuery(newQuery);
    await getData(newQuery);
  };

  return {
    data,
    totalPages,
    query,
    setQuery,
    handlePageChange,
    handleSubmitQuery,
  };
};

export { useGridView };
