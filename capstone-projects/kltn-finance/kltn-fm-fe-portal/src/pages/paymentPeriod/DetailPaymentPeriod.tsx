import {
  ActionDeleteButton,
  ActionRejectButton,
} from "../../components/form/Button";
import {
  configDeleteDialog,
  configRejectDialog,
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
  TOAST,
  TRANSACTION_KIND_MAP,
  TRANSACTION_STATE_MAP,
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { ExportExcelButton, ToolBar } from "../../components/page/ToolBar";
import InputBox from "../../components/page/InputBox";
import { GridView } from "../../components/page/GridView";
import {
  basicRender,
  renderActionButton,
  renderEnum,
  renderIconField,
  renderMoneyField,
  renderTagField,
} from "../../components/config/ItemRender";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useGridViewLocal from "../../hooks/useGridViewLocal";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  SelectBoxLazy,
  StaticSelectBox,
} from "../../components/page/SelectBox";
import {
  decryptData,
  parseDate,
  truncateToDDMMYYYY,
} from "../../services/utils";
import DatePickerBox from "../../components/page/DatePickerBox";
import useQueryState from "../../hooks/useQueryState";

const initQuery = {
  transactionName: "",
  kind: "",
  fromDate: "",
  toDate: "",
  transactionGroupId: "",
  tagId: "",
};

