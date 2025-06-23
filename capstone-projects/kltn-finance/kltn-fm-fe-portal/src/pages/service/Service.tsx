import {
  ActionDeleteButton,
  ActionEditButton,
  BasicActionButton,
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
  BUTTON_TEXT,
  ITEMS_PER_PAGE,
  PERIOD_KIND_MAP,
  TAG_KIND,
  TRANSACTION_KIND_MAP,
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import InputBox from "../../components/page/InputBox";
import { GridView } from "../../components/page/GridView";
import {
  basicRender,
  renderActionButton,
  renderEnum,
  renderMoneyField,
  renderTagField,
} from "../../components/config/ItemRender";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useGridViewLocal from "../../hooks/useGridViewLocal";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SelectBoxLazy,
  StaticSelectBox,
} from "../../components/page/SelectBox";
import { parseDate, truncateToDDMMYYYY } from "../../services/utils";
import DatePickerBox from "../../components/page/DatePickerBox";
import ResolveService from "./ResolveService";
import { CalendarIcon, MegaphoneIcon, WalletIcon } from "lucide-react";

const renderExpirationDateField = (item: any) => {
  const expiredDate = parseDate(item.expirationDate);
  if (!expiredDate) {
    return basicRender({ align: "left", content: "Chưa đặt" });
  }

  const daysLeft = Math.ceil(
    (expiredDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isPaid = item?.isPaid == 1;
  const isExpired = daysLeft < 0;
  const isWarning = daysLeft >= 0 && daysLeft <= 7;

  return (
    <div className="flex items-center space-x-2 py-2">
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
          isPaid
            ? "bg-blue-900/20 text-blue-300"
            : isExpired
            ? "bg-red-900/20 text-red-300"
            : isWarning
            ? "bg-yellow-900/20 text-yellow-300"
            : "bg-green-900/20 text-green-300"
        }`}
      >
        {truncateToDDMMYYYY(item.expirationDate)}
      </span>
      <span
        className={`text-xs whitespace-nowrap ${
          isPaid
            ? "text-blue-400"
            : isExpired
            ? "text-red-400"
            : isWarning
            ? "text-yellow-400"
            : "text-green-400"
        }`}
      >
        {isPaid ? "Hoàn tất" : isExpired ? "Hết hạn" : `${daysLeft} ngày`}
      </span>
    </div>
  );
};

const initQuery = {
  name: "",
  kind: "",
  periodKind: "",
  fromDate: "",
  toDate: "",
  serviceGroupId: "",
  tagId: "",
};

const Service = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData.filter((item) => {
      const nameFilter =
        !query?.name ||
        item.name.toLowerCase().includes(query.name.toLowerCase());
      const kindFilter = !query?.kind || item.kind == query.kind;
      const periodKindFilter =
        !query?.periodKind || item.periodKind == query.periodKind;
      const serviceGroupIdFilter =
        !query?.serviceGroupId ||
        item?.serviceGroup?.id == query.serviceGroupId;
      const fromDate = parseDate(query?.fromDate);
      const toDate = parseDate(query?.toDate);
      const startDate = parseDate(item.startDate);
      const expirationDate = parseDate(item.expirationDate);
      const fromDateFilter = !fromDate || !startDate || fromDate >= startDate;
      const toDateFilter =
        !toDate || !expirationDate || toDate >= expirationDate;
      const tagIdFilter = !query?.tagId || item?.tag?.id == query.tagId;
      return (
        nameFilter &&
        periodKindFilter &&
        tagIdFilter &&
        kindFilter &&
        serviceGroupIdFilter &&
        fromDateFilter &&
        toDateFilter
      );
    });
  }, []);
  const { setToast, sessionKey } = useGlobalContext();
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const {
    isModalVisible: resolveDialogVisible,
    showModal: showResolveDialog,
    hideModal: hideResolveDialog,
    formConfig: resolveDialogConfig,
  } = useModal();
  const { service: apiList, loading: loadingList } = useApi();
  const { service, loading } = useApi();
  const { serviceGroup, tag } = useApi();
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
    decryptFields: DECRYPT_FIELDS.SERVICE,
    secretKey: sessionKey,
    fetchListApi: apiList.list,
    queryParams: { sortDate: 3 },
  });

  const columns = [
    renderTagField({
      label: "Tên dịch vụ",
      accessor: "name",
      align: ALIGNMENT.LEFT,
      colorCodeField: "tag.colorCode",
    }),
    {
      label: "Ngày bắt đầu",
      accessor: "startDate",
      align: ALIGNMENT.LEFT,
      render: (item: any) => {
        return basicRender({
          align: ALIGNMENT.LEFT,
          content: truncateToDDMMYYYY(item.startDate),
        });
      },
    },
    {
      label: "Ngày tới hạn",
      accessor: "expirationDate",
      align: ALIGNMENT.LEFT,
      render: (item: any) => renderExpirationDateField(item),
    },
    renderMoneyField({
      label: "Số tiền",
      accessor: "money",
      align: ALIGNMENT.RIGHT,
    }),
    renderEnum({
      label: "Loại",
      accessor: "kind",
      dataMap: TRANSACTION_KIND_MAP,
    }),
    {
      label: "Nhóm dịch vụ",
      accessor: "serviceGroup.name",
      align: ALIGNMENT.LEFT,
    },
    renderEnum({
      label: "Chu kỳ",
      accessor: "periodKind",
      dataMap: PERIOD_KIND_MAP,
    }),
    renderActionButton({
      role: [
        PAGE_CONFIG.DELETE_SERVICE.role,
        PAGE_CONFIG.UPDATE_SERVICE.role,
        PAGE_CONFIG.RESOLVE_SERVICE.role,
        PAGE_CONFIG.SERVICE_NOTIFICATION_GROUP.role,
        PAGE_CONFIG.SERVICE_SCHEDULE.role,
      ],
      renderChildren: (item: any) => (
        <>
          {item.isPaid == 0 && (
            <BasicActionButton
              role={PAGE_CONFIG.RESOLVE_SERVICE.role}
              Icon={WalletIcon}
              buttonText={BUTTON_TEXT.RESOLVE}
              onClick={() => onResolveButtonClick(item)}
            />
          )}
          <BasicActionButton
            role={PAGE_CONFIG.SERVICE_SCHEDULE.role}
            Icon={CalendarIcon}
            buttonText={PAGE_CONFIG.SERVICE_SCHEDULE.label}
            onClick={() => onServiceScheduleClick(item.id)}
          />
          <BasicActionButton
            role={PAGE_CONFIG.SERVICE_NOTIFICATION_GROUP.role}
            Icon={MegaphoneIcon}
            buttonText={PAGE_CONFIG.SERVICE_NOTIFICATION_GROUP.label}
            onClick={() => onServiceNotificationGroupClick(item.id)}
          />
          <ActionEditButton
            role={PAGE_CONFIG.UPDATE_SERVICE.role}
            onClick={() => onUpdateButtonClick(item.id)}
          />
          <ActionDeleteButton
            role={PAGE_CONFIG.DELETE_SERVICE.role}
            onClick={() => onDeleteButtonClick(item.id)}
          />
        </>
      ),
    }),
  ];

  const onResolveButtonClick = (item: any) => {
    showResolveDialog({
      ...configModalForm({
        label: PAGE_CONFIG.RESOLVE_SERVICE.label,
        fetchApi: service.resolve,
        refreshData: handleRefreshData,
        hideModal: hideResolveDialog,
        setToast,
        initForm: {
          id: item.id,
        },
      }),
      isFixedDate: item.periodKind == PERIOD_KIND_MAP.FIXED_DATE.value,
    });
  };

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_SERVICE.label,
        deleteApi: () => service.del(id),
        refreshData: () => handleDeleteItem(id),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    navigate(PAGE_CONFIG.CREATE_SERVICE.path, { state: { query } });
  };

  const onUpdateButtonClick = (id: any) => {
    navigate(`/service/update/${id}`, { state: { query } });
  };

  const onServiceNotificationGroupClick = (id: any) => {
    navigate(`/service/notification-group/${id}`, { state: { query } });
  };

  const onServiceScheduleClick = (id: any) => {
    navigate(`/service/schedule/${id}`, { state: { query } });
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: PAGE_CONFIG.SERVICE.label,
        },
      ]}
      activeItem={PAGE_CONFIG.SERVICE.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ResolveService
            isVisible={resolveDialogVisible}
            formConfig={resolveDialogConfig}
          />
          <ToolBar
            searchBoxes={
              <>
                <InputBox
                  value={query.name}
                  onChangeText={(value: any) =>
                    handleSubmitQuery({ ...query, name: value })
                  }
                  placeholder="Tên dịch vụ..."
                />
                <StaticSelectBox
                  value={query.kind}
                  onChange={(value: any) => {
                    handleSubmitQuery({ ...query, kind: value });
                  }}
                  dataMap={TRANSACTION_KIND_MAP}
                  placeholder="Loại..."
                />
                <StaticSelectBox
                  value={query.periodKind}
                  onChange={(value: any) => {
                    handleSubmitQuery({ ...query, periodKind: value });
                  }}
                  dataMap={PERIOD_KIND_MAP}
                  placeholder="Chu kỳ..."
                />
                <SelectBoxLazy
                  value={query.serviceGroupId}
                  onChange={(value: any) => {
                    handleSubmitQuery({
                      ...query,
                      serviceGroupId: value,
                    });
                  }}
                  fetchListApi={serviceGroup.autoComplete}
                  placeholder="Nhóm dịch vụ..."
                  decryptFields={DECRYPT_FIELDS.SERVICE_GROUP}
                />
                <DatePickerBox
                  value={query.fromDate}
                  onChange={(value: any) =>
                    handleSubmitQuery({
                      ...query,
                      fromDate: value,
                    })
                  }
                  placeholder="Từ ngày..."
                />
                <DatePickerBox
                  value={query.toDate}
                  onChange={(value: any) =>
                    handleSubmitQuery({
                      ...query,
                      toDate: value,
                    })
                  }
                  placeholder="Đến ngày..."
                />
                <SelectBoxLazy
                  value={query.tagId}
                  onChange={(value: any) => {
                    handleSubmitQuery({ ...query, tagId: value });
                  }}
                  fetchListApi={tag.autoComplete}
                  queryParams={{ kind: TAG_KIND.SERVICE }}
                  placeholder="Thẻ..."
                  colorCodeField="colorCode"
                  decryptFields={DECRYPT_FIELDS.TAG}
                />
              </>
            }
            onClear={() => handleSubmitQuery(initQuery)}
            onRefresh={handleRefreshData}
            actionButtons2={
              <div className="flex justify-end">
                <CreateButton
                  role={PAGE_CONFIG.CREATE_SERVICE.role}
                  onClick={onCreateButtonClick}
                />
              </div>
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
export default Service;
