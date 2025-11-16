import React from "react";
import { ITEMS_PER_PAGE, TEXT } from "../../services/constant";
import useApi from "../../hooks/useApi";
import { useGridView } from "../../hooks/useGridView";
import { DIALOG_TYPE, useDialogManager } from "../../hooks/useDialog";
import { BasicAppBar } from "../../components/BasicAppBar";
import { PAGE_CONFIG } from "../../config/PageConfig";
import { DeleteDialog, LoadingOverlay } from "../../components/CustomOverlay";
import { GroupedListView } from "../../components/ListView";
import { Stack, Typography } from "@mui/material";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import {
  CreateFabButton,
  SearchBar,
  ToolbarContainer,
} from "../../components/Toolbar";
import { SelectPlatform } from "../../components/SelectBox";

const initQuery = {
  keyword: "",
  page: 0,
  platformId: undefined,
  size: ITEMS_PER_PAGE,
};

export const Account = () => {
  const { state } = useLocation();
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
    initQuery: state?.query || initQuery,
  });
  const navigate = useNavigate();
  const { visible, type, data: formData, open, close } = useDialogManager();

  return (
    <BasicAppBar
      renderToolbar={
        <ToolbarContainer>
          <Stack direction={{ xs: "column", md: "row", lg: "row" }} spacing={1}>
            <SelectPlatform
              value={query.platformId}
              onChange={(value: any) =>
                setQuery({ ...query, platformId: value })
              }
            />
            <SearchBar
              value={query.keyword}
              onChange={(value: any) => setQuery({ ...query, keyword: value })}
              onSearch={async () => await handleSubmitQuery(query)}
              onClear={() => setQuery({ ...query, keyword: "" })}
            />
          </Stack>
        </ToolbarContainer>
      }
    >
      <>
        <LoadingOverlay loading={loading} />
        {type === DIALOG_TYPE.DELETE && (
          <DeleteDialog
            open={visible}
            onClose={close}
            onDelete={() => account.del(formData?.id)}
            refreshData={() => handleSubmitQuery(query)}
            title={TEXT.DELETE_ACCOUNT}
          />
        )}
        <GroupedListView
          onItemClick={(item: any) =>
            navigate(
              generatePath(PAGE_CONFIG.UPDATE_ACCOUNT.path, { id: item.id }),
              {
                state: { query },
              }
            )
          }
          groupBy={(item: any) => item.platform?.id}
          getGroupLabel={(item: any) => item.platform?.name || "No Platform"}
          data={data}
          menu={[
            {
              label: TEXT.LINK,
              visible: (item: any) => item.kind === 1,
              onClick: (id) =>
                navigate(generatePath(PAGE_CONFIG.LINK_ACCOUNT.path, { id }), {
                  state: { query },
                }),
            },
            {
              label: TEXT.UPDATE,
              onClick: (id) =>
                navigate(
                  generatePath(PAGE_CONFIG.UPDATE_ACCOUNT.path, { id }),
                  {
                    state: { query },
                  }
                ),
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
                  {item.username ?? item?.parent?.username}
                </Typography>
                <Typography
                  noWrap
                  variant="body2"
                  sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                  color="text.secondary"
                >
                  {item?.parent?.platform?.name}
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
            navigate(PAGE_CONFIG.CREATE_ACCOUNT.path, {
              state: { query },
            })
          }
        />
      </>
    </BasicAppBar>
  );
};
