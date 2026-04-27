import { Stack, Typography } from "@mui/material";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { BasicAppBar } from "@/shared/components/layout/BasicAppBar";
import { GroupedListView } from "@/shared/components/data-display/BasicListView";
import { useGridView } from "@/shared/hooks/useGridView";
import { ITEMS_PER_PAGE, TEXT } from "@/shared/constants";
import { DeleteDialog } from "@/shared/components/feedback/DeleteDialog";
import { LoadingOverlay } from "@/shared/components/feedback/LoadingOverlay";
import { useDialogManager } from "@/shared/hooks/useDialog";
import { DIALOG_TYPE } from "@/shared/types/common.types";
import { PAGE_CONFIG, TOAST } from "@/shared/constants";
import { CreateFabButton, ToolbarContainer } from "@/shared/components/buttons/Buttons";
import { SearchBar } from "@/shared/components/forms/SearchBar";
import { SelectPlatform } from "@/shared/components/forms/SelectBox";
import { fetchAccountList, useDeleteAccountMutation } from "@/features/account/services/account.service";
import type { Account as AccountType } from "@/features/account/types";
import { useToastStore } from "@/shared/stores/useToastStore";
import { useQueryClient } from "@tanstack/react-query";
import { accountKeys } from "@/features/account/services/account.service";

const initQuery = {
  keyword: "",
  page: 0,
  platformId: undefined,
  size: ITEMS_PER_PAGE,
};

export const Account = () => {
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
  } = useGridView<AccountType>({
    fetchListApi: fetchAccountList,
    initQuery: state?.query || initQuery,
  });

  const { visible, type, data: formData, open, close } = useDialogManager();
  const deleteMutation = useDeleteAccountMutation();

  const handleDelete = async () => {
    if (!formData?.id) return;
    try {
      const res = await deleteMutation.mutateAsync(formData.id as number);
      if (res?.result) {
        showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
        queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
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
          <Stack direction={{ xs: "column", md: "row", lg: "row" }} spacing={1}>
            <SelectPlatform
              value={query.platformId as number | undefined}
              onChange={(value: any) => setQuery({ ...query, platformId: value })}
            />
            <SearchBar
              value={(query.keyword as string) || ""}
              onChange={(value) => setQuery({ ...query, keyword: value })}
              onSearch={async () => await handleSubmitQuery(query)}
              onClear={() => setQuery({ ...query, keyword: "" })}
            />
          </Stack>
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
            title={TEXT.DELETE_ACCOUNT}
          />
        )}
        <GroupedListView<AccountType>
          onItemClick={(item) =>
            navigate(
              generatePath(PAGE_CONFIG.UPDATE_ACCOUNT.path, { id: String(item.id) }),
              { state: { query } }
            )
          }
          groupBy={(item) => item.platform?.id as number}
          getGroupLabel={(item) => item.platform?.name || "No Platform"}
          data={data}
          menu={[
            {
              label: TEXT.LINK,
              visible: (item) => item.kind === 1,
              onClick: (id) =>
                navigate(generatePath(PAGE_CONFIG.LINK_ACCOUNT.path, { id: String(id) }), {
                  state: { query },
                }),
            },
            {
              label: TEXT.UPDATE,
              onClick: (id) =>
                navigate(generatePath(PAGE_CONFIG.UPDATE_ACCOUNT.path, { id: String(id) }), {
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
                display={"flex"}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                  maxWidth: "100%",
                }}
              >
                {item.username ?? item?.parent?.username}
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
                {item?.parent?.platform?.name}
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
            navigate(PAGE_CONFIG.CREATE_ACCOUNT.path, {
              state: { query },
            })
          }
        />
      </>
    </BasicAppBar>
  );
};
