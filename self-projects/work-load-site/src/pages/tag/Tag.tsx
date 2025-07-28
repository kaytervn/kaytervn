import { useGlobalContext } from "../../components/config/GlobalProvider";
import {
  basicRender,
  renderActionButton,
  renderColorCode,
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
  TAG_KIND_MAP,
} from "../../types/constant";
import { convertUtcToVn, getEnumItem } from "../../types/utils";
import CreateTag from "./CreateTag";
import UpdateTag from "./UpdateTag";

const initQuery = {
  name: "",
  kind: "",
  page: 0,
  size: ITEMS_PER_PAGE,
};

const Tag = () => {
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
  const { tag: apiList, loading: loadingList } = useApi();
  const { tag, loading } = useApi();
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
      label: "Tag name",
      accessor: "name",
      align: ALIGNMENT.LEFT,
      render: (item: any) => {
        const value: any = getEnumItem(TAG_KIND_MAP, item.kind);
        const content = item.name;
        return (
          <div className="flex flex-row space-x-2 items-center">
            <span
              className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap text-xs ${value.className}`}
            >
              {value.label}
            </span>
            <span className="text-gray-300 text-sm text-left whitespace-nowrap">
              {content}
            </span>
          </div>
        );
      },
    },
    renderColorCode({}),
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
      role: [PAGE_CONFIG.UPDATE_TAG.role, PAGE_CONFIG.DELETE_TAG.role],
      renderChildren: (item: any) => {
        return (
          <>
            <ActionEditButton
              role={PAGE_CONFIG.UPDATE_TAG.role}
              onClick={() => onUpdateButtonClick(item.id)}
            />
            <ActionDeleteButton
              role={PAGE_CONFIG.DELETE_TAG.role}
              onClick={() => onDeleteButtonClick(item.id)}
            />
          </>
        );
      },
    }),
  ];

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_TAG.label,
        deleteApi: () => tag.del(id),
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    showCreateForm(
      configModalForm({
        label: PAGE_CONFIG.CREATE_TAG.label,
        fetchApi: tag.create,
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideCreateForm,
        setToast,
        successMessage: BASIC_MESSAGES.CREATED,
        initForm: {
          name: "",
          kind: "",
          color: "#FFFFFF",
        },
      })
    );
  };

  const onUpdateButtonClick = (id: any) => {
    showUpdateForm(
      configModalForm({
        label: PAGE_CONFIG.UPDATE_TAG.label,
        fetchApi: tag.update,
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideUpdateForm,
        setToast,
        successMessage: BASIC_MESSAGES.UPDATED,
        initForm: {
          id,
          name: "",
          kind: "",
          color: "#FFFFFF",
        },
      })
    );
  };

  return (
    <Sidebar2
      breadcrumbs={[
        {
          label: PAGE_CONFIG.TAG.label,
        },
      ]}
      activeItem={PAGE_CONFIG.TAG.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ConfirmationDialog
            isVisible={deleteDialogVisible}
            formConfig={deleteDialogConfig}
          />
          <CreateTag
            isVisible={createFormVisible}
            formConfig={createFormConfig}
          />
          <UpdateTag
            isVisible={updateFormVisible}
            formConfig={updateFormConfig}
          />
          <ToolBar
            searchBoxes={
              <>
                <InputBox2
                  value={query.name}
                  onChangeText={(value: any) =>
                    setQuery({ ...query, name: value })
                  }
                  placeholder="Search..."
                />
                <StaticSelectBox
                  value={query.kind}
                  onChange={(value: any) => {
                    setQuery({ ...query, kind: value });
                  }}
                  dataMap={TAG_KIND_MAP}
                  placeholder="Kind..."
                />
              </>
            }
            onSearch={async () => await handleSubmitQuery(query)}
            onClear={async () => await handleSubmitQuery(initQuery)}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_TAG.role}
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
    />
  );
};
export default Tag;
