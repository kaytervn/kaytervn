import { useLocation, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useModal from "../../hooks/useModal";
import { ALIGNMENT, ITEMS_PER_PAGE } from "../../types/constant";
import useApi from "../../hooks/useApi";
import { useGridView } from "../../hooks/useGridView";
import {
  basicRender,
  renderActionButton,
} from "../../components/config/ItemRender";
import { convertUtcToVn } from "../../types/utils";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import {
  ActionDeleteButton,
  ActionEditButton,
} from "../../components/form/Button";
import {
  configDeleteDialog,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/form/Dialog";
import { CreateButton, ToolBar } from "../../components/main/ToolBar";
import { InputBox2 } from "../../components/form/InputTextField";
import { GridView } from "../../components/main/GridView";
import Sidebar2 from "../../components/main/Sidebar2";

const initQuery = { name: "", page: 0, size: ITEMS_PER_PAGE };

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
    { label: "Name", accessor: "name", align: ALIGNMENT.LEFT },
    {
      label: "Last modified",
      accessor: "modifiedDate",
      align: ALIGNMENT.CENTER,
      render: (item: any) => {
        return basicRender({
          align: ALIGNMENT.CENTER,
          content: convertUtcToVn(item.modifiedDate),
        });
      },
    },
    renderActionButton({
      role: [PAGE_CONFIG.UPDATE_ROLE.role, PAGE_CONFIG.DELETE_ROLE.role],
      renderChildren: (item: any) => {
        const showEdit = !item.isSystem;
        const showDelete = !item.isSystem;
        return (
          <>
            {showEdit && (
              <ActionEditButton
                role={PAGE_CONFIG.UPDATE_ROLE.role}
                onClick={() =>
                  navigate(`/role/update/${item.id}`, { state: { query } })
                }
              />
            )}
            {showDelete && (
              <ActionDeleteButton
                role={PAGE_CONFIG.DELETE_ROLE.role}
                onClick={() => onDeleteButtonClick(item.id)}
              />
            )}
          </>
        );
      },
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
    <Sidebar2
      breadcrumbs={[
        {
          label: PAGE_CONFIG.ROLE.label,
        },
      ]}
      activeItem={PAGE_CONFIG.ROLE.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ConfirmationDialog
            isVisible={isModalVisible}
            formConfig={formConfig}
          />
          <ToolBar
            searchBoxes={
              <>
                <InputBox2
                  value={query.name}
                  onChangeText={(value: any) =>
                    setQuery({ ...query, name: value })
                  }
                  placeholder="Name..."
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
        </>
      }
    />
  );
};

export default Role;
