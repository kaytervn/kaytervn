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
import { ALIGNMENT, ITEMS_PER_PAGE } from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import InputBox from "../../components/page/InputBox";
import { GridView } from "../../components/page/GridView";
import { useLocation, useNavigate } from "react-router-dom";
import { renderActionButton } from "../../components/ItemRender";
import { useGlobalContext } from "../../components/GlobalProvider";

const renderTenantCountField = (item: any) => {
  const percentage = (item.currentTenantCount / item.maxTenant) * 100;
  const isWarning = percentage >= 80;
  const isFull = percentage >= 100;

  return (
    <div className="flex items-center space-x-3 py-2">
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
          isFull
            ? "bg-red-900/20 text-red-300"
            : isWarning
            ? "bg-yellow-900/20 text-yellow-300"
            : "bg-green-900/20 text-green-300"
        }`}
      >
        {`${item.currentTenantCount} / ${item.maxTenant}`}
      </span>

      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isFull ? "bg-red-500" : isWarning ? "bg-yellow-500" : "bg-green-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

const initQuery = {
  name: "",
  page: 0,
  size: ITEMS_PER_PAGE,
};

const ServerProvider = () => {
  const { setToast } = useGlobalContext();
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { serverProvider, loading } = useApi();
  const { serverProvider: providerList, loading: loadingList } = useApi();
  const {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  } = useGridView({
    fetchListApi: providerList.list,
    initQuery: state?.query || initQuery,
  });

  const columns = [
    {
      label: "Tên máy chủ",
      accessor: "name",
      align: ALIGNMENT.LEFT,
    },
    {
      label: "Đường dẫn",
      accessor: "url",
      align: ALIGNMENT.LEFT,
    },
    {
      label: "Số lượng kết nối",
      accessor: "tenant",
      align: ALIGNMENT.LEFT,
      render: (item: any) => renderTenantCountField(item),
    },
    renderActionButton({
      role: [
        PAGE_CONFIG.UPDATE_SERVER_PROVIDER.role,
        PAGE_CONFIG.DELETE_SERVER_PROVIDER.role,
      ],
      renderChildren: (item: any) => (
        <>
          <ActionEditButton
            role={PAGE_CONFIG.UPDATE_SERVER_PROVIDER.role}
            onClick={() => onUpdateButtonClick(item.id)}
          />
          <ActionDeleteButton
            role={PAGE_CONFIG.DELETE_SERVER_PROVIDER.role}
            onClick={() => onDeleteButtonClick(item.id)}
          />
        </>
      ),
    }),
  ];

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_SERVER_PROVIDER.label,
        deleteApi: () => serverProvider.del(id),
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    navigate(PAGE_CONFIG.CREATE_SERVER_PROVIDER.path, { state: { query } });
  };

  const onUpdateButtonClick = (id: any) => {
    navigate(`/server-provider/update/${id}`, { state: { query } });
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: PAGE_CONFIG.SERVER_PROVIDER.label,
        },
      ]}
      activeItem={PAGE_CONFIG.SERVER_PROVIDER.name}
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
                  placeholder="Tên máy chủ..."
                />
              </>
            }
            onSearch={async () => await handleSubmitQuery(query)}
            onClear={async () => await handleSubmitQuery(initQuery)}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_SERVER_PROVIDER.role}
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

export default ServerProvider;
