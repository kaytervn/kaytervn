import {
  ActionDeleteButton,
  ActionEditButton,
  ActionPermissionButton,
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
  BUTTON_TEXT,
  ITEMS_PER_PAGE,
  TRUNCATE_LENGTH,
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import InputBox from "../../components/page/InputBox";
import { GridView } from "../../components/page/GridView";
import {
  basicRender,
  renderActionButton,
} from "../../components/config/ItemRender";
import { truncateString } from "../../services/utils";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useGridViewLocal from "../../hooks/useGridViewLocal";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreateNotificationGroup from "./CreateNotificationGroup";
import UpdateNotificationGroup from "./UpdateNotificationGroup";

const initQuery = { name: "" };

const NotificationGroup = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData.filter((item) => {
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
  const { notificationGroup: apiList, loading: loadingList } = useApi();
  const { notificationGroup, loading } = useApi();
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
    decryptFields: DECRYPT_FIELDS.NOTIFICATION_GROUP,
    secretKey: sessionKey,
    fetchListApi: apiList.list,
  });

  const columns = [
    {
      label: "Tên nhóm",
      accessor: "name",
      align: ALIGNMENT.LEFT,
    },
    {
      label: "Mô tả",
      accessor: "description",
      align: ALIGNMENT.LEFT,
      render: (item: any) => {
        return basicRender({
          align: ALIGNMENT.LEFT,
          content: truncateString(item.description, TRUNCATE_LENGTH),
        });
      },
    },
    renderActionButton({
      role: [
        PAGE_CONFIG.DELETE_NOTIFICATION_GROUP.role,
        PAGE_CONFIG.UPDATE_NOTIFICATION_GROUP.role,
        PAGE_CONFIG.USER_NOTIFICATION_GROUP.role,
      ],
      renderChildren: (item: any) => (
        <>
          <ActionPermissionButton
            role={PAGE_CONFIG.USER_NOTIFICATION_GROUP.role}
            onClick={() => onPermissionButtonClick(item.id)}
            text={BUTTON_TEXT.ADD_MEMBER}
          />
          <ActionEditButton
            role={PAGE_CONFIG.UPDATE_NOTIFICATION_GROUP.role}
            onClick={() => onUpdateButtonClick(item.id)}
          />
          <ActionDeleteButton
            role={PAGE_CONFIG.DELETE_NOTIFICATION_GROUP.role}
            onClick={() => onDeleteButtonClick(item.id)}
          />
        </>
      ),
    }),
  ];

  const onPermissionButtonClick = (id: any) => {
    navigate(`/notification-group/users/${id}`, { state: { query } });
  };

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_NOTIFICATION_GROUP.label,
        deleteApi: () => notificationGroup.del(id),
        refreshData: () => handleDeleteItem(id),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    showCreateForm(
      configModalForm({
        label: PAGE_CONFIG.CREATE_USER_NOTIFICATION_GROUP.label,
        fetchApi: notificationGroup.create,
        refreshData: handleRefreshData,
        hideModal: hideCreateForm,
        setToast,
        successMessage: BASIC_MESSAGES.CREATED,
        initForm: {
          name: "",
          description: "",
        },
      })
    );
  };

  const onUpdateButtonClick = (id: any) => {
    showUpdateForm(
      configModalForm({
        label: PAGE_CONFIG.UPDATE_NOTIFICATION_GROUP.label,
        fetchApi: notificationGroup.update,
        refreshData: handleRefreshData,
        hideModal: hideUpdateForm,
        setToast,
        successMessage: BASIC_MESSAGES.UPDATED,
        initForm: {
          id,
          name: "",
          description: "",
        },
      })
    );
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: PAGE_CONFIG.NOTIFICATION_GROUP.label,
        },
      ]}
      activeItem={PAGE_CONFIG.NOTIFICATION_GROUP.name}
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
                  placeholder="Tên nhóm..."
                />
              </>
            }
            onClear={() => handleSubmitQuery(initQuery)}
            onRefresh={handleRefreshData}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_NOTIFICATION_GROUP.role}
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
          <CreateNotificationGroup
            isVisible={createFormVisible}
            formConfig={createFormConfig}
          />
          <UpdateNotificationGroup
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
export default NotificationGroup;
