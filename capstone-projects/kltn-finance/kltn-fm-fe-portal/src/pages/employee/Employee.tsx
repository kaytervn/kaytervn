import { GridView } from "../../components/page/GridView";
import Sidebar from "../../components/page/Sidebar";
import useApi from "../../hooks/useApi";
import {
  renderActionButton,
  renderEnum,
  renderImage,
  renderLastLogin,
} from "../../components/config/ItemRender";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import InputBox from "../../components/page/InputBox";
import { useLocation, useNavigate } from "react-router-dom";
import { ALIGNMENT, ITEMS_PER_PAGE, STATUS_MAP } from "../../services/constant";
import { useGridView } from "../../hooks/useGridView";
import {
  configDeleteDialog,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/page/Dialog";
import useModal from "../../hooks/useModal";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { SelectBox, StaticSelectBox } from "../../components/page/SelectBox";
import {
  ActionDeleteButton,
  ActionEditButton,
} from "../../components/form/Button";

const initQuery = {
  fullName: "",
  groupId: "",
  departmentId: "",
  status: "",
  page: 0,
  size: ITEMS_PER_PAGE,
};

const Employee = () => {
  const { state } = useLocation();
  const { profile, setToast } = useGlobalContext();
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();
  const navigate = useNavigate();
  const { employee, loading } = useApi();
  const { employee: apiList, loading: loadingList } = useApi();
  const { role, department } = useApi();
  const {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  } = useGridView({
    fetchListApi: apiList.list,
    initQuery: state?.query || initQuery,
  });

  const columns = [
    renderImage({}),
    {
      label: "Họ và tên",
      accessor: "fullName",
      align: ALIGNMENT.LEFT,
    },
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
    {
      label: "Phòng ban",
      accessor: "department.name",
      align: ALIGNMENT.LEFT,
    },
    renderLastLogin({}),
    renderEnum({}),
    renderActionButton({
      role: [
        PAGE_CONFIG.UPDATE_EMPLOYEE.role,
        PAGE_CONFIG.DELETE_EMPLOYEE.role,
      ],
      renderChildren: (item: any) => (
        <>
          <ActionEditButton
            role={PAGE_CONFIG.UPDATE_EMPLOYEE.role}
            onClick={() =>
              navigate(`/employee/update/${item.id}`, { state: { query } })
            }
          />
          {item.id !== profile.id && (
            <ActionDeleteButton
              role={PAGE_CONFIG.DELETE_EMPLOYEE.role}
              onClick={() => onDeleteButtonClick(item.id)}
            />
          )}
        </>
      ),
    }),
  ];

  const onDeleteButtonClick = (id: any) => {
    showModal(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_EMPLOYEE.label,
        deleteApi: () => employee.del(id),
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
          label: PAGE_CONFIG.EMPLOYEE.label,
        },
      ]}
      activeItem={PAGE_CONFIG.EMPLOYEE.name}
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
                  fetchListApi={role.list}
                  placeholder="Vai trò..."
                />
                <SelectBox
                  value={query.departmentId}
                  onChange={(value: any) => {
                    setQuery({ ...query, departmentId: value });
                  }}
                  fetchListApi={department.autoComplete}
                  placeholder="Phòng ban..."
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
                role={PAGE_CONFIG.CREATE_EMPLOYEE.role}
                onClick={() =>
                  navigate(PAGE_CONFIG.CREATE_EMPLOYEE.path, {
                    state: { query },
                  })
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

export default Employee;
