import { ActionDeleteButton } from "../../components/form/Button";
import { ConfirmationDialog } from "../../components/page/Dialog";
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
  TOAST,
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import { GridView } from "../../components/page/GridView";
import { useParams } from "react-router-dom";
import useQueryState from "../../hooks/useQueryState";
import { useCallback, useEffect, useState } from "react";
import { renderActionButton } from "../../components/config/ItemRender";
import { decryptData } from "../../services/utils";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useGridViewLocal from "../../hooks/useGridViewLocal";
import CreateServiceSchedule from "./CreateServiceSchedule";

const ServiceSchedule = () => {
  const { setToast, sessionKey } = useGlobalContext();
  const { serviceId } = useParams();
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
  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData;
  }, []);
  const { serviceSchedule: apiList, loading: loadingList } = useApi();
  const { service, serviceSchedule } = useApi();
  const {
    data,
    query,
    totalPages,
    allData,
    updateData,
    handleRefreshData,
    handlePageChange,
  } = useGridViewLocal({
    filterData: customFilterData,
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
        const newData = decryptData(
          sessionKey,
          res.data,
          DECRYPT_FIELDS.SERVICE
        );
        setGroupData((prev: any) => (prev?.id !== newData.id ? newData : prev));
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [serviceId]);

  const columns = [
    {
      label: "Thông báo",
      accessor: "numberOfDueDays",
      align: ALIGNMENT.LEFT,
      render: (item: any) => {
        return (
          <span
            className={`text-gray-300 text-sm text-${ALIGNMENT.LEFT} whitespace-nowrap`}
          >
            Thông báo dịch vụ tới hạn trước{" "}
            <span
              style={{
                color: "#ef4444",
                fontWeight: "600",
              }}
            >
              {item.numberOfDueDays}
            </span>{" "}
            ngày
          </span>
        );
      },
    },
    renderActionButton({
      role: [PAGE_CONFIG.DELETE_SERVICE_SCHEDULE.role],
      renderChildren: (item: any) => (
        <>
          <ActionDeleteButton
            role={PAGE_CONFIG.DELETE_SERVICE_SCHEDULE.role}
            onClick={() => onDeleteButtonClick(item)}
          />
        </>
      ),
    }),
  ];

  const onDeleteButtonClick = (item: any) => {
    showDeleteDialog({
      title: PAGE_CONFIG.DELETE_SERVICE_SCHEDULE.label,
      message: "Bạn có chắc chắn muốn xóa?",
      color: "crimson",
      onConfirm: async () => {
        hideDeleteDialog();
        const newData = allData.filter((it) => {
          return it.numberOfDueDays !== item.numberOfDueDays;
        });
        const numberOfDueDaysList: number[] = newData.map(
          (it) => it.numberOfDueDays
        );
        const res = await serviceSchedule.update({
          numberOfDueDaysList,
          serviceId,
        });
        if (res.result) {
          setToast(BASIC_MESSAGES.DELETED, TOAST.SUCCESS);
          updateData(newData);
        } else {
          setToast(res.message, TOAST.ERROR);
        }
      },
      confirmText: BUTTON_TEXT.DELETE,
      onCancel: hideDeleteDialog,
    });
  };

  const onCreateButtonClick = () => {
    showCreateForm({
      title: PAGE_CONFIG.CREATE_SERVICE_SCHEDULE.label,
      onButtonClick: async (newItem: any) => {
        const updatedData = [...allData, newItem];
        const numberOfDueDaysList: number[] = updatedData.map(
          (it) => it.numberOfDueDays
        );
        const res = await serviceSchedule.update({
          numberOfDueDaysList,
          serviceId,
        });
        if (res.result) {
          hideCreateForm();
          await handleRefreshData();
          setToast(BASIC_MESSAGES.CREATED, TOAST.SUCCESS);
        } else {
          setToast(res.message, TOAST.ERROR);
        }
      },
      hideModal: hideCreateForm,
      initForm: {
        serviceId,
        numberOfDueDays: "",
      },
    });
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: `${groupData?.name}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.SERVICE_SCHEDULE.label,
        },
      ]}
      activeItem={PAGE_CONFIG.SERVICE.name}
      renderContent={
        <>
          <ToolBar
            onRefresh={handleRefreshData}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_SERVICE_SCHEDULE.role}
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
          <CreateServiceSchedule
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
export default ServiceSchedule;
