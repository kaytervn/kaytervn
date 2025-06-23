import {
  ActionDoneButton,
  BasicActionButton,
} from "../../components/form/Button";
import {
  configApproveDialog,
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
  PAYMENT_PERIOD_STATE_MAP,
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { ToolBar } from "../../components/page/ToolBar";
import InputBox from "../../components/page/InputBox";
import { GridView } from "../../components/page/GridView";
import {
  renderActionButton,
  renderIconField,
  renderMoneyField,
} from "../../components/config/ItemRender";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useGridViewLocal from "../../hooks/useGridViewLocal";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StaticSelectBox } from "../../components/page/SelectBox";
import { CalculatorIcon } from "lucide-react";

const initQuery = {
  name: "",
  state: "",
};

const PaymentPeriod = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData.filter((item) => {
      const nameFilter =
        !query?.name ||
        item.name.toLowerCase().includes(query.name.toLowerCase());
      const stateFilter = !query?.state || item.state == query.state;
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
  const { paymentPeriod: apiList, loading: loadingList } = useApi();
  const { paymentPeriod, loading } = useApi();
  const {
    data,
    query,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
    handleRefreshData,
  } = useGridViewLocal({
    initQuery: state?.query || initQuery,
    filterData: customFilterData,
    decryptFields: DECRYPT_FIELDS.PAYMENT_PERIOD,
    secretKey: sessionKey,
    fetchListApi: apiList.list,
  });

  const columns = [
    renderIconField({
      label: "Kỳ thanh toán",
      accessor: "name",
      iconMapField: "state",
      dataMap: PAYMENT_PERIOD_STATE_MAP,
      role: PAGE_CONFIG.VIEW_PAYMENT_PERIOD.role,
      onClick: (item: any) => onViewClick(item.id),
    }),
    renderMoneyField({
      label: "Tổng thu",
      accessor: "totalIncome",
      align: ALIGNMENT.RIGHT,
    }),
    renderMoneyField({
      label: "Tổng chi",
      accessor: "totalExpenditure",
      align: ALIGNMENT.RIGHT,
    }),
    renderActionButton({
      role: [
        PAGE_CONFIG.RECALCULATE_PAYMENT_PERIOD.role,
        PAGE_CONFIG.APPROVE_PAYMENT_PERIOD.role,
      ],
      renderChildren: (item: any) => (
        <>
          {item.state != PAYMENT_PERIOD_STATE_MAP.APPROVE.value && (
            <>
              <ActionDoneButton
                text={BUTTON_TEXT.APPROVE}
                role={PAGE_CONFIG.APPROVE_PAYMENT_PERIOD.role}
                onClick={() => onApproveButtonClick(item.id)}
              />
              <BasicActionButton
                buttonText={BUTTON_TEXT.RECALCULATE}
                Icon={CalculatorIcon}
                role={PAGE_CONFIG.RECALCULATE_PAYMENT_PERIOD.role}
                onClick={() => onRecalculateButtonClick(item.id)}
              />
            </>
          )}
        </>
      ),
    }),
  ];

  const onApproveButtonClick = (id: any) => {
    showDeleteDialog(
      configApproveDialog({
        label: PAGE_CONFIG.APPROVE_PAYMENT_PERIOD.label,
        fetchApi: () => paymentPeriod.approve(id),
        refreshData: handleRefreshData,
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onRecalculateButtonClick = (id: any) => {
    showDeleteDialog(
      configApproveDialog({
        label: PAGE_CONFIG.RECALCULATE_PAYMENT_PERIOD.label,
        fetchApi: () => paymentPeriod.recalculate(id),
        refreshData: handleRefreshData,
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onViewClick = (id: any) => {
    navigate(`/payment-period/view/${id}`, { state: { query } });
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: PAGE_CONFIG.PAYMENT_PERIOD.label,
        },
      ]}
      activeItem={PAGE_CONFIG.PAYMENT_PERIOD.name}
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
                  placeholder="Kỳ thanh toán..."
                />
                <StaticSelectBox
                  value={query.state}
                  onChange={(value: any) => {
                    handleSubmitQuery({ ...query, state: value });
                  }}
                  dataMap={PAYMENT_PERIOD_STATE_MAP}
                  placeholder="Tình trạng..."
                />
              </>
            }
            onClear={() => handleSubmitQuery(initQuery)}
            onRefresh={handleRefreshData}
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
export default PaymentPeriod;
