import { useGlobalContext } from "../../components/config/GlobalProvider";
import {
  basicRender,
  renderActionButton,
  renderHrefLink,
} from "../../components/config/ItemRender";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import {
  ActionDeleteButton,
  ActionEditButton,
} from "../../components/form/Button";
import {
  configDeleteDialog,
  configModalForm,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/form/Dialog";
import { InputBox2 } from "../../components/form/InputTextField";
import { StaticSelectBox } from "../../components/form/SelectTextField";
import { GridView } from "../../components/main/GridView";
import Sidebar2 from "../../components/main/Sidebar2";
import { CreateButton, ToolBar } from "../../components/main/ToolBar";
import useApi from "../../hooks/useApi";
import { useGridView } from "../../hooks/useGridView";
import useModal from "../../hooks/useModal";
import {
  ALIGNMENT,
  BASIC_MESSAGES,
  ITEMS_PER_PAGE,
  SORT_PLATFORM_MAP,
} from "../../types/constant";
import { convertUtcToVn } from "../../types/utils";
import CreatePlatform from "./CreatePlatform";
import UpdatePlatform from "./UpdatePlatform";

const initQuery = {
  keyword: "",
  sortOption: "",
  page: 0,
  size: ITEMS_PER_PAGE,
};

const Platform = () => {
  const { setToast } = useGlobalContext();
  const {
    isModalVisible: createFormVisible,
    showModal: showCreateForm,
    hideModal: hideCreateForm,
    formConfig: createFormConfig,
  } = useModal();
  const {
    isModalVisible: updateFormVisible,
    showModal: showUpdateForm,
    hideModal: hideUpdateForm,
    formConfig: updateFormConfig,
  } = useModal();
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { platform: apiList, loading: loadingList } = useApi();
  const { platform, loading } = useApi();
  const {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  } = useGridView({
    fetchListApi: apiList.list,
    initQuery,
  });

  const columns = [
    {
      label: "Name",
      accessor: "name",
      align: ALIGNMENT.LEFT,
    },
    renderHrefLink({
      label: "URL",
      accessor: "url",
      align: ALIGNMENT.LEFT,
      onClick: (item: any) => {
        window.open(item.url, "_blank");
      },
    }),
    {
      label: "Total accounts",
      accessor: "totalAccounts",
      align: ALIGNMENT.RIGHT,
    },
    {
      label: "Created date",
      accessor: "createdDate",
      align: ALIGNMENT.CENTER,
      render: (item: any) => {
        return basicRender({
          align: ALIGNMENT.CENTER,
          content: convertUtcToVn(item.createdDate),
        });
      },
    },
    renderActionButton({
      role: [
        PAGE_CONFIG.UPDATE_PLATFORM.role,
        PAGE_CONFIG.DELETE_PLATFORM.role,
      ],
      renderChildren: (item: any) => {
        const showDelete = item.totalAccounts == 0;
        return (
          <>
            <ActionEditButton
              role={PAGE_CONFIG.UPDATE_PLATFORM.role}
              onClick={() => onUpdateButtonClick(item.id)}
            />
            {showDelete && (
              <ActionDeleteButton
                role={PAGE_CONFIG.DELETE_PLATFORM.role}
                onClick={() => onDeleteButtonClick(item.id)}
              />
            )}
          </>
        );
      },
    }),
  ];

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_PLATFORM.label,
        deleteApi: () => platform.del(id),
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    showCreateForm(
      configModalForm({
        label: PAGE_CONFIG.CREATE_PLATFORM.label,
        fetchApi: platform.create,
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideCreateForm,
        setToast,
        successMessage: BASIC_MESSAGES.CREATED,
        initForm: {
          name: "",
          url: "",
        },
      })
    );
  };

  const onUpdateButtonClick = (id: any) => {
    showUpdateForm(
      configModalForm({
        label: PAGE_CONFIG.UPDATE_PLATFORM.label,
        fetchApi: platform.update,
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideUpdateForm,
        setToast,
        successMessage: BASIC_MESSAGES.UPDATED,
        initForm: {
          id,
          name: "",
          url: "",
        },
      })
    );
  };

  return (
    <Sidebar2
      breadcrumbs={[
        {
          label: PAGE_CONFIG.PLATFORM.label,
        },
      ]}
      activeItem={PAGE_CONFIG.PLATFORM.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ConfirmationDialog
            isVisible={deleteDialogVisible}
            formConfig={deleteDialogConfig}
          />
          <CreatePlatform
            isVisible={createFormVisible}
            formConfig={createFormConfig}
          />
          <UpdatePlatform
            isVisible={updateFormVisible}
            formConfig={updateFormConfig}
          />
          <ToolBar
            searchBoxes={
              <>
                <InputBox2
                  value={query.keyword}
                  onChangeText={(value: any) =>
                    setQuery({ ...query, keyword: value })
                  }
                  placeholder="Search..."
                />
                <StaticSelectBox
                  value={query.sortOption}
                  onChange={(value: any) => {
                    setQuery({ ...query, sortOption: value });
                  }}
                  dataMap={SORT_PLATFORM_MAP}
                  placeholder="Sort..."
                />
              </>
            }
            onSearch={async () => await handleSubmitQuery(query)}
            onClear={async () => await handleSubmitQuery(initQuery)}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_PLATFORM.role}
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
        </>
      }
    ></Sidebar2>
  );
};
export default Platform;
