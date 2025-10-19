import { Link, Typography } from "@mui/material";
import { BasicAppBar } from "../../components/BasicAppBar";
import { AccountTabs } from "../../components/CustomTabs";
import { BasicListView } from "../../components/ListView";
import { PAGE_CONFIG } from "../../config/PageConfig";
import useApi from "../../hooks/useApi";
import { useGridView } from "../../hooks/useGridView";
import { ITEMS_PER_PAGE } from "../../services/constant";
import { LoadingOverlay } from "../../components/CustomOverlay";

const initQuery = {
  keyword: "",
  page: 0,
  size: ITEMS_PER_PAGE,
};

export const Platform = () => {
  const { platform, loading } = useApi();
  const {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  } = useGridView({
    fetchListApi: platform.list,
    initQuery,
  });
  return (
    <BasicAppBar
      title={PAGE_CONFIG.PLATFORM.label}
      search={{
        value: query.keyword,
        onChange: (value: any) => setQuery({ ...query, keyword: value }),
        onSearch: async () => await handleSubmitQuery(query),
        onClear: async () => await handleSubmitQuery(initQuery),
      }}
      create={{
        onClick: () => {},
      }}
    >
      <>
        <LoadingOverlay loading={loading} />
        <AccountTabs />
        <BasicListView
          data={data}
          renderContent={function (item: any): React.ReactNode {
            return (
              <>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                >
                  {item.name}
                </Typography>
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  noWrap
                  sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                >
                  {item.url}
                </Link>
              </>
            );
          }}
          menu={[]}
          pagination={{
            page: query.page,
            totalPages: totalPages,
            onChange: handlePageChange,
          }}
        />
      </>
    </BasicAppBar>
  );
};
