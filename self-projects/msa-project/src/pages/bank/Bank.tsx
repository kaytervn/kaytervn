import React from "react";
import { ITEMS_PER_PAGE, TEXT } from "../../services/constant";
import useApi from "../../hooks/useApi";
import { useGridView } from "../../hooks/useGridView";
import { DIALOG_TYPE, useDialogManager } from "../../hooks/useDialog";
import { BasicAppBar } from "../../components/BasicAppBar";
import { PAGE_CONFIG } from "../../config/PageConfig";
import { DeleteDialog, LoadingOverlay } from "../../components/CustomOverlay";
import { BasicListView } from "../../components/ListView";
import { Typography } from "@mui/material";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import {
  CreateFabButton,
  SearchBar,
  ToolbarContainer,
} from "../../components/Toolbar";

const initQuery = {
  keyword: "",
  page: 0,
  tagId: undefined,
  size: ITEMS_PER_PAGE,
};

export const Bank = () => {
  const { state } = useLocation();
  const { bank, loading } = useApi();
  const {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  } = useGridView({
    fetchListApi: bank.list,
    initQuery: state?.query || initQuery,
  });
  const navigate = useNavigate();
  const { visible, type, data: formData, open, close } = useDialogManager();

  return (
    <BasicAppBar
      renderToolbar={
        <ToolbarContainer>
          <SearchBar
            value={query.keyword}
            onChange={(value: any) => setQuery({ ...query, keyword: value })}
            onSearch={async () => await handleSubmitQuery(query)}
            onClear={async () => await handleSubmitQuery(initQuery)}
          />
        </ToolbarContainer>
      }
    >
      <>
        <LoadingOverlay loading={loading} />
        {type === DIALOG_TYPE.DELETE && (
          <DeleteDialog
            open={visible}
            onClose={close}
            onDelete={() => bank.del(formData?.id)}
            refreshData={() => handleSubmitQuery(query)}
            title={TEXT.DELETE_BANK}
          />
        )}
        <BasicListView
          onItemClick={(item: any) =>
            navigate(
              generatePath(PAGE_CONFIG.UPDATE_BANK.path, { id: item.id }),
              {
                state: { query },
              }
            )
          }
          data={data}
          menu={[
            {
              label: TEXT.UPDATE,
              onClick: (id) =>
                navigate(generatePath(PAGE_CONFIG.UPDATE_BANK.path, { id }), {
                  state: { query },
                }),
            },
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
                  display={"flex"}
                  sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                >
                  {item?.tag?.name}
                </Typography>
                <Typography
                  noWrap
                  variant="body2"
                  sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                  color="text.secondary"
                >
                  {item.username}
                </Typography>
              </>
            );
          }}
          pagination={{
            page: query.page,
            totalPages: totalPages,
            onChange: handlePageChange,
          }}
        />
        <CreateFabButton
          onClick={() =>
            navigate(PAGE_CONFIG.CREATE_BANK.path, {
              state: { query },
            })
          }
        />
      </>
    </BasicAppBar>
  );
};
