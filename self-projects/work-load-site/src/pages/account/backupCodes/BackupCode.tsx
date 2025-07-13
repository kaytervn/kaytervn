/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, useParams } from "react-router-dom";
import { useGlobalContext } from "../../../components/config/GlobalProvider";
import useApi from "../../../hooks/useApi";
import useModal from "../../../hooks/useModal";
import { useCallback, useEffect, useState } from "react";
import useGridViewLocal from "../../../hooks/useGridViewLocal";
import {
  DECRYPT_FIELDS,
  PAGE_CONFIG,
} from "../../../components/config/PageConfig";
import { renderActionButton } from "../../../components/config/ItemRender";
import {
  ALIGNMENT,
  BASIC_MESSAGES,
  ITEMS_PER_PAGE,
} from "../../../types/constant";
import {
  ActionDeleteButton,
  ActionEditButton,
} from "../../../components/form/Button";
import {
  configDeleteDialog,
  configModalForm,
  ConfirmationDialog,
  LoadingDialog,
} from "../../../components/form/Dialog";
import Sidebar2 from "../../../components/main/Sidebar2";
import { CreateButton, ToolBar } from "../../../components/main/ToolBar";
import { GridView } from "../../../components/main/GridView";
import useQueryState from "../../../hooks/useQueryState";
import { decryptDataByUserKey } from "../../../services/encryption/sessionEncryption";
import CreateBackupCode from "./CreateBackupCode";
import UpdateBackupCode from "./UpdateBackupCode";
import { InputBox2 } from "../../../components/form/InputTextField";

const initQuery = { code: "" };

const BackupCode = () => {
  const { accountId } = useParams();
  const { state } = useLocation();
  const { setToast, sessionKey } = useGlobalContext();
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { backupCode: apiList, loading: loadingList } = useApi();
  const { account, backupCode, loading } = useApi();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.ACCOUNT.path,
    requireSessionKey: true,
  });
  const [fetchData, setFetchData] = useState<any>(null);
  const {
    isModalVisible: createFormVisible,
    showModal: showCreateForm,
    hideModal: hideCreateForm,
    formConfig: createFormConfig,
  } = useModal();
  const {
    isModalVisible: updateFormVisible,
    showModal: showUpdateForm,
    hideModal: hideUpdateForm,
    formConfig: updateFormConfig,
  } = useModal();

  useEffect(() => {
    if (!accountId) {
      handleNavigateBack();
      return;
    }
    const fetchData = async () => {
      const res = await account.get(accountId);
      if (res.result) {
        const data = res.data;
        setFetchData(
          decryptDataByUserKey(sessionKey, data, DECRYPT_FIELDS.ACCOUNT)
        );
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [accountId]);

  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData
      ?.filter((item) => {
        const codeFilter =
          !query?.code ||
          item.code.toLowerCase().includes(query.code.toLowerCase());
        return codeFilter;
      })
      .sort((a, b) => a.code.localeCompare(b.code));
  }, []);

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
    queryParams: { account: accountId },
    decryptFields: DECRYPT_FIELDS.BACKUP_CODE,
  });

  const columns = [
    {
      label: "Code",
      accessor: "code",
      align: ALIGNMENT.LEFT,
    },
    renderActionButton({
      renderChildren: (item: any) => (
        <>
          <ActionEditButton onClick={() => onUpdateButtonClick(item._id)} />
          <ActionDeleteButton onClick={() => onDeleteButtonClick(item._id)} />
        </>
      ),
    }),
  ];

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_BACKUP_CODE.label,
        deleteApi: () => backupCode.del(id),
        refreshData: () => handleDeleteItem(id),
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
        refreshData: handleRefreshData,
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

  const onUpdateButtonClick = (id: any) => {
    showUpdateForm(
      configModalForm({
        label: PAGE_CONFIG.UPDATE_BACKUP_CODE.label,
        fetchApi: backupCode.update,
        refreshData: handleRefreshData,
        hideModal: hideUpdateForm,
        setToast,
        successMessage: BASIC_MESSAGES.UPDATED,
        initForm: {
          id,
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
            fetchData?.ref?.username || fetchData?.username
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
          <UpdateBackupCode
            isVisible={updateFormVisible}
            formConfig={updateFormConfig}
          />
          <ToolBar
            searchBoxes={
              <>
                <InputBox2
                  value={query.code}
                  onChangeText={(value: any) =>
                    handleSubmitQuery({ ...query, code: value })
                  }
                  placeholder="Code..."
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
    />
  );
};

export default BackupCode;
