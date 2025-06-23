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
  ITEMS_PER_PAGE,
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import InputBox from "../../components/page/InputBox";
import { GridView } from "../../components/page/GridView";
import {
  renderActionButton,
  renderImage,
} from "../../components/config/ItemRender";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useGridViewLocal from "../../hooks/useGridViewLocal";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreateOrganization from "./CreateOrganization";
import UpdateOrganization from "./UpdateOrganization";
import { BoxIcon } from "lucide-react";

const initQuery = { name: "" };

const Organization = () => {
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
  const { organization: apiList, loading: loadingList } = useApi();
  const { organization, loading } = useApi();
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
    decryptFields: DECRYPT_FIELDS.ORGANIZATION,
    secretKey: sessionKey,
    fetchListApi: apiList.list,
  });

  const columns = [
    renderImage({ label: "Logo", accessor: "logo", Icon: BoxIcon }),
    {
      label: "Tên công ty",
      accessor: "name",
      align: ALIGNMENT.LEFT,
    },
    renderActionButton({
      role: [
        PAGE_CONFIG.DELETE_ORGANIZATION.role,
        PAGE_CONFIG.UPDATE_ORGANIZATION.role,
        PAGE_CONFIG.ORGANIZATION_PERMISSION.role,
      ],
      renderChildren: (item: any) => (
        <>
          <ActionPermissionButton
            role={PAGE_CONFIG.ORGANIZATION_PERMISSION.role}
            onClick={() => onPermissionButtonClick(item.id)}
          />
          <ActionEditButton
            role={PAGE_CONFIG.UPDATE_ORGANIZATION.role}
            onClick={() => onUpdateButtonClick(item.id)}
          />
          <ActionDeleteButton
            role={PAGE_CONFIG.DELETE_ORGANIZATION.role}
            onClick={() => onDeleteButtonClick(item.id)}
          />
        </>
      ),
    }),
  ];

  const onPermissionButtonClick = (id: any) => {
    navigate(`/organization/permission/${id}`, { state: { query } });
  };

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_ORGANIZATION.label,
        deleteApi: () => organization.del(id),
        refreshData: () => handleDeleteItem(id),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    showCreateForm(
      configModalForm({
        label: PAGE_CONFIG.CREATE_ORGANIZATION.label,
        fetchApi: organization.create,
        refreshData: handleRefreshData,
        hideModal: hideCreateForm,
        setToast,
        successMessage: BASIC_MESSAGES.CREATED,
        initForm: {
          name: "",
          logo: "",
        },
      })
    );
  };

  const onUpdateButtonClick = (id: any) => {
    showUpdateForm(
      configModalForm({
        label: PAGE_CONFIG.UPDATE_ORGANIZATION.label,
        fetchApi: organization.update,
        refreshData: handleRefreshData,
        hideModal: hideUpdateForm,
        setToast,
        successMessage: BASIC_MESSAGES.UPDATED,
        initForm: {
          id,
          name: "",
          logo: "",
        },
      })
    );
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: PAGE_CONFIG.ORGANIZATION.label,
        },
      ]}
      activeItem={PAGE_CONFIG.ORGANIZATION.name}
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
                  placeholder="Tên công ty..."
                />
              </>
            }
            onClear={() => handleSubmitQuery(initQuery)}
            onRefresh={handleRefreshData}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_ORGANIZATION.role}
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
          <CreateOrganization
            isVisible={createFormVisible}
            formConfig={createFormConfig}
          />
          <UpdateOrganization
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
export default Organization;
