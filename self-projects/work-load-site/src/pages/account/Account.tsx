import { useLocation, useNavigate } from "react-router-dom";
import { GridView } from "../../components/main/GridView";
import {
  ACCOUNT_KIND_MAP,
  ALIGNMENT,
  BUTTON_TEXT,
  ITEMS_PER_PAGE,
  SORT_ACCOUNT_MAP,
} from "../../types/constant";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useModal from "../../hooks/useModal";
import useApi from "../../hooks/useApi";
import { useGridView } from "../../hooks/useGridView";
import {
  basicRender,
  renderActionButton,
  renderEnum,
} from "../../components/config/ItemRender";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import {
  ActionDeleteButton,
  ActionEditButton,
  BasicActionButton,
} from "../../components/form/Button";
import { HistoryIcon, LinkIcon } from "lucide-react";
import {
  configDeleteDialog,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/form/Dialog";
import Sidebar2 from "../../components/main/Sidebar2";
import { CreateButton, ToolBar } from "../../components/main/ToolBar";
import { InputBox2 } from "../../components/form/InputTextField";
import { StaticSelectBox } from "../../components/form/SelectTextField";
import { convertUtcToVn } from "../../types/utils";

const initQuery = {
  keyword: "",
  kind: "",
  sortOption: "",
  page: 0,
  size: ITEMS_PER_PAGE,
};

const Account = () => {
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();
  const { state } = useLocation();
  const { setToast } = useGlobalContext();
  const navigate = useNavigate();
  const { account, loading } = useApi();
  const { account: apiList, loading: loadingList } = useApi();
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
    {
      label: "Platform",
      accessor: "platform.name",
      align: ALIGNMENT.LEFT,
    },
    {
      label: "Username",
      accessor: "username",
      align: ALIGNMENT.LEFT,
      render: (item: any) => {
        return basicRender({
          content:
            item.kind == ACCOUNT_KIND_MAP.LINKED.value
              ? `(${item.parent?.platform?.name}) ${item.parent?.username}`
              : item.username,
        });
      },
    },
    renderEnum({
      label: "Kind",
      accessor: "kind",
      dataMap: ACCOUNT_KIND_MAP,
    }),
    {
      label: "Link accounts",
      accessor: "totalChildren",
      align: ALIGNMENT.RIGHT,
    },
    {
      label: "Backup codes",
      accessor: "totalBackupCodes",
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
      role: [PAGE_CONFIG.UPDATE_ACCOUNT.role, PAGE_CONFIG.DELETE_ACCOUNT.role],
      renderChildren: (item: any) => {
        const showDelete = item.totalChildren == 0;
        return (
          <>
            <BasicActionButton
              onClick={() => onLinkAccountButtonClick(item.id)}
              Icon={LinkIcon}
              role={PAGE_CONFIG.LINK_ACCOUNT.role}
              buttonText={BUTTON_TEXT.LINKED_ACCOUNTS}
            />
            <BasicActionButton
              onClick={() => onBackupCodesButtonClick(item.id)}
              Icon={HistoryIcon}
              role={PAGE_CONFIG.BACKUP_CODE.role}
              buttonText={BUTTON_TEXT.BACKUP_CODE}
            />
            <ActionEditButton
              role={PAGE_CONFIG.UPDATE_ACCOUNT.role}
              onClick={() => onUpdateButtonClick(item.id)}
            />
            {showDelete && (
              <ActionDeleteButton
                role={PAGE_CONFIG.DELETE_ACCOUNT.role}
                onClick={() => onDeleteButtonClick(item.id)}
              />
            )}
          </>
        );
      },
    }),
  ];

  const onDeleteButtonClick = (id: any) => {
    showModal(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_ACCOUNT.label,
        deleteApi: () => account.del(id),
        refreshData: () => handleSubmitQuery(query),
        hideModal,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    navigate(PAGE_CONFIG.CREATE_ACCOUNT.path, { state: { query } });
  };

  const onUpdateButtonClick = (id: any) => {
    navigate(`/account/update/${id}`, { state: { query } });
  };

  const onLinkAccountButtonClick = (id: any) => {
    navigate(`/account/link-account/${id}`, { state: { query } });
  };

  const onBackupCodesButtonClick = (id: any) => {
    navigate(`/account/backup-code/${id}`, { state: { query } });
  };

  return (
    <Sidebar2
      breadcrumbs={[
        {
          label: PAGE_CONFIG.ACCOUNT.label,
        },
      ]}
      activeItem={PAGE_CONFIG.ACCOUNT.name}
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
                  value={query.keyword}
                  onChangeText={(value: any) =>
                    setQuery({ ...query, keyword: value })
                  }
                  placeholder="Search..."
                />
                <StaticSelectBox
                  value={query.kind}
                  onChange={(value: any) => {
                    setQuery({ ...query, kind: value });
                  }}
                  dataMap={ACCOUNT_KIND_MAP}
                  placeholder="Kind..."
                />
                <StaticSelectBox
                  value={query.sortOption}
                  onChange={(value: any) => {
                    setQuery({ ...query, sortOption: value });
                  }}
                  dataMap={SORT_ACCOUNT_MAP}
                  placeholder="Sort..."
                />
              </>
            }
            onSearch={async () => await handleSubmitQuery(query)}
            onClear={async () => await handleSubmitQuery(initQuery)}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_ACCOUNT.role}
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

export default Account;
