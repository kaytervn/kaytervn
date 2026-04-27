import { Typography } from "@mui/material";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { BasicAppBar } from "@/shared/components/layout/BasicAppBar";
import { BasicListView } from "@/shared/components/data-display/BasicListView";
import { useGridView } from "@/shared/hooks/useGridView";
import { ITEMS_PER_PAGE, TEXT, TOAST } from "@/shared/constants";
import { DeleteDialog } from "@/shared/components/feedback/DeleteDialog";
import { LoadingOverlay } from "@/shared/components/feedback/LoadingOverlay";
import { useDialogManager } from "@/shared/hooks/useDialog";
import { DIALOG_TYPE } from "@/shared/types/common.types";
import { PAGE_CONFIG } from "@/shared/constants";
import { CreateFabButton, ToolbarContainer } from "@/shared/components/buttons/Buttons";
import { SearchBar } from "@/shared/components/forms/SearchBar";
import { fetchBankList, useDeleteBankMutation, bankKeys } from "@/features/bank/services/bank.service";
import type { Bank as BankType } from "@/features/bank/types";
import { useToastStore } from "@/shared/stores/useToastStore";
import { useQueryClient } from "@tanstack/react-query";

const initQuery = {
  keyword: "",
  page: 0,
  tagId: undefined,
  size: ITEMS_PER_PAGE,
};

export const Bank = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.showToast);
  const queryClient = useQueryClient();

  const {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  } = useGridView<BankType>({
    fetchListApi: fetchBankList,
    initQuery: state?.query || initQuery,
  });

  const { visible, type, data: formData, open, close } = useDialogManager();
  const deleteMutation = useDeleteBankMutation();

  const handleDelete = async () => {
    if (!formData?.id) return;
    try {
      const res = await deleteMutation.mutateAsync(formData.id as number);
      if (res?.result) {
        showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
        queryClient.invalidateQueries({ queryKey: bankKeys.lists() });
        close();
      } else {
        showToast(res?.message || TEXT.REQUEST_FAILED, TOAST.ERROR);
      }
    } catch (e) {
      showToast(TEXT.REQUEST_FAILED, TOAST.ERROR);
    }
  };

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
        <LoadingOverlay loading={deleteMutation.isPending} />
        {type === DIALOG_TYPE.DELETE && (
          <DeleteDialog
            open={visible}
            onClose={close}
            onDelete={async () => {
              await handleDelete();
              return undefined;
            }}
            title={TEXT.DELETE_BANK}
          />
        )}
        <BasicListView<BankType>
          onItemClick={(item) =>
            navigate(
              generatePath(PAGE_CONFIG.UPDATE_BANK.path, { id: String(item.id) }),
              { state: { query } }
            )
          }
          data={data}
          menu={[
            {
              label: TEXT.UPDATE,
              onClick: (id) =>
                navigate(generatePath(PAGE_CONFIG.UPDATE_BANK.path, { id: String(id) }), {
                  state: { query },
                }),
            },
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
                {item?.tag?.name}
              </Typography>
              <Typography
                noWrap
                variant="body2"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                  maxWidth: "100%",
                }}
                color="text.secondary"
              >
                {item.username}
              </Typography>
            </>
          )}
          pagination={{
            page: query.page || 0,
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
