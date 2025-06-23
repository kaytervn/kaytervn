import { ActionDeleteButton } from "../../components/form/Button";
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
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import { GridView } from "../../components/page/GridView";
import { useLocation, useParams } from "react-router-dom";
import useQueryState from "../../hooks/useQueryState";
import { useCallback, useEffect, useState } from "react";
import { renderActionButton } from "../../components/config/ItemRender";
import { decryptData } from "../../services/utils";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useGridViewLocal from "../../hooks/useGridViewLocal";
import InputBox from "../../components/page/InputBox";
import CreateServiceNotificationGroup from "./CreateServiceNotificationGroup";

const initQuery = {
  groupName: "",
};

const ServiceNotificationGroup = () => {
  const { setToast, sessionKey } = useGlobalContext();
  const { serviceId } = useParams();
  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData.filter((item) => {
      const nameFilter =
        !query?.groupName ||
        item.notificationGroup.name
          .toLowerCase()
          .includes(query.groupName.toLowerCase());
      return nameFilter;
    });
  }, []);
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.SERVICE.path,
    requireSessionKey: true,
  });
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
  const { serviceNotificationGroup: apiList, loading: loadingList } = useApi();
  const { service } = useApi();
  const { serviceNotificationGroup, loading } = useApi();
  const {
    data,
    query,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
    handleDeleteItem,
    handleRefreshData,
  } = useGridViewLocal({
    initQuery,
    filterData: customFilterData,
    decryptFields: DECRYPT_FIELDS.SERVICE_NOTIFICATION_GROUP,
    secretKey: sessionKey,
    fetchListApi: apiList.list,
    queryParams: { serviceId },
  });
  const [groupData, setGroupData] = useState<any>(null);

  useEffect(() => {
    if (!serviceId) {
      handleNavigateBack();
      return;
    }
    const fetchData = async () => {
      const res = await service.get(serviceId);
      if (res.result) {
        const data = res.data;
        setGroupData(decryptData(sessionKey, data, DECRYPT_FIELDS.SERVICE));
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [serviceId]);

  const columns = [
    {
      label: "Tên nhóm",
      accessor: "notificationGroup.name",
      align: ALIGNMENT.LEFT,
    },
    renderActionButton({
      role: [PAGE_CONFIG.DELETE_SERVICE_NOTIFICATION_GROUP.role],
      renderChildren: (item: any) => (
        <>
          <ActionDeleteButton
            role={PAGE_CONFIG.DELETE_SERVICE_NOTIFICATION_GROUP.role}
            onClick={() => onDeleteButtonClick(item.id)}
          />
        </>
      ),
    }),
  ];

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_SERVICE_NOTIFICATION_GROUP.label,
        deleteApi: () => serviceNotificationGroup.del(id),
        refreshData: () => handleDeleteItem(id),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    showCreateForm(
      configModalForm({
        label: PAGE_CONFIG.CREATE_SERVICE_NOTIFICATION_GROUP.label,
        fetchApi: serviceNotificationGroup.create,
        refreshData: handleRefreshData,
        hideModal: hideCreateForm,
        setToast,
        successMessage: BASIC_MESSAGES.CREATED,
        initForm: {
          serviceId,
          notificationGroupId: "",
        },
      })
    );
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: `${groupData?.name}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.SERVICE_NOTIFICATION_GROUP.label,
        },
      ]}
      activeItem={PAGE_CONFIG.SERVICE.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ToolBar
            searchBoxes={
              <>
                <InputBox
                  value={query.groupName}
                  onChangeText={(value: any) =>
                    handleSubmitQuery({ ...query, groupName: value })
                  }
                  placeholder="Tên nhóm..."
                />
              </>
            }
            onClear={() => handleSubmitQuery(initQuery)}
            onRefresh={handleRefreshData}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_SERVICE_NOTIFICATION_GROUP.role}
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
          <CreateServiceNotificationGroup
            isVisible={createFormVisible}
            formConfig={createFormConfig}
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
export default ServiceNotificationGroup;
