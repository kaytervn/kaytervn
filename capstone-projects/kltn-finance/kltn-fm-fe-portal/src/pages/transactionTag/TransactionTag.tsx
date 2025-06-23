import {
  ActionDeleteButton,
  ActionEditButton,
} from "../../components/form/Button";
import {
  configDeleteDialog,
  configModalForm,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/page/Dialog";
import {
  DECRYPT_FIELDS,
  PAGE_CONFIG,
} from "../../components/config/PageConfig";
import useApi from "../../hooks/useApi";
import useModal from "../../hooks/useModal";
import {
  ALIGNMENT,
  BASIC_MESSAGES,
  ITEMS_PER_PAGE,
  TAG_KIND,
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import InputBox from "../../components/page/InputBox";
import { GridView } from "../../components/page/GridView";
import {
  renderActionButton,
  renderColorCode,
} from "../../components/config/ItemRender";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useGridViewLocal from "../../hooks/useGridViewLocal";
import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import CreateTransactionTag from "./CreateTransactionTag";
import UpdateTransactionTag from "./UpdateTransactionTag";

const initQuery = { name: "" };

const TransactionTag = () => {
  const { state } = useLocation();
  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData?.filter((item) => {
      return (
        !query?.name ||
        item.name.toLowerCase().includes(query.name.toLowerCase())
      );
    });
  }, []);
  const { setToast, sessionKey } = useGlobalContext();
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
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { tag: apiList, loading: loadingList } = useApi();
  const { tag, loading } = useApi();
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
    decryptFields: DECRYPT_FIELDS.TAG,
    secretKey: sessionKey,
    fetchListApi: apiList.list,
    queryParams: { kind: TAG_KIND.TRANSACTION },
  });

  const columns = [
    {
      label: "Tên tag",
      accessor: "name",
      align: ALIGNMENT.LEFT,
    },
    renderColorCode({}),
    renderActionButton({
      role: [
        PAGE_CONFIG.DELETE_TRANSACTION_TAG.role,
        PAGE_CONFIG.UPDATE_TRANSACTION_TAG.role,
      ],
      renderChildren: (item: any) => (
        <>
          <ActionEditButton
            role={PAGE_CONFIG.UPDATE_TRANSACTION_TAG.role}
            onClick={() => onUpdateButtonClick(item.id)}
          />
          <ActionDeleteButton
            role={PAGE_CONFIG.DELETE_TRANSACTION_TAG.role}
            onClick={() => onDeleteButtonClick(item.id)}
          />
        </>
      ),
    }),
  ];

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_TRANSACTION_TAG.label,
        deleteApi: () => tag.del(id),
        refreshData: () => handleDeleteItem(id),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    showCreateForm(
      configModalForm({
        label: PAGE_CONFIG.CREATE_TRANSACTION_TAG.label,
        fetchApi: tag.create,
        refreshData: handleRefreshData,
        hideModal: hideCreateForm,
        setToast,
        successMessage: BASIC_MESSAGES.CREATED,
        initForm: {
          kind: TAG_KIND.TRANSACTION,
          name: "",
          colorCode: "#FFFFFF",
        },
      })
    );
  };

  const onUpdateButtonClick = (id: any) => {
    showUpdateForm(
      configModalForm({
        label: PAGE_CONFIG.UPDATE_TRANSACTION_TAG.label,
        fetchApi: tag.update,
        refreshData: handleRefreshData,
        hideModal: hideUpdateForm,
        setToast,
        successMessage: BASIC_MESSAGES.UPDATED,
        initForm: {
          id,
          name: "",
          colorCode: "#FFFFFF",
        },
      })
    );
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: PAGE_CONFIG.TRANSACTION_TAG.label,
        },
      ]}
      activeItem={PAGE_CONFIG.TRANSACTION_TAG.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ToolBar
            searchBoxes={
              <>
                <InputBox
                  value={query.name}
                  onChangeText={(value: any) =>
                    handleSubmitQuery({ ...query, name: value })
                  }
                  placeholder="Tên tag..."
                />
              </>
            }
            onClear={() => handleSubmitQuery(initQuery)}
            onRefresh={handleRefreshData}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_TRANSACTION_TAG.role}
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
          <CreateTransactionTag
            isVisible={createFormVisible}
            formConfig={createFormConfig}
          />
          <UpdateTransactionTag
            isVisible={updateFormVisible}
            formConfig={updateFormConfig}
          />
          <ConfirmationDialog
            isVisible={deleteDialogVisible}
            formConfig={deleteDialogConfig}
          />
        </>
      }
    ></Sidebar>
  );
};
export default TransactionTag;
