import React from "react";
import { ITEMS_PER_PAGE, TEXT } from "../../services/constant";
import useApi from "../../hooks/useApi";
import { useGridView } from "../../hooks/useGridView";
import { DIALOG_TYPE, useDialogManager } from "../../hooks/useDialog";
import { BasicAppBar } from "../../components/BasicAppBar";
import { PAGE_CONFIG } from "../../config/PageConfig";
import { DeleteDialog, LoadingOverlay } from "../../components/CustomOverlay";
import { AccountForm } from "./AccountForm";
import { BasicListView, GroupedListView } from "../../components/ListView";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const initQuery = {
  keyword: "",
  page: 0,
  size: ITEMS_PER_PAGE,
};

export const Account = () => {
  const { account, loading } = useApi();
  const {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  } = useGridView({
    fetchListApi: account.list,
    initQuery,
  });
  const navigate = useNavigate();
  const { visible, type, data: formData, open, close } = useDialogManager();
  return (
    <BasicAppBar
      title={PAGE_CONFIG.ACCOUNT.label}
      search={{
        value: query.keyword,
        onChange: (value: any) => setQuery({ ...query, keyword: value }),
        onSearch: async () => await handleSubmitQuery(query),
        onClear: async () => await handleSubmitQuery(initQuery),
      }}
      create={{
        onClick: () =>
          navigate(PAGE_CONFIG.CREATE_ACCOUNT.path, {
            state: { query },
          }),
      }}
    >
      <>
        <LoadingOverlay loading={loading} />
        <GroupedListView
          groupBy={(item: any) => item.platform?.id}
          getGroupLabel={(item: any) => item.platform?.name || "No Platform"}
          data={data}
          menu={[
            { label: TEXT.UPDATE, onClick: (id) => open({ id }) },
            {
              label: TEXT.DELETE,
              onClick: (id) => open({ id }, DIALOG_TYPE.DELETE),
            },
          ]}
          renderContent={function (item: any): React.ReactNode {
            return (
              <>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                >
                  {item.username}
                </Typography>
                {/* <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  noWrap
                  sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                >
                  {item.url}
                </Link> */}
              </>
            );
          }}
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