const DetailPaymentPeriod = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.PAYMENT_PERIOD.path,
    requireSessionKey: true,
  });
  const navigate = useNavigate();
  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData.filter((item) => {
      const nameFilter =
        !query?.transactionName ||
        item.name.toLowerCase().includes(query.transactionName.toLowerCase());
      const kindFilter = !query?.kind || item.kind == query.kind;
      const transactionGroupIdFilter =
        !query?.transactionGroupId ||
        item?.transactionGroup?.id == query.transactionGroupId;
      const fromDate = parseDate(query?.fromDate);
      const toDate = parseDate(query?.toDate);
      const transactionDate = parseDate(item.transactionDate);
      const fromDateFilter =
        !fromDate || !transactionDate || fromDate >= transactionDate;
      const toDateFilter =
        !toDate || !transactionDate || toDate >= transactionDate;
      const tagIdFilter = !query?.tagId || item?.tag?.id == query.tagId;
      return (
        nameFilter &&
        tagIdFilter &&
        kindFilter &&
        transactionGroupIdFilter &&
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
  const { transaction: apiList, loading: loadingList } = useApi();
  const [totalStats, setTotalStats] = useState<any>({ income: 0, expense: 0 });
  const { transaction, loading } = useApi();
  const { transactionGroup, tag, paymentPeriod } = useApi();
  const {
    data,
    query,
    allData,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
    handleDeleteItem,
    handleRefreshData,
  } = useGridViewLocal({
    initQuery: state?.query || initQuery,
    filterData: customFilterData,
    decryptFields: DECRYPT_FIELDS.TRANSACTION,
    secretKey: sessionKey,
    fetchListApi: apiList.list,
    queryParams: { paymentPeriodId: id, sortDate: 4 },
    pageAccesor: "transactionPage",
  });
  const [periodData, setPeriodData] = useState<any>({});

  useEffect(() => {
    if (!id) {
      handleNavigateBack();
      return;
    }
    const fetchData = async () => {
      const res = await paymentPeriod.get(id);
      if (!res.result) {
        handleNavigateBack();
      }
      const data = decryptData(
        sessionKey,
        res.data,
        DECRYPT_FIELDS.PAYMENT_PERIOD
      );
      setPeriodData(data);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!allData || !Array.isArray(allData)) return;

    const stats = allData.reduce(
      (acc, item) => {
        if (item.kind == TRANSACTION_KIND_MAP.INCOME.value)
          acc.income += parseFloat(item.money) || 0;
        if (item.kind == TRANSACTION_KIND_MAP.EXPENSE.value)
          acc.expense += parseFloat(item.money) || 0;
        return acc;
      },
      { income: 0, expense: 0 }
    );

    setTotalStats(stats);
  }, [allData]);

  const columns = [
    {
      label: "Ngày giao dịch",
      accessor: "transactionDate",
      align: ALIGNMENT.LEFT,
      render: (item: any) => {
        return basicRender({
          align: ALIGNMENT.LEFT,
          content: truncateToDDMMYYYY(item.transactionDate),
        });
      },
    },
    renderIconField({
      label: "Tên giao dịch",
      accessor: "name",
      iconMapField: "kind",
      dataMap: TRANSACTION_KIND_MAP,
      role: PAGE_CONFIG.VIEW_TRANSACTION.role,
      onClick: (item: any) => onViewClick(item),
    }),
    renderMoneyField({
      label: "Số tiền",
      accessor: "money",
      align: ALIGNMENT.RIGHT,
    }),
    {
      label: "Danh mục",
      accessor: "category.name",
      align: ALIGNMENT.LEFT,
    },
    renderTagField({
      label: "Nhóm giao dịch",
      accessor: "transactionGroup.name",
      align: ALIGNMENT.LEFT,
      colorCodeField: "tag.colorCode",
    }),
    renderEnum({
      label: "Tình trạng",
      accessor: "state",
      dataMap: TRANSACTION_STATE_MAP,
    }),
    renderActionButton({
      role: [
        PAGE_CONFIG.DELETE_TRANSACTION.role,
        PAGE_CONFIG.REMOVE_TRANSACTION_FROM_PERIOD.role,
      ],
      renderChildren: (item: any) => (
        <>
          {item.state != TRANSACTION_STATE_MAP.PAID.value && (
            <>
              <ActionRejectButton
                role={PAGE_CONFIG.REMOVE_TRANSACTION_FROM_PERIOD.role}
                onClick={() => onRemoveButtonClick(item.id)}
              />
              <ActionDeleteButton
                role={PAGE_CONFIG.DELETE_TRANSACTION.role}
                onClick={() => onDeleteButtonClick(item.id)}
              />
            </>
          )}
        </>
      ),
    }),
  ];

  const onRemoveButtonClick = (id: any) => {
    showDeleteDialog(
      configRejectDialog({
        label: PAGE_CONFIG.REMOVE_TRANSACTION_FROM_PERIOD.label,
        fetchApi: () => transaction.removeFromPeriod(id),
        refreshData: handleRefreshData,
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_TRANSACTION.label,
        deleteApi: () => transaction.del(id),
        refreshData: () => handleDeleteItem(id),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onViewClick = (item: any) => {
    navigate(`/payment-period/view/${id}/detail-transaction/${item.id}`, {
      state: { query },
    });
  };

  const onExportExcelButtonClick = async () => {
    if (!data.length) {
      setToast(BASIC_MESSAGES.NO_DATA, TOAST.WARN);
      return;
    }
    const ids = data.map((item: any) => item.id);
    const res = await transaction.exportToExcel(ids, query.kind);
    if (res.result) {
      setToast(BASIC_MESSAGES.EXPORTED, TOAST.SUCCESS);
    } else {
      setToast(BASIC_MESSAGES.FAILED, TOAST.ERROR);
    }
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: `${periodData?.name}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.VIEW_PAYMENT_PERIOD.label,
        },
      ]}
      activeItem={PAGE_CONFIG.PAYMENT_PERIOD.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ConfirmationDialog
            isVisible={deleteDialogVisible}
            formConfig={deleteDialogConfig}
          />
          <ToolBar
            searchBoxes={
              <>
                <InputBox
                  value={query.transactionName}
                  onChangeText={(value: any) =>
                    handleSubmitQuery({ ...query, transactionName: value })
                  }
                  placeholder="Tên giao dịch..."
                />
                <StaticSelectBox
                  value={query.kind}
                  onChange={(value: any) => {
                    handleSubmitQuery({ ...query, kind: value });
                  }}
                  dataMap={TRANSACTION_KIND_MAP}
                  placeholder="Loại..."
                />
                <SelectBoxLazy
                  value={query.transactionGroupId}
                  onChange={(value: any) => {
                    handleSubmitQuery({
                      ...query,
                      transactionGroupId: value,
                    });
                  }}
                  fetchListApi={transactionGroup.autoComplete}
                  placeholder="Nhóm giao dịch..."
                  decryptFields={DECRYPT_FIELDS.TRANSACTION_GROUP}
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
                  queryParams={{ kind: TAG_KIND.TRANSACTION }}
                  placeholder="Thẻ..."
                  colorCodeField="colorCode"
                  decryptFields={DECRYPT_FIELDS.TAG}
                />
              </>
            }
            onClear={() => handleSubmitQuery(initQuery)}
            onRefresh={handleRefreshData}
            actionButtons2={
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 text-sm p-2 rounded-lg shadow-md">
                    <span className="font-semibold">Tổng thu:</span>
                    <span className="font-bold">
                      {totalStats.income.toLocaleString()} đ
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-red-100 text-red-700 text-sm p-2 rounded-lg shadow-md">
                    <span className="font-semibold">Tổng chi:</span>
                    <span className="font-bold">
                      {totalStats.expense.toLocaleString()} đ
                    </span>
                  </div>
                </div>
                <ExportExcelButton
                  role={PAGE_CONFIG.EXPORT_EXCEL_TRANSACTION.role}
                  onClick={onExportExcelButtonClick}
                />
              </div>
            }
          />
          <GridView
            isLoading={loadingList}
            data={data}
            columns={columns}
            currentPage={query["transactionPage"]}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </>
      }
    ></Sidebar>
  );
};
export default DetailPaymentPeriod;
