import { GridView } from "../../components/page/GridView";
import Sidebar from "../../components/page/Sidebar";
import useApi from "../../hooks/useApi";
import {
  basicRender,
  renderActionButton,
  renderEnum,
  renderHrefLink,
  renderImage,
  renderLastLogin,
} from "../../components/ItemRender";
import { PAGE_CONFIG } from "../../components/PageConfig";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import InputBox from "../../components/page/InputBox";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ALIGNMENT,
  GROUP_KIND_MAP,
  ITEMS_PER_PAGE,
  STATUS_MAP,
} from "../../services/constant";
import { useGridView } from "../../hooks/useGridView";
import {
  configDeleteDialog,
  configResetMfaDialog,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/page/Dialog";
import useModal from "../../hooks/useModal";
import { useGlobalContext } from "../../components/GlobalProvider";
import { SelectBox, StaticSelectBox } from "../../components/page/SelectBox";
import {
  ActionDeleteButton,
  ActionEditButton,
  ActionResetMfaButton,
} from "../../components/form/Button";

const initQuery = {
  fullName: "",
  groupId: "",
  status: "",
  kind: GROUP_KIND_MAP.ADMIN.value,
  page: 0,
  size: ITEMS_PER_PAGE,
};

const Admin = () => {
  const { state } = useLocation();
  const { profile, setToast } = useGlobalContext();
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();
  const navigate = useNavigate();
  const { admin, loading } = useApi();
  const { admin: adminList, loading: loadingList } = useApi();
  const { role } = useApi();
  const {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  } = useGridView({
    fetchListApi: adminList.list,
    initQuery: state?.query || initQuery,
  });

  const columns = [
    renderImage({}),
    renderHrefLink({
      label: "Họ và tên",
      accessor: "fullName",
      align: ALIGNMENT.LEFT,
      role: PAGE_CONFIG.ACCOUNT_BRANCH.role,
      onClick: (item: any) => {
        navigate(`/admin/account-branch/${item.id}`, { state: { query } });
      },
    }),
    { label: "Tài khoản", accessor: "username", align: ALIGNMENT.LEFT },
    {
      label: "Email",
      accessor: "email",
      align: ALIGNMENT.LEFT,
    },
    {
      label: "Vai trò",
      accessor: "group.name",
      align: ALIGNMENT.LEFT,
    },
    renderLastLogin({}),
    renderEnum({}),
    renderActionButton({
      role: [
        PAGE_CONFIG.RESET_MFA_ADMIN.role,
        PAGE_CONFIG.UPDATE_ADMIN.role,
        PAGE_CONFIG.DELETE_ADMIN.role,
      ],
      renderChildren: (item: any) => (
        <>
          <ActionResetMfaButton
            role={PAGE_CONFIG.RESET_MFA_ADMIN.role}
            onClick={() => onResetMfaButtonClick(item.id)}
          />
          <ActionEditButton
            role={PAGE_CONFIG.UPDATE_ADMIN.role}
            onClick={() =>
              navigate(`/admin/update/${item.id}`, { state: { query } })
            }
          />
          {!item.isSuperAdmin && item.id !== profile.id && (
            <ActionDeleteButton
              role={PAGE_CONFIG.DELETE_ADMIN.role}
              onClick={() => onDeleteButtonClick(item.id)}
            />
          )}
        </>
      ),
    }),
  ];

  const onResetMfaButtonClick = (id: any) => {
    showModal(
      configResetMfaDialog({
        label: PAGE_CONFIG.RESET_MFA_ADMIN.label,
        resetApi: () => admin.resetMfa(id),
        refreshData: () => handleSubmitQuery(query),
        hideModal,
        setToast,
      })
    );
  };

  const onDeleteButtonClick = (id: any) => {
    showModal(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_ADMIN.label,
        deleteApi: () => admin.del(id),
        refreshData: () => handleSubmitQuery(query),
        hideModal,
        setToast,
      })
    );
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: PAGE_CONFIG.ADMIN.label,
        },
      ]}
      activeItem={PAGE_CONFIG.ADMIN.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ToolBar
            searchBoxes={
              <>
                <InputBox
                  value={query.fullName}
                  onChangeText={(value: any) =>
                    setQuery({ ...query, fullName: value })
                  }
                  placeholder="Họ và tên..."
                />
                <SelectBox
                  value={query.groupId}
                  onChange={(value: any) => {
                    setQuery({ ...query, groupId: value });
                  }}
                  queryParams={{
                    kind: GROUP_KIND_MAP.ADMIN.value,
                  }}
                  fetchListApi={role.list}
                  placeholder="Vai trò..."
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
                role={PAGE_CONFIG.CREATE_ADMIN.role}
                onClick={() =>
                  navigate(PAGE_CONFIG.CREATE_ADMIN.path, { state: { query } })
                }
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
            isVisible={isModalVisible}
            formConfig={formConfig}
          />
        </>
      }
    ></Sidebar>
  );
};

export default Admin;
