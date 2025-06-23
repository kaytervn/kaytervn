import { GridView } from "../../components/page/GridView";
import Sidebar from "../../components/page/Sidebar";
import useApi from "../../hooks/useApi";
import {
  basicRender,
  renderActionButton,
  renderEnum,
} from "../../components/ItemRender";
import { PAGE_CONFIG } from "../../components/PageConfig";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import InputBox from "../../components/page/InputBox";
import {
  ALIGNMENT,
  GROUP_KIND_MAP,
  ITEMS_PER_PAGE,
  TRUNCATE_LENGTH,
} from "../../services/constant";
import { useGridView } from "../../hooks/useGridView";
import {
  ActionDeleteButton,
  ActionEditButton,
} from "../../components/form/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { convertUtcToVn, truncateString } from "../../services/utils";
import { StaticSelectBox } from "../../components/page/SelectBox";
import useModal from "../../hooks/useModal";
import {
  configDeleteDialog,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/page/Dialog";
import { useGlobalContext } from "../../components/GlobalProvider";

const initQuery = { name: "", kind: "", page: 0, size: ITEMS_PER_PAGE };

const Role = () => {
  const { setToast } = useGlobalContext();
  const { showModal, hideModal, isModalVisible, formConfig } = useModal();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { role, loading } = useApi();
  const { role: roleForList, loading: loadingList } = useApi();
  const {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  } = useGridView({
    fetchListApi: roleForList.list,
    initQuery: state?.query || initQuery,
  });

  const columns = [
    { label: "Tên vai trò", accessor: "name", align: ALIGNMENT.LEFT },
    {
      label: "Mô tả",
      accessor: "description",
      align: ALIGNMENT.LEFT,
      render: (item: any) => {
        return basicRender({
          align: ALIGNMENT.LEFT,
          content: truncateString(item.description, TRUNCATE_LENGTH),
        });
      },
    },
    {
      label: "Lần cập nhật cuối",
      accessor: "modifiedDate",
      align: ALIGNMENT.LEFT,
      render: (item: any) => {
        return (
          <span
            className={`text-gray-300 p-4 text-${ALIGNMENT.LEFT} whitespace-nowrap`}
          >
            {convertUtcToVn(item.modifiedDate)}
          </span>
        );
      },
    },
    renderEnum({
      label: "Loại",
      accessor: "kind",
      align: ALIGNMENT.CENTER,
      dataMap: GROUP_KIND_MAP,
    }),
    renderActionButton({
      role: [PAGE_CONFIG.UPDATE_ROLE.role, PAGE_CONFIG.DELETE_ROLE.role],
      renderChildren: (item: any) => (
        <>
          <ActionEditButton
            role={PAGE_CONFIG.UPDATE_ROLE.role}
            onClick={() =>
              navigate(`/role/update/${item.id}`, { state: { query } })
            }
          />
          {item.kind == GROUP_KIND_MAP.ADMIN.value && (
            <ActionDeleteButton
              role={PAGE_CONFIG.DELETE_ROLE.role}
              onClick={() => onDeleteButtonClick(item.id)}
            />
          )}
        </>
      ),
    }),
  ];

  const onCreateButtonClick = () => {
    navigate(PAGE_CONFIG.CREATE_ROLE.path, { state: { query } });
  };

  const onDeleteButtonClick = (id: any) => {
    showModal(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_ROLE.label,
        deleteApi: () => role.del(id),
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
          label: PAGE_CONFIG.ROLE.label,
        },
      ]}
      activeItem={PAGE_CONFIG.ROLE.name}
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
                  placeholder="Tên vai trò..."
                />
                <StaticSelectBox
                  value={query.kind}
                  onChange={(value: any) => {
                    setQuery({ ...query, kind: value });
                  }}
                  dataMap={GROUP_KIND_MAP}
                  placeholder="Loại..."
                />
              </>
            }
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_ROLE.role}
                onClick={onCreateButtonClick}
              />
            }
            onSearch={async () => await handleSubmitQuery(query)}
            onClear={async () => await handleSubmitQuery(initQuery)}
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

export default Role;
