import {
  ActionDeleteButton,
  ActionDoneButton,
  ActionEditButton,
} from "../../components/form/Button";
import {
  configDeleteDialog,
  configDoneDialog,
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
  TASK_STATE_MAP,
  TOAST,
  TRUNCATE_LENGTH,
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import {
  CreateButton,
  ExportExcelButton,
  ToolBar,
} from "../../components/page/ToolBar";
import InputBox from "../../components/page/InputBox";
import { GridView } from "../../components/page/GridView";
import {
  basicRender,
  renderActionButton,
  renderIconField,
} from "../../components/config/ItemRender";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useGridViewLocal from "../../hooks/useGridViewLocal";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  convertUtcToVn,
  decryptData,
  truncateString,
} from "../../services/utils";
import useQueryState from "../../hooks/useQueryState";
import { StaticSelectBox } from "../../components/page/SelectBox";

const initQuery = { taskName: "", state: "" };

const Task = () => {
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.PROJECT.path,
    requireSessionKey: true,
  });
  const { projectId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData.filter((item) => {
      const nameFilter =
        !query?.taskName ||
        item.name.toLowerCase().includes(query.taskName.toLowerCase());
      const stateFilter = !query.state || item.state == query.state;
      return nameFilter && stateFilter;
    });
  }, []);
  const { setToast, sessionKey } = useGlobalContext();
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { task: apiList, loading: loadingList } = useApi();
  const { task, loading } = useApi();
  const { project } = useApi();
  const [fetchData, setFetchData] = useState<any>({});
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
    decryptFields: DECRYPT_FIELDS.TASK,
    secretKey: sessionKey,
    fetchListApi: apiList.list,
    queryParams: { projectId },
    pageAccesor: "taskPage",
  });

  useEffect(() => {
    if (!projectId || !sessionKey) {
      handleNavigateBack();
      return;
    }

    const fetchData = async () => {
      const res = await project.get(projectId);
      if (res.result) {
        const data = decryptData(sessionKey, res.data, DECRYPT_FIELDS.PROJECT);
        setFetchData(data);
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [projectId]);

  const columns = [
    renderIconField({
      label: "Tên công việc",
      accessor: "name",
      iconMapField: "state",
      dataMap: TASK_STATE_MAP,
      role: PAGE_CONFIG.VIEW_TASK.role,
      onClick: (item: any) => onViewClick(item),
    }),
    {
      label: "Ghi chú",
      accessor: "note",
      align: ALIGNMENT.LEFT,
      render: (item: any) => {
        return basicRender({
          align: ALIGNMENT.LEFT,
          content: truncateString(item.note, TRUNCATE_LENGTH),
        });
      },
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
        PAGE_CONFIG.DELETE_TASK.role,
        PAGE_CONFIG.UPDATE_TASK.role,
        PAGE_CONFIG.DONE_TASK.role,
      ],
      renderChildren: (item: any) => (
        <>
          {TASK_STATE_MAP.PENDING.value == item.state && (
            <ActionDoneButton
              role={PAGE_CONFIG.DONE_TASK.role}
              onClick={() => onDoneButtonClick(item.id)}
            />
          )}
          <ActionEditButton
            role={PAGE_CONFIG.UPDATE_TASK.role}
            onClick={() => onUpdateButtonClick(item)}
          />
          <ActionDeleteButton
            role={PAGE_CONFIG.DELETE_TASK.role}
            onClick={() => onDeleteButtonClick(item.id)}
          />
        </>
      ),
    }),
  ];

  const onDoneButtonClick = (id: any) => {
    showDeleteDialog(
      configDoneDialog({
        label: PAGE_CONFIG.DONE_TASK.label,
        doneApi: () => task.changeState(id),
        refreshData: handleRefreshData,
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_TASK.label,
        deleteApi: () => task.del(id),
        refreshData: () => handleDeleteItem(id),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onExportExcelButtonClick = async () => {
    if (!data.length) {
      setToast(BASIC_MESSAGES.NO_DATA, TOAST.WARN);
      return;
    }
    const ids = data.map((item: any) => item.id);
    const res = await task.exportToExcel(ids);
    if (res.result) {
      setToast(BASIC_MESSAGES.EXPORTED, TOAST.SUCCESS);
    } else {
      setToast(BASIC_MESSAGES.FAILED, TOAST.ERROR);
    }
  };

  const onCreateButtonClick = () => {
    navigate(`/project/task/${projectId}/create`, {
      state: { query },
    });
  };

  const onViewClick = (item: any) => {
    navigate(`/project/task/${item.project.id}/view/${item.id}`, {
      state: { query },
    });
  };

  const onUpdateButtonClick = (item: any) => {
    navigate(`/project/task/${item.project.id}/update/${item.id}`, {
      state: { query },
    });
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: `${fetchData?.name}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.TASK.label,
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
                  value={query.taskName}
                  onChangeText={(value: any) =>
                    handleSubmitQuery({ ...query, taskName: value })
                  }
                  placeholder="Tên công việc..."
                />
                <StaticSelectBox
                  value={query.state}
                  onChange={(value: any) => {
                    handleSubmitQuery({ ...query, state: value });
                  }}
                  dataMap={TASK_STATE_MAP}
                  placeholder="Tình trạng..."
                />
              </>
            }
            onClear={() => handleSubmitQuery(initQuery)}
            onRefresh={handleRefreshData}
            actionButtons={
              <div className="flex space-x-2">
                <ExportExcelButton
                  role={PAGE_CONFIG.EXPORT_EXCEL_TASK.role}
                  onClick={onExportExcelButtonClick}
                />
                <CreateButton
                  role={PAGE_CONFIG.CREATE_TASK.role}
                  onClick={onCreateButtonClick}
                />
              </div>
            }
          />
          <GridView
            isLoading={loadingList}
            data={data}
            columns={columns}
            currentPage={query["taskPage"]}
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
export default Task;
