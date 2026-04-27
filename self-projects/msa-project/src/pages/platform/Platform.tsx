import { Link, Typography } from "@mui/material";
import { BasicAppBar } from "@/shared/components/layout/BasicAppBar";
import { BasicListView } from "@/shared/components/data-display/BasicListView";
import { useGridView } from "@/shared/hooks/useGridView";
import { ITEMS_PER_PAGE, TEXT } from "@/shared/constants";
import { DeleteDialog } from "@/shared/components/feedback/DeleteDialog";
import { LoadingOverlay } from "@/shared/components/feedback/LoadingOverlay";
import { useDialogManager } from "@/shared/hooks/useDialog";
import { DIALOG_TYPE } from "@/shared/types/common.types";
import { PlatformFormDialog } from "./PlatformForm";
import { CreateFabButton, ToolbarContainer } from "@/shared/components/buttons/Buttons";
import { SearchBar } from "@/shared/components/forms/SearchBar";
import { fetchPlatformList } from "@/features/platform/services/platform.service";
import { usePlatformFormLogic } from "@/features/platform/hooks/usePlatformForm";
import type { Platform as PlatformType } from "@/features/platform/types";

const initQuery = {
  keyword: "",
  page: 0,
  size: ITEMS_PER_PAGE,
};

export const Platform = () => {
  const {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  } = useGridView<PlatformType>({
    fetchListApi: fetchPlatformList,
    initQuery,
  });

  const { visible, type, data: formData, open, close } = useDialogManager();

  // Re-use hook for delete mutation
  const { handleDelete, loading: isDeleting } = usePlatformFormLogic(
    formData?.id as number,
    close,
  );

  return (
    <BasicAppBar
      renderToolbar={
        <ToolbarContainer>
          <SearchBar
            value={(query.keyword as string) || ""}
            onChange={(value) => setQuery({ ...query, keyword: value })}
            onSearch={async () => await handleSubmitQuery(query)}
            onClear={async () => await handleSubmitQuery(initQuery)}
          />
        </ToolbarContainer>
      }
    >
      <>
        <LoadingOverlay loading={isDeleting} />
        {type === DIALOG_TYPE.FORM && (
          <PlatformFormDialog open={visible} data={formData} onClose={close} />
        )}
        {type === DIALOG_TYPE.DELETE && (
          <DeleteDialog
            open={visible}
            onClose={close}
            onDelete={async () => {
              await handleDelete(formData?.id as number);
              return undefined;
            }}
            title={TEXT.DELETE_PLATFORM}
          />
        )}
        <BasicListView<PlatformType>
          onItemClick={(item) => open({ id: item.id as number })}
          data={data}
          menu={[
            { label: TEXT.UPDATE, onClick: (id) => open({ id: id as number }) },
            {
              label: TEXT.DELETE,
              onClick: (id) => open({ id: id as number }, DIALOG_TYPE.DELETE),
            },
          ]}
          renderContent={(item) => (
            <>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                  maxWidth: "100%",
                }}
              >
                {item.name}
              </Typography>
              <Typography
                variant="body2"
                noWrap
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                  maxWidth: "100%",
                }}
              >
                <Link
                  href={item.url}
                  target="_blank"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {item.url}
                </Link>
              </Typography>
            </>
          )}
          pagination={{
            page: query.page || 0,
            totalPages: totalPages,
            onChange: handlePageChange,
          }}
        />
        <CreateFabButton onClick={() => open()} />
      </>
    </BasicAppBar>
  );
};
