import { ActionDeleteButton } from "../../components/form/Button";
import {
  configDeleteDialog,
  configModalForm,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/page/Dialog";
import { PAGE_CONFIG } from "../../components/PageConfig";
import useApi from "../../hooks/useApi";
import { useGridView } from "../../hooks/useGridView";
import useModal from "../../hooks/useModal";
import {
  ALIGNMENT,
  BASIC_MESSAGES,
  ITEMS_PER_PAGE,
  TRUNCATE_LENGTH,
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import { GridView } from "../../components/page/GridView";
import { useParams } from "react-router-dom";
import useQueryState from "../../hooks/useQueryState";
import { SelectBox } from "../../components/page/SelectBox";
import CreateAccountBranch from "./CreateAccountBranch";
import { useEffect, useState } from "react";
import { basicRender, renderActionButton } from "../../components/ItemRender";
import { truncateString } from "../../services/utils";
import { useGlobalContext } from "../../components/GlobalProvider";

const AccountBranch = () => {
  const { setToast } = useGlobalContext();
  const { adminId } = useParams();
  const initQuery = {
    accountId: adminId,
    branchId: "",
    page: 0,
    size: ITEMS_PER_PAGE,
  };
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.ADMIN.path,
  });
  const {
    isModalVisible: createFormVisible,
    showModal: showCreateForm,
    hideModal: hideCreateForm,
    formConfig: createFormConfig,
  } = useModal();
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { accountBranch: accountBranchList, loading: loadingList } = useApi();
  const { branch, admin } = useApi();
  const { accountBranch, loading } = useApi();
  const {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  } = useGridView({
    fetchListApi: accountBranchList.list,
    initQuery,
  });
  const [account, setAccount] = useState<any>(null);

  useEffect(() => {
    if (!adminId) {
      handleNavigateBack();
      return;
    }

    const fetchData = async () => {
      const res = await admin.get(adminId);
      if (res.result) {
        const data = res.data;
        setAccount(data);
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [adminId]);

  const columns = [
    {
      label: "Tên chi nhánh",
      accessor: "branch.name",
      align: ALIGNMENT.LEFT,
    },
    {
      label: "Mô tả",
      align: ALIGNMENT.LEFT,
      render: (item: any) => {
        return basicRender({
          align: ALIGNMENT.LEFT,
          content: truncateString(item?.branch?.description, TRUNCATE_LENGTH),
        });
      },
    },
    renderActionButton({
      role: [PAGE_CONFIG.DELETE_ACCOUNT_BRANCH.role],
      renderChildren: (item: any) => (
        <>
          <ActionDeleteButton
            role={PAGE_CONFIG.DELETE_ACCOUNT_BRANCH.role}
            onClick={() => onDeleteButtonClick(item.id)}
          />
        </>
      ),
    }),
  ];

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_ACCOUNT_BRANCH.label,
        deleteApi: () => accountBranch.del(id),
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    showCreateForm(
      configModalForm({
        label: PAGE_CONFIG.CREATE_ACCOUNT_BRANCH.label,
        fetchApi: accountBranch.create,
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideCreateForm,
        setToast,
        successMessage: BASIC_MESSAGES.CREATED,
        initForm: {
          accountId: adminId,
          branchId: "",
        },
      })
    );
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: `${account?.fullName}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.ACCOUNT_BRANCH.label,
        },
      ]}
      activeItem={PAGE_CONFIG.ADMIN.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ToolBar
            searchBoxes={
              <>
                <SelectBox
                  value={query.branchId}
                  onChange={(value: any) => {
                    setQuery({ ...query, branchId: value });
                  }}
                  queryParams={{
                    permissionAccountId: adminId,
                  }}
                  fetchListApi={branch.autoComplete}
                  placeholder="Chi nhánh..."
                />
              </>
            }
            onSearch={async () => await handleSubmitQuery(query)}
            onClear={async () => await handleSubmitQuery(initQuery)}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_ACCOUNT_BRANCH.role}
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
          <CreateAccountBranch
            isVisible={createFormVisible}
            formConfig={createFormConfig}
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
export default AccountBranch;
