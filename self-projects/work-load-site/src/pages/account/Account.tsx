import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DECRYPT_FIELDS,
  PAGE_CONFIG,
} from "../../components/config/PageConfig";
import Sidebar2 from "../../components/main/Sidebar2";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useModal from "../../hooks/useModal";
import useApi from "../../hooks/useApi";
import useGridViewLocal from "../../hooks/useGridViewLocal";
import {
  basicRender,
  renderActionButton,
  renderEnum,
} from "../../components/config/ItemRender";
import {
  ActionDeleteButton,
  ActionEditButton,
  BasicActionButton,
} from "../../components/form/Button";
import {
  configDeleteDialog,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/form/Dialog";
import { CreateButton, ToolBar } from "../../components/main/ToolBar";
import { InputBox2 } from "../../components/form/InputTextField";
import { GridView } from "../../components/main/GridView";
import {
  ACCOUNT_KIND_MAP,
  ALIGNMENT,
  BUTTON_TEXT,
  ITEMS_PER_PAGE,
} from "../../types/constant";
import {
  SelectBoxLazy,
  StaticSelectBox,
} from "../../components/form/SelectTextField";
import { HistoryIcon, LinkIcon } from "lucide-react";
import { normalizeVietnamese } from "../../types/utils";

const initQuery = { keyword: "", kind: "", platformId: "", username: "" };

const Account = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData
      ?.filter((item) => {
        const usernameFilter =
          !query?.username ||
          (item?.username || item?.ref?.username || "")
            .toLowerCase()
            .includes(query.username.toLowerCase());
        const keywordFilter =
          !query?.keyword ||
          [
            item?.username,
            item?.ref?.username,
            item?.ref?.platform?.name,
            `(${item.ref?.platform?.name}) ${item.ref?.username}`,
            item?.note,
            item?.platform?.name,
          ]
            .filter(Boolean)
            .some((field) =>
              normalizeVietnamese(field).includes(
                normalizeVietnamese(query.keyword)
              )
            );
        const kindFilter = !query?.kind || item.kind == query.kind;
        const platformIdFilter =
          !query?.platformId || item.platform?._id == query.platformId;
        return (
          keywordFilter && usernameFilter && kindFilter && platformIdFilter
        );
      })
      .sort((a, b) => {
        const platformCompare =
          a.platform?.name?.localeCompare(b.platform?.name || "") || 0;
        if (platformCompare !== 0) return platformCompare;
        return a.username?.localeCompare(b.username || "");
      });
  }, []);
  const { setToast } = useGlobalContext();
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { account: apiList, loading: loadingList } = useApi();
  const { account, loading } = useApi();
  const { platform } = useApi();
  const {
    data,
    query,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
    handleDeleteItem,
    handleRefreshData,
  } = useGridViewLocal({
    initQuery: state?.query || initQuery,
    filterData: customFilterData,
    fetchListApi: apiList.list,
    decryptFields: DECRYPT_FIELDS.ACCOUNT,
  });

  const columns = [
    {
      label: "Platform",
      accessor: "platform.name",
      align: ALIGNMENT.LEFT,
    },
    {
      label: "Username",
      accessor: "username",
      align: ALIGNMENT.LEFT,
      render: (item: any) => {
        return basicRender({
          content: item.ref.username
            ? `(${item.ref?.platform?.name}) ${item.ref?.username}`
            : item.username,
        });
      },
    },
    renderEnum({
      label: "Kind",
      accessor: "kind",
      dataMap: ACCOUNT_KIND_MAP,
    }),
    {
      label: "Link accounts",
      accessor: "totalRefs",
      align: ALIGNMENT.CENTER,
    },
    {
      label: "Backup codes",
      accessor: "totalBackupCodes",
      align: ALIGNMENT.CENTER,
    },
    renderActionButton({
      renderChildren: (item: any) => {
        const hideDelete = item.totalRefs > 0;
        return (
          <>
            <BasicActionButton
              onClick={() => onLinkAccountButtonClick(item._id)}
              Icon={LinkIcon}
              buttonText={BUTTON_TEXT.LINKED_ACCOUNTS}
            />
            <BasicActionButton
              onClick={() => onBackupCodesButtonClick(item._id)}
              Icon={HistoryIcon}
              buttonText={BUTTON_TEXT.BACKUP_CODE}
            />
            <ActionEditButton onClick={() => onUpdateButtonClick(item._id)} />
            {!hideDelete && (
              <ActionDeleteButton
                onClick={() => onDeleteButtonClick(item._id)}
              />
            )}
          </>
        );
      },
    }),
  ];

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_ACCOUNT.label,
        deleteApi: () => account.del(id),
        refreshData: () => handleDeleteItem(id),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    navigate(PAGE_CONFIG.CREATE_ACCOUNT.path, { state: { query } });
  };

  const onUpdateButtonClick = (id: any) => {
    navigate(`/account/update/${id}`, { state: { query } });
  };

  const onLinkAccountButtonClick = (id: any) => {
    navigate(`/account/link-account/${id}`, { state: { query } });
  };

  const onBackupCodesButtonClick = (id: any) => {
    navigate(`/account/backup-code/${id}`, { state: { query } });
  };

  return (
    <Sidebar2
      breadcrumbs={[
        {
          label: PAGE_CONFIG.ACCOUNT.label,
        },
      ]}
      activeItem={PAGE_CONFIG.ACCOUNT.name}
      renderContent={
        <>
          <ConfirmationDialog
            isVisible={deleteDialogVisible}
            formConfig={deleteDialogConfig}
          />
          <LoadingDialog isVisible={loading} />
          <ToolBar
            searchBoxes={
              <>
                <InputBox2
                  value={query.keyword}
                  onChangeText={(value: any) =>
                    handleSubmitQuery({ ...query, keyword: value })
                  }
                  placeholder="Searching..."
                />
                <SelectBoxLazy
                  value={query.platformId}
                  onChange={(value: any) => {
                    handleSubmitQuery({
                      ...query,
                      platformId: value,
                    });
                  }}
                  fetchListApi={platform.list}
                  placeholder="Platform..."
                  valueKey="_id"
                  decryptFields={DECRYPT_FIELDS.PLATFORM}
                />
                <InputBox2
                  value={query.username}
                  onChangeText={(value: any) =>
                    handleSubmitQuery({ ...query, username: value })
                  }
                  placeholder="Username..."
                />
                <StaticSelectBox
                  value={query.kind}
                  onChange={(value: any) => {
                    handleSubmitQuery({ ...query, kind: value });
                  }}
                  dataMap={ACCOUNT_KIND_MAP}
                  placeholder="Kind..."
                />
              </>
            }
            onClear={() => handleSubmitQuery(initQuery)}
            onRefresh={handleRefreshData}
            actionButtons={<CreateButton onClick={onCreateButtonClick} />}
          />
          <GridView
            isLoading={loadingList}
            data={data}
            columns={columns}
            currentPage={query.page}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </>
      }
    ></Sidebar2>
  );
};
export default Account;
