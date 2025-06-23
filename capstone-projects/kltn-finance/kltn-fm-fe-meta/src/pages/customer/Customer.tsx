import {
  ActionDeleteButton,
  ActionEditButton,
  ActionResetMfaButton,
} from "../../components/form/Button";
import {
  configDeleteDialog,
  configResetMfaDialog,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/page/Dialog";
import { PAGE_CONFIG } from "../../components/PageConfig";
import useApi from "../../hooks/useApi";
import { useGridView } from "../../hooks/useGridView";
import useModal from "../../hooks/useModal";
import {
  ALIGNMENT,
  GROUP_KIND_MAP,
  ITEMS_PER_PAGE,
  STATUS_MAP,
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import { GridView } from "../../components/page/GridView";
import { useLocation, useNavigate } from "react-router-dom";
import { SelectBox, StaticSelectBox } from "../../components/page/SelectBox";
import {
  renderActionButton,
  renderEnum,
  renderHrefLink,
  renderImage,
  renderLastLogin,
} from "../../components/ItemRender";
import { useGlobalContext } from "../../components/GlobalProvider";

const initQuery = {
  accountId: "",
  branchId: "",
  status: "",
  page: 0,
  size: ITEMS_PER_PAGE,
};

const Customer = () => {
  const { setToast } = useGlobalContext();
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { customer, admin, loading } = useApi();
  const { customer: customerList, loading: loadingList } = useApi();
  const { admin: adminList, branch } = useApi();
  const {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  } = useGridView({
    fetchListApi: customerList.list,
    initQuery: state?.query || initQuery,
  });

  const columns = [
    renderImage({
      label: "Ảnh",
      accessor: "account.avatarPath",
    }),
    renderHrefLink({
      label: "Họ và tên",
      accessor: "account.fullName",
      align: ALIGNMENT.LEFT,
      role: PAGE_CONFIG.LOCATION.role,
      onClick: (item: any) => {
        navigate(`/customer/location/${item.id}`, { state: { query } });
      },
    }),
    { label: "Tài khoản", accessor: "account.username", align: ALIGNMENT.LEFT },
    {
      label: "Email",
      accessor: "account.email",
      align: ALIGNMENT.LEFT,
    },
    {
      label: "Chi nhánh",
      accessor: "branch.name",
      align: ALIGNMENT.LEFT,
    },
    renderLastLogin({
      accessor: "account.lastLogin",
    }),
    renderEnum({}),
    renderActionButton({
      role: [
        PAGE_CONFIG.RESET_MFA_ADMIN.role,
        PAGE_CONFIG.UPDATE_CUSTOMER.role,
        PAGE_CONFIG.DELETE_CUSTOMER.role,
      ],
      renderChildren: (item: any) => (
        <>
          <ActionResetMfaButton
            role={PAGE_CONFIG.RESET_MFA_ADMIN.role}
            onClick={() => onResetMfaButtonClick(item.account.id)}
          />
          <ActionEditButton
            role={PAGE_CONFIG.UPDATE_CUSTOMER.role}
            onClick={() => onUpdateButtonClick(item.id)}
          />
          <ActionDeleteButton
            role={PAGE_CONFIG.DELETE_CUSTOMER.role}
            onClick={() => onDeleteButtonClick(item.id)}
          />
        </>
      ),
    }),
  ];

  const onResetMfaButtonClick = (id: any) => {
    showDeleteDialog(
      configResetMfaDialog({
        label: PAGE_CONFIG.RESET_MFA_ADMIN.label,
        resetApi: () => admin.resetMfa(id),
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_CUSTOMER.label,
        deleteApi: () => customer.del(id),
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    navigate(PAGE_CONFIG.CREATE_CUSTOMER.path, { state: { query } });
  };

  const onUpdateButtonClick = (id: any) => {
    navigate(`/customer/update/${id}`, { state: { query } });
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: PAGE_CONFIG.CUSTOMER.label,
        },
      ]}
      activeItem={PAGE_CONFIG.CUSTOMER.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ToolBar
            searchBoxes={
              <>
                <SelectBox
                  value={query.accountId}
                  onChange={(value: any) => {
                    setQuery({ ...query, accountId: value });
                  }}
                  queryParams={{
                    kind: GROUP_KIND_MAP.CUSTOMER.value,
                  }}
                  fetchListApi={adminList.autoComplete}
                  placeholder="Họ và tên..."
                  labelKey="fullName"
                />
                <SelectBox
                  value={query.branchId}
                  onChange={(value: any) => {
                    setQuery({ ...query, branchId: value });
                  }}
                  fetchListApi={branch.autoComplete}
                  placeholder="Chi nhánh..."
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
                role={PAGE_CONFIG.CREATE_CUSTOMER.role}
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

export default Customer;
