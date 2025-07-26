/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../../components/config/GlobalProvider";
import {
  basicRender,
  renderActionButton,
} from "../../../components/config/ItemRender";
import { PAGE_CONFIG } from "../../../components/config/PageConfig";
import {
  ActionDeleteButton,
  ActionEditButton,
} from "../../../components/form/Button";
import {
  configDeleteDialog,
  configModalForm,
  ConfirmationDialog,
  LoadingDialog,
} from "../../../components/form/Dialog";
import { GridView } from "../../../components/main/GridView";
import { CreateButton, ToolBar } from "../../../components/main/ToolBar";
import useApi from "../../../hooks/useApi";
import { useGridView } from "../../../hooks/useGridView";
import useModal from "../../../hooks/useModal";
import {
  ACCOUNT_KIND_MAP,
  ALIGNMENT,
  BASIC_MESSAGES,
  ITEMS_PER_PAGE,
} from "../../../types/constant";
import { convertUtcToVn } from "../../../types/utils";
import { useEffect, useState } from "react";
import useQueryState from "../../../hooks/useQueryState";
import Sidebar2 from "../../../components/main/Sidebar2";
import { InputBox2 } from "../../../components/form/InputTextField";
import CreateLinkAccount from "./CreateLinkAccount";
import UpdateLinkAccount from "./UpdateLinkAccount";
import { SelectBox2 } from "../../../components/form/SelectTextField";

const initQuery = {
  keyword: "",
  tagId: "",
  page: 0,
  size: ITEMS_PER_PAGE,
};

const LinkAccount = () => {
  const { parentId } = useParams();
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
  const { account: apiList, loading: loadingList } = useApi();
  const [fetchData, setFetchData] = useState<any>(null);
  const { account, loading } = useApi();
  const { tag } = useApi();
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
    queryParams: { parentId },
  });

  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.ACCOUNT.path,
    requireSessionKey: true,
  });

  useEffect(() => {
    if (!parentId) {
      handleNavigateBack();
      return;
    }
    const fetchData = async () => {
      const res = await account.get(parentId);
      if (res.result) {
        const data = res.data;
        setFetchData(data);
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [parentId]);

  const columns = [
    {
      label: "Platform",
      accessor: "platform.name",
      align: ALIGNMENT.LEFT,
      render: (item: any) => {
        const content = item.platform.name;
        const colorCode = item.tag?.color;
        const url = item.platform.url;
        if (!url) {
          return (
            <span
              className={`text-gray-300 text-sm text-left whitespace-nowrap flex flex-row space-x-2`}
            >
              {content}
              {colorCode && (
                <span
                  title={item.tag.name}
                  className="inline-block w-4 h-4 rounded"
                  style={{ backgroundColor: colorCode }}
                />
              )}
            </span>
          );
        }
        return (
          <div className="flex flex-row space-x-2 items-center">
            <a
              className={`text-blue-600 hover:underline text-sm text-left whitespace-nowrap hover:cursor-pointer`}
              title={url}
              onClick={() => window.open(url, "_blank")}
            >
              {content}
            </a>
            {colorCode && (
              <span
                title={item.tag.name}
                className="inline-block w-4 h-4 rounded"
                style={{ backgroundColor: colorCode }}
              />
            )}
          </div>
        );
      },
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
        PAGE_CONFIG.UPDATE_LINK_ACCOUNT.role,
        PAGE_CONFIG.DELETE_LINK_ACCOUNT.role,
      ],
      renderChildren: (item: any) => {
        const showDelete = item.totalChildren == 0;
        return (
          <>
            <ActionEditButton
              role={PAGE_CONFIG.UPDATE_LINK_ACCOUNT.role}
              onClick={() => onUpdateButtonClick(item.id)}
            />
            {showDelete && (
              <ActionDeleteButton
                role={PAGE_CONFIG.DELETE_LINK_ACCOUNT.role}
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
        label: PAGE_CONFIG.DELETE_LINK_ACCOUNT.label,
        deleteApi: () => account.del(id),
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    showCreateForm(
      configModalForm({
        label: PAGE_CONFIG.CREATE_LINK_ACCOUNT.label,
        fetchApi: account.create,
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideCreateForm,
        setToast,
        successMessage: BASIC_MESSAGES.CREATED,
        initForm: {
          parentId,
          platformId: "",
          note: "",
          kind: ACCOUNT_KIND_MAP.LINKED.value,
        },
      })
    );
  };

  const onUpdateButtonClick = (id: any) => {
    showUpdateForm(
      configModalForm({
        label: PAGE_CONFIG.UPDATE_LINK_ACCOUNT.label,
        fetchApi: account.update,
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideUpdateForm,
        setToast,
        successMessage: BASIC_MESSAGES.UPDATED,
        initForm: {
          id,
          platformId: "",
          note: "",
        },
      })
    );
  };

  return (
    <Sidebar2
      breadcrumbs={[
        {
          label: `(${fetchData?.platform?.name}) ${
            fetchData?.parent?.username || fetchData?.username
          }`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.LINK_ACCOUNT.label,
        },
      ]}
      activeItem={PAGE_CONFIG.ACCOUNT.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ConfirmationDialog
            isVisible={deleteDialogVisible}
            formConfig={deleteDialogConfig}
          />
          <CreateLinkAccount
            isVisible={createFormVisible}
            formConfig={createFormConfig}
          />
          <UpdateLinkAccount
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
                <SelectBox2
                  value={query.tagId}
                  onChange={(value: any) => {
                    setQuery({ ...query, tagId: value });
                  }}
                  fetchListApi={tag.autoComplete}
                  placeholder="Tag..."
                  colorCodeField="color"
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
    />
  );
};
export default LinkAccount;
