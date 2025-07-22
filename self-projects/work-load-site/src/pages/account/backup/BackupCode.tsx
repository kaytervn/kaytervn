/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../../components/config/GlobalProvider";
import {
  basicRender,
  renderActionButton,
} from "../../../components/config/ItemRender";
import { PAGE_CONFIG } from "../../../components/config/PageConfig";
import { ActionDeleteButton } from "../../../components/form/Button";
import {
  configDeleteDialog,
  configModalForm,
  ConfirmationDialog,
  LoadingDialog,
} from "../../../components/form/Dialog";
import { GridView } from "../../../components/main/GridView";
import { CreateButton, ToolBar } from "../../../components/main/ToolBar";
import useApi from "../../../hooks/useApi";
import { useGridView } from "../../../hooks/useGridView";
import useModal from "../../../hooks/useModal";
import {
  ALIGNMENT,
  BASIC_MESSAGES,
  ITEMS_PER_PAGE,
} from "../../../types/constant";
import { convertUtcToVn } from "../../../types/utils";
import { useEffect, useState } from "react";
import useQueryState from "../../../hooks/useQueryState";
import Sidebar2 from "../../../components/main/Sidebar2";
import { decryptFieldByUserKey } from "../../../services/encryption/sessionEncryption";
import CreateBackupCode from "./CreateBackupCode";

const initQuery = {
  page: 0,
  size: ITEMS_PER_PAGE,
};

const BackupCode = () => {
  const { accountId } = useParams();
  const { setToast, sessionKey } = useGlobalContext();
  const {
    isModalVisible: createFormVisible,
    showModal: showCreateForm,
    hideModal: hideCreateForm,
    formConfig: createFormConfig,
  } = useModal();
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { backupCode: apiList, loading: loadingList } = useApi();
  const [fetchData, setFetchData] = useState<any>(null);
  const { account, backupCode, loading } = useApi();
  const { data, query, totalPages, handlePageChange, handleSubmitQuery } =
    useGridView({
      fetchListApi: apiList.list,
      initQuery,
      queryParams: { accountId },
    });

  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.ACCOUNT.path,
    requireSessionKey: true,
  });

  useEffect(() => {
    if (!accountId) {
      handleNavigateBack();
      return;
    }
    const fetchData = async () => {
      const res = await account.get(accountId);
      if (res.result) {
        const data = res.data;
        setFetchData(data);
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [accountId]);

  const columns = [
    {
      label: "Code",
      accessor: "code",
      align: ALIGNMENT.LEFT,
      render: (item: any) => {
        return basicRender({
          align: ALIGNMENT.LEFT,
          content: decryptFieldByUserKey(sessionKey, item.code),
        });
      },
    },
    {
      label: "Created date",
      accessor: "createdDate",
      align: ALIGNMENT.CENTER,
      render: (item: any) => {
        return basicRender({
          align: ALIGNMENT.CENTER,
          content: convertUtcToVn(item.createdDate),
        });
      },
    },
    renderActionButton({
      role: [PAGE_CONFIG.DELETE_BACKUP_CODE.role],
      renderChildren: (item: any) => {
        return (
          <ActionDeleteButton
            role={PAGE_CONFIG.DELETE_BACKUP_CODE.role}
            onClick={() => onDeleteButtonClick(item.id)}
          />
        );
      },
    }),
  ];

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_BACKUP_CODE.label,
        deleteApi: () => backupCode.del(id),
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    showCreateForm(
      configModalForm({
        label: PAGE_CONFIG.CREATE_BACKUP_CODE.label,
        fetchApi: backupCode.create,
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideCreateForm,
        setToast,
        successMessage: BASIC_MESSAGES.CREATED,
        initForm: {
          accountId,
          code: "",
        },
      })
    );
  };

  return (
    <Sidebar2
      breadcrumbs={[
        {
          label: `(${fetchData?.platform?.name}) ${
            fetchData?.parent?.username || fetchData?.username
          }`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.BACKUP_CODE.label,
        },
      ]}
      activeItem={PAGE_CONFIG.ACCOUNT.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ConfirmationDialog
            isVisible={deleteDialogVisible}
            formConfig={deleteDialogConfig}
          />
          <CreateBackupCode
            isVisible={createFormVisible}
            formConfig={createFormConfig}
          />
          <ToolBar
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_PLATFORM.role}
                onClick={onCreateButtonClick}
              />
            }
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
    />
  );
};
export default BackupCode;
