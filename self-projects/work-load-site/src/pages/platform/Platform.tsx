import {
  ActionDeleteButton,
  ActionEditButton,
} from "../../components/form/Button";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import useApi from "../../hooks/useApi";
import useModal from "../../hooks/useModal";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useGridViewLocal from "../../hooks/useGridViewLocal";
import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { renderActionButton } from "../../components/config/ItemRender";
import {
  ALIGNMENT,
  BASIC_MESSAGES,
  ITEMS_PER_PAGE,
  SORT_PLATFORM_MAP,
} from "../../types/constant";
import {
  configDeleteDialog,
  configModalForm,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/form/Dialog";
import Sidebar2 from "../../components/main/Sidebar2";
import { CreateButton, ToolBar } from "../../components/main/ToolBar";
import { InputBox2 } from "../../components/form/InputTextField";
import { GridView } from "../../components/main/GridView";
import CreatePlatform from "./CreatePlatform";
import UpdatePlatform from "./UpdatePlatform";
import { ENCRYPT_FIELDS } from "../../services/encryption/encryptFields";
import { normalizeVietnamese } from "../../types/utils";
import { StaticSelectBox } from "../../components/form/SelectTextField";

const initQuery = { name: "", sort: "" };

const Platform = () => {
  const { state } = useLocation();
  const customFilterData = useCallback((allData: any[], query: any) => {
    const filtered = allData?.filter((item) => {
      const nameFilter =
        !query?.name ||
        normalizeVietnamese(item.name).includes(
          normalizeVietnamese(query.name)
        );
      return nameFilter;
    });
    if (query?.sort == SORT_PLATFORM_MAP.TOTAL_ACCOUNT_DESC.value) {
      filtered.sort((a, b) => (b.totalAccounts || 0) - (a.totalAccounts || 0));
    } else if (query?.sort == SORT_PLATFORM_MAP.TOTAL_ACCOUNT_ASC.value) {
      filtered.sort((a, b) => (a.totalAccounts || 0) - (b.totalAccounts || 0));
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    return filtered;
  }, []);
  const { setToast } = useGlobalContext();
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
  const { platform: apiList, loading: loadingList } = useApi();
  const { platform, loading } = useApi();
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
    decryptFields: ENCRYPT_FIELDS.PLATFORM,
  });

  const columns = [
    {
      label: "Name",
      accessor: "name",
      align: ALIGNMENT.LEFT,
    },
    {
      label: "Total accounts",
      accessor: "totalAccounts",
      align: ALIGNMENT.CENTER,
    },
    renderActionButton({
      renderChildren: (item: any) => {
        const hideDelete = item.totalAccounts > 0;
        return (
          <>
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
        label: PAGE_CONFIG.DELETE_PLATFORM.label,
        deleteApi: () => platform.del(id),
        refreshData: () => handleDeleteItem(id),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    showCreateForm(
      configModalForm({
        label: PAGE_CONFIG.CREATE_PLATFORM.label,
        fetchApi: platform.create,
        refreshData: handleRefreshData,
        hideModal: hideCreateForm,
        setToast,
        successMessage: BASIC_MESSAGES.CREATED,
        initForm: {
          name: "",
        },
      })
    );
  };

  const onUpdateButtonClick = (id: any) => {
    showUpdateForm(
      configModalForm({
        label: PAGE_CONFIG.UPDATE_PLATFORM.label,
        fetchApi: platform.update,
        refreshData: handleRefreshData,
        hideModal: hideUpdateForm,
        setToast,
        successMessage: BASIC_MESSAGES.UPDATED,
        initForm: {
          id,
        },
      })
    );
  };

  return (
    <Sidebar2
      breadcrumbs={[
        {
          label: PAGE_CONFIG.PLATFORM.label,
        },
      ]}
      activeItem={PAGE_CONFIG.PLATFORM.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <CreatePlatform
            isVisible={createFormVisible}
            formConfig={createFormConfig}
          />
          <UpdatePlatform
            isVisible={updateFormVisible}
            formConfig={updateFormConfig}
          />
          <ConfirmationDialog
            isVisible={deleteDialogVisible}
            formConfig={deleteDialogConfig}
          />
          <ToolBar
            searchBoxes={
              <>
                <InputBox2
                  value={query.name}
                  onChangeText={(value: any) =>
                    handleSubmitQuery({ ...query, name: value })
                  }
                  placeholder="Name..."
                />
                <StaticSelectBox
                  value={query.sort}
                  onChange={(value: any) => {
                    handleSubmitQuery({ ...query, sort: value });
                  }}
                  dataMap={SORT_PLATFORM_MAP}
                  placeholder="Sort..."
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
export default Platform;
