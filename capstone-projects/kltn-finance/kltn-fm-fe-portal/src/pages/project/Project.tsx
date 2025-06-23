import {
  ActionDeleteButton,
  ActionEditButton,
  ActionPermissionButton,
  ActionTasksButton,
} from "../../components/form/Button";
import {
  configDeleteDialog,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/page/Dialog";
import {
  DECRYPT_FIELDS,
  PAGE_CONFIG,
} from "../../components/config/PageConfig";
import useApi from "../../hooks/useApi";
import useModal from "../../hooks/useModal";
import { ALIGNMENT, ITEMS_PER_PAGE, TAG_KIND } from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import InputBox from "../../components/page/InputBox";
import { GridView } from "../../components/page/GridView";
import {
  renderActionButton,
  renderImage,
  renderTagField,
} from "../../components/config/ItemRender";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useGridViewLocal from "../../hooks/useGridViewLocal";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BoxIcon } from "lucide-react";
import { convertUtcToVn } from "../../services/utils";
import { SelectBoxLazy } from "../../components/page/SelectBox";

const initQuery = { projectName: "", organizationId: "", tagId: "" };

const Project = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData.filter((item) => {
      const nameFilter =
        !query?.projectName ||
        item.name.toLowerCase().includes(query.projectName.toLowerCase());
      const organizationIdFilter =
        !query?.organizationId ||
        item?.organization?.id == query.organizationId;
      const tagIdFilter = !query?.tagId || item?.tag?.id == query.tagId;
      return nameFilter && organizationIdFilter && tagIdFilter;
    });
  }, []);
  const { setToast, sessionKey } = useGlobalContext();
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { project: apiList, loading: loadingList } = useApi();
  const { project, loading } = useApi();
  const { organization, tag } = useApi();
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
    decryptFields: DECRYPT_FIELDS.PROJECT,
    secretKey: sessionKey,
    fetchListApi: apiList.list,
  });

  const columns = [
    renderImage({ label: "Logo", accessor: "logo", Icon: BoxIcon }),
    renderTagField({
      label: "Tên ghi chú",
      accessor: "name",
      colorCodeField: "tag.colorCode",
    }),
    {
      label: "Công ty",
      accessor: "organization.name",
      align: ALIGNMENT.LEFT,
    },
    {
      label: "Tổng công việc",
      accessor: "totalTasks",
      align: ALIGNMENT.RIGHT,
    },
    {
      label: "Ngày tạo",
      accessor: "createdDate",
      align: ALIGNMENT.LEFT,
      render: (item: any) => {
        return (
          <span
            className={`text-gray-300 text-${ALIGNMENT.LEFT} whitespace-nowrap`}
          >
            {convertUtcToVn(item.createdDate)}
          </span>
        );
      },
    },
    renderActionButton({
      role: [
        PAGE_CONFIG.DELETE_PROJECT.role,
        PAGE_CONFIG.UPDATE_PROJECT.role,
        PAGE_CONFIG.TASK.role,
        PAGE_CONFIG.PROJECT_PERMISSION.role,
      ],
      renderChildren: (item: any) => (
        <>
          <ActionPermissionButton
            role={PAGE_CONFIG.PROJECT_PERMISSION.role}
            onClick={() => onPermissionButtonClick(item.id)}
          />
          <ActionTasksButton
            role={PAGE_CONFIG.TASK.role}
            onClick={() => onTaskButtonClick(item.id)}
          />
          <ActionEditButton
            role={PAGE_CONFIG.UPDATE_PROJECT.role}
            onClick={() => onUpdateButtonClick(item.id)}
          />
          <ActionDeleteButton
            role={PAGE_CONFIG.DELETE_PROJECT.role}
            onClick={() => onDeleteButtonClick(item.id)}
          />
        </>
      ),
    }),
  ];

  const onPermissionButtonClick = (id: any) => {
    navigate(`/project/permission/${id}`, { state: { query } });
  };

  const onTaskButtonClick = (id: any) => {
    navigate(`/project/task/${id}`, { state: { query } });
  };

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_PROJECT.label,
        deleteApi: () => project.del(id),
        refreshData: () => handleDeleteItem(id),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    navigate(PAGE_CONFIG.CREATE_PROJECT.path, { state: { query } });
  };

  const onUpdateButtonClick = (id: any) => {
    navigate(`/project/update/${id}`, { state: { query } });
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: PAGE_CONFIG.PROJECT.label,
        },
      ]}
      activeItem={PAGE_CONFIG.PROJECT.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ToolBar
            searchBoxes={
              <>
                <InputBox
                  value={query.projectName}
                  onChangeText={(value: any) =>
                    handleSubmitQuery({ ...query, projectName: value })
                  }
                  placeholder="Tên ghi chú..."
                />
                <SelectBoxLazy
                  value={query.organizationId}
                  onChange={(value: any) => {
                    handleSubmitQuery({ ...query, organizationId: value });
                  }}
                  fetchListApi={organization.autoComplete}
                  placeholder="Công ty..."
                  decryptFields={DECRYPT_FIELDS.ORGANIZATION}
                />
                <SelectBoxLazy
                  value={query.tagId}
                  onChange={(value: any) => {
                    handleSubmitQuery({ ...query, tagId: value });
                  }}
                  fetchListApi={tag.autoComplete}
                  queryParams={{ kind: TAG_KIND.PROJECT }}
                  placeholder="Thẻ..."
                  colorCodeField="colorCode"
                  decryptFields={DECRYPT_FIELDS.TAG}
                />
              </>
            }
            onClear={() => handleSubmitQuery(initQuery)}
            onRefresh={handleRefreshData}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_PROJECT.role}
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
          <ConfirmationDialog
            isVisible={deleteDialogVisible}
            formConfig={deleteDialogConfig}
          />
        </>
      }
    ></Sidebar>
  );
};
export default Project;
