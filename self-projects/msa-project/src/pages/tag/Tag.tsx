import { Typography } from "@mui/material";
import { BasicAppBar } from "@/shared/components/layout/BasicAppBar";
import { BasicListView } from "@/shared/components/data-display/BasicListView";
import { useGridView } from "@/shared/hooks/useGridView";
import { ITEMS_PER_PAGE, TEXT } from "@/shared/constants";
import { DeleteDialog } from "@/shared/components/feedback/DeleteDialog";
import { LoadingOverlay } from "@/shared/components/feedback/LoadingOverlay";
import { useDialogManager } from "@/shared/hooks/useDialog";
import { DIALOG_TYPE } from "@/shared/types/common.types";
import { TagFormDialog } from "./TagForm";
import { CreateFabButton, ToolbarContainer } from "@/shared/components/buttons/Buttons";
import { SearchBar } from "@/shared/components/forms/SearchBar";
import { fetchTagList } from "@/features/tag/services/tag.service";
import { useTagFormLogic } from "@/features/tag/hooks/useTagForm";
import type { Tag as TagType } from "@/features/tag/types";

const initQuery = {
  name: "",
  page: 0,
  size: ITEMS_PER_PAGE,
};

export const Tag = () => {
  const {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  } = useGridView<TagType>({
    fetchListApi: fetchTagList,
    initQuery,
  });

  const { visible, type, data: formData, open, close } = useDialogManager();

  // Re-use hook for delete mutation
  const { handleDelete, loading: isDeleting } = useTagFormLogic(
    formData?.id as number,
    close,
  );

  return (
    <BasicAppBar
      renderToolbar={
        <ToolbarContainer>
          <SearchBar
            value={(query.name as string) || ""}
            onChange={(value) => setQuery({ ...query, name: value })}
            onSearch={async () => await handleSubmitQuery(query)}
            onClear={async () => await handleSubmitQuery(initQuery)}
          />
        </ToolbarContainer>
      }
    >
      <>
        <LoadingOverlay loading={isDeleting} />
        {type === DIALOG_TYPE.FORM && (
          <TagFormDialog open={visible} data={formData} onClose={close} />
        )}
        {type === DIALOG_TYPE.DELETE && (
          <DeleteDialog
            open={visible}
            onClose={close}
            onDelete={async () => {
              await handleDelete(formData?.id as number);
              return undefined;
            }}
            title={TEXT.DELETE_TAG}
          />
        )}
        <BasicListView<TagType>
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
