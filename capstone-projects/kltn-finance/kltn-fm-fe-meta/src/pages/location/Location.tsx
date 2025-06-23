import {
  ActionDeleteButton,
  ActionEditButton,
} from "../../components/form/Button";
import {
  configDeleteDialog,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/page/Dialog";
import { PAGE_CONFIG } from "../../components/PageConfig";
import useApi from "../../hooks/useApi";
import { useGridView } from "../../hooks/useGridView";
import useModal from "../../hooks/useModal";
import {
  ALIGNMENT,
  BUTTON_TEXT,
  ITEMS_PER_PAGE,
  STATUS_MAP,
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import { ActionButton, GridView } from "../../components/page/GridView";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useQueryState from "../../hooks/useQueryState";
import { useEffect, useState } from "react";
import InputBox from "../../components/page/InputBox";
import {
  basicRender,
  renderActionButton,
  renderEnum,
  renderImage,
} from "../../components/ItemRender";
import { DatabaseIcon, MousePointer2Icon, UserIcon } from "lucide-react";
import {
  extractDatabaseName,
  parseDate,
  truncateToDDMMYYYY,
} from "../../services/utils";
import { StaticSelectBox } from "../../components/page/SelectBox";
import { useGlobalContext } from "../../components/GlobalProvider";

const renderExpiredDateField = (item: any) => {
  const expiredDate = parseDate(item.expiredDate);
  if (!expiredDate) {
    return basicRender({ align: "left", content: "Chưa đặt" });
  }

  const daysLeft = Math.ceil(
    (expiredDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isExpired = daysLeft < 0;
  const isWarning = daysLeft >= 0 && daysLeft <= 7;

  return (
    <div className="flex items-center space-x-2 py-2">
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
          isExpired
            ? "bg-red-900/20 text-red-300"
            : isWarning
            ? "bg-yellow-900/20 text-yellow-300"
            : "bg-green-900/20 text-green-300"
        }`}
      >
        {truncateToDDMMYYYY(item.expiredDate)}
      </span>
      <span
        className={`text-xs whitespace-nowrap ${
          isExpired
            ? "text-red-400"
            : isWarning
            ? "text-yellow-400"
            : "text-green-400"
        }`}
      >
        {isExpired ? "Hết hạn" : `${daysLeft} ngày`}
      </span>
    </div>
  );
};

const renderNameField = (item: any) => {
  const { name, dbConfig } = item;
  return (
    <div className="flex items-center">
      {basicRender({
        align: ALIGNMENT.LEFT,
        content: name,
      })}
      {dbConfig && (
        <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-800/50 px-2 py-0.5 rounded-full">
          <DatabaseIcon size={12} />
          {extractDatabaseName(dbConfig.url)}
        </span>
      )}
    </div>
  );
};

const Location = () => {
  const { setToast } = useGlobalContext();
  const { customerId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const initQuery = {
    customerId,
    name: "",
    status: "",
    page: 0,
    size: ITEMS_PER_PAGE,
  };
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.CUSTOMER.path,
  });
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { location, loading } = useApi();
  const { location: locationList, loading: loadingList } = useApi();
  const { customer } = useApi();
  const {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  } = useGridView({
    fetchListApi: locationList.list,
    initQuery: state?.query ? { ...state.query, customerId } : initQuery,
  });
  const [customerData, setCustomerData] = useState<any>(null);
  useEffect(() => {
    if (!customerId) {
      handleNavigateBack();
      return;
    }

    const fetchData = async () => {
      const res = await customer.get(customerId);
      if (res.result) {
        const data = res.data;
        setCustomerData(data);
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [customerId]);

  const columns = [
    renderImage({
      label: "Logo",
      accessor: "logoPath",
      Icon: MousePointer2Icon,
    }),
    {
      label: "Tên khu vực",
      accessor: "name",
      align: ALIGNMENT.LEFT,
      render: (item: any) => renderNameField(item),
    },
    {
      label: "Mã thuê bao",
      accessor: "tenantId",
      align: ALIGNMENT.LEFT,
    },
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
      label: "Ngày hết hạn",
      accessor: "expiredDate",
      align: ALIGNMENT.LEFT,
      render: (item: any) => renderExpiredDateField(item),
    },
    renderEnum({}),
    renderActionButton({
      role: [
        PAGE_CONFIG.CREATE_DB_CONFIG.role,
        PAGE_CONFIG.UPDATE_DB_CONFIG.role,
        PAGE_CONFIG.UPDATE_LOCATION.role,
        PAGE_CONFIG.DELETE_LOCATION.role,
      ],
      renderChildren: (item: any) => (
        <>
          <ActionButton
            onClick={() => onDbConfigButtonClick(item)}
            Icon={DatabaseIcon}
            role={[
              PAGE_CONFIG.CREATE_DB_CONFIG.role,
              PAGE_CONFIG.UPDATE_DB_CONFIG.role,
            ]}
            title={BUTTON_TEXT.DB_CONFIG}
            color="goldenrod"
          />
          <ActionEditButton
            role={PAGE_CONFIG.UPDATE_LOCATION.role}
            onClick={() => onUpdateButtonClick(item.id)}
          />
          <ActionDeleteButton
            role={PAGE_CONFIG.DELETE_LOCATION.role}
            onClick={() => onDeleteButtonClick(item.id)}
          />
        </>
      ),
    }),
  ];

  const onDbConfigButtonClick = (item: any) => {
    if (item.dbConfig) {
      navigate(
        `/customer/location/${customerId}/db-config/${item.id}/update/${item.dbConfig.id}`,
        {
          state: { query },
        }
      );
    } else {
      navigate(`/customer/location/${customerId}/db-config/${item.id}/create`, {
        state: { query },
      });
    }
  };

  const onCreateButtonClick = () => {
    navigate(`/customer/location/${customerId}/create`, { state: { query } });
  };

  const onUpdateButtonClick = (id: any) => {
    navigate(`/customer/location/${customerId}/update/${id}`, {
      state: { query },
    });
  };

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_LOCATION.label,
        deleteApi: () => location.del(id),
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: `${customerData?.account?.fullName}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.LOCATION.label,
        },
      ]}
      activeItem={PAGE_CONFIG.CUSTOMER.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ToolBar
            searchBoxes={
              <>
                <InputBox
                  value={query.name}
                  onChangeText={(value: any) =>
                    setQuery({ ...query, name: value })
                  }
                  placeholder="Tên khu vực..."
                />
                <StaticSelectBox
                  value={query.status}
                  onChange={(value: any) => {
                    setQuery({ ...query, status: value });
                  }}
                  dataMap={STATUS_MAP}
                  placeholder="Trạng thái..."
                />
              </>
            }
            onSearch={async () => await handleSubmitQuery(query)}
            onClear={async () => await handleSubmitQuery(initQuery)}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_LOCATION.role}
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
export default Location;
