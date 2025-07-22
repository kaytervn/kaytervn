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

const initQuery = {
  keyword: "",
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
        const showDelete = item.totalAccounts == 0;
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
