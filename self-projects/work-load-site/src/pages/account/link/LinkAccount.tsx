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
  ACCOUNT_KIND_MAP,
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
import { SelectBoxLazy } from "../../../components/form/SelectTextField";
import { GridView } from "../../../components/main/GridView";
import useQueryState from "../../../hooks/useQueryState";
import { decryptDataByUserKey } from "../../../services/encryption/sessionEncryption";
import CreateLinkAccount from "./CreateLinkAccount";
import UpdateLinkAccount from "./UpdateLinkAccount";

const initQuery = { linkAccountPlatformId: "" };

const LinkAccount = () => {
  const { refId } = useParams();
  const { state } = useLocation();
  const { setToast, sessionKey } = useGlobalContext();
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { account: apiList, loading: loadingList } = useApi();
  const { account, loading } = useApi();
  const { platform } = useApi();
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
    if (!refId) {
      handleNavigateBack();
      return;
    }
    const fetchData = async () => {
      const res = await account.get(refId);
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
  }, [refId]);

  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData
      .filter((item) => {
        const platformIdFilter =
          !query?.linkAccountPlatformId ||
          item.platform?._id == query.linkAccountPlatformId;
        return platformIdFilter;
      })
      .sort((a, b) => {
        const platformCompare =
          a.platform?.name?.localeCompare(b.platform?.name || "") || 0;
        if (platformCompare !== 0) return platformCompare;
        return a.username?.localeCompare(b.username || "");
      });
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
    queryParams: { ref: refId },
    decryptFields: DECRYPT_FIELDS.ACCOUNT,
  });

  const columns = [
    {
      label: "Platform",
      accessor: "platform.name",
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
        label: PAGE_CONFIG.DELETE_LINK_ACCOUNT.label,
        deleteApi: () => account.del(id),
        refreshData: () => handleDeleteItem(id),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    showCreateForm(
      configModalForm({
        label: PAGE_CONFIG.CREATE_LINK_ACCOUNT.label,
        fetchApi: account.create,
        refreshData: handleRefreshData,
        hideModal: hideCreateForm,
        setToast,
        successMessage: BASIC_MESSAGES.CREATED,
        initForm: {
          refId,
          platformId: "",
          note: "",
          kind: ACCOUNT_KIND_MAP.LINKED.value,
        },
      })
    );
  };

  const onUpdateButtonClick = (id: any) => {
    showUpdateForm(
      configModalForm({
        label: PAGE_CONFIG.UPDATE_LINK_ACCOUNT.label,
        fetchApi: account.update,
        refreshData: handleRefreshData,
        hideModal: hideUpdateForm,
        setToast,
        successMessage: BASIC_MESSAGES.UPDATED,
        initForm: {
          id,
          platformId: "",
          note: "",
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
          label: PAGE_CONFIG.LINK_ACCOUNT.label,
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
          <CreateLinkAccount
            isVisible={createFormVisible}
            formConfig={createFormConfig}
          />
          <UpdateLinkAccount
            isVisible={updateFormVisible}
            formConfig={updateFormConfig}
          />
          <ToolBar
            searchBoxes={
              <>
                <SelectBoxLazy
                  value={query.linkAccountPlatformId}
                  onChange={(value: any) => {
                    handleSubmitQuery({
                      ...query,
                      linkAccountPlatformId: value,
                    });
                  }}
                  fetchListApi={platform.list}
                  placeholder="Platform..."
                  valueKey="_id"
                  decryptFields={DECRYPT_FIELDS.PLATFORM}
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

export default LinkAccount;
