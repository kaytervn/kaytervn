import { Link, Typography } from "@mui/material";
import { BasicAppBar } from "../../components/BasicAppBar";
import { BasicListView } from "../../components/ListView";
import useApi from "../../hooks/useApi";
import { useGridView } from "../../hooks/useGridView";
import { ITEMS_PER_PAGE, TEXT } from "../../services/constant";
import { DeleteDialog, LoadingOverlay } from "../../components/CustomOverlay";
import { DIALOG_TYPE, useDialogManager } from "../../hooks/useDialog";
import { PlatformForm } from "./PlatformForm";
import {
  CreateFabButton,
  SearchBar,
  ToolbarContainer,
} from "../../components/Toolbar";

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
        {type === DIALOG_TYPE.FORM && (
          <PlatformForm
            open={visible}
            data={formData}
            onClose={close}
            refreshData={() => handleSubmitQuery(query)}
          />
        )}
        {type === DIALOG_TYPE.DELETE && (
          <DeleteDialog
            open={visible}
            onClose={close}
            onDelete={() => platform.del(formData?.id)}
            refreshData={() => handleSubmitQuery(query)}
            title={TEXT.DELETE_PLATFORM}
          />
        )}
        <BasicListView
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
                  {item.name}
                </Typography>
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  noWrap
                  sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                  display={"flex"}
                >
                  {item.url}
                </Link>
              </>
            );
          }}
          pagination={{
            page: query.page,
            totalPages: totalPages,
            onChange: handlePageChange,
          }}
        />
        <CreateFabButton onClick={open} />
      </>
    </BasicAppBar>
  );
};
