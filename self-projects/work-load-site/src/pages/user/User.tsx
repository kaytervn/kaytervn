import { useLocation, useNavigate } from "react-router-dom";
import {
  ALIGNMENT,
  ITEMS_PER_PAGE,
  STATUS_MAP,
  USER_KIND_MAP,
} from "../../types/constant";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useModal from "../../hooks/useModal";
import useApi from "../../hooks/useApi";
import { useGridView } from "../../hooks/useGridView";
import {
  basicRender,
  renderActionButton,
  renderEnum,
  renderImage,
  renderLastLogin,
} from "../../components/config/ItemRender";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import {
  ActionEditButton,
  BasicActionButton,
} from "../../components/form/Button";
import {
  configBasicDialog,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/form/Dialog";
import Sidebar2 from "../../components/main/Sidebar2";
import { CreateButton, ToolBar } from "../../components/main/ToolBar";
import { InputBox2 } from "../../components/form/InputTextField";
import { StaticSelectBox } from "../../components/form/SelectTextField";
import { GridView } from "../../components/main/GridView";
import { RefreshCwIcon } from "lucide-react";
import { convertUtcToVn, parseDate } from "../../types/utils";

const initQuery = {
  keyword: "",
  kind: "",
  status: "",
  page: 0,
  size: ITEMS_PER_PAGE,
};

const renderExpirationDateField = (item: any) => {
  const lockedDate = convertUtcToVn(item?.dbConfig?.lockedTime);
  const expiredDate = parseDate(lockedDate);
  if (!expiredDate) {
    return basicRender({ align: ALIGNMENT.LEFT, content: item.username });
  }
  expiredDate.setDate(expiredDate.getDate() + 30);
  const daysLeft = Math.ceil(
    (expiredDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isExpired = daysLeft < 0;
  const isWarning = daysLeft >= 0 && daysLeft <= 7;
  return (
    <div className="flex items-center space-x-2 py-2">
      <span className={`text-gray-300 text-sm text-left whitespace-nowrap`}>
        {item.username}
      </span>
      <span
        className={`text-xs whitespace-nowrap px-2 py-1 rounded-full ${
          isExpired
            ? "bg-red-900/20 text-red-300"
            : isWarning
            ? "bg-yellow-900/20 text-yellow-300"
            : "bg-green-900/20 text-green-300"
        }`}
      >
        {isExpired ? "Expired" : `${daysLeft} days`}
      </span>
    </div>
  );
};

const User = () => {
  const { state } = useLocation();
  const { profile, setToast } = useGlobalContext();
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();
  const navigate = useNavigate();
  const { user, loading } = useApi();
  const { user: apiList, loading: loadingList } = useApi();
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
      label: "Full name",
      accessor: "fullName",
      align: ALIGNMENT.LEFT,
    },
    {
      label: "Username",
      accessor: "username",
      align: ALIGNMENT.LEFT,
      render: (item: any) => renderExpirationDateField(item),
    },
    {
      label: "Role",
      accessor: "group.name",
      align: ALIGNMENT.LEFT,
    },
    renderEnum({
      label: "Kind",
      accessor: "kind",
      dataMap: USER_KIND_MAP,
    }),
    renderLastLogin({}),
    renderEnum({}),
    renderActionButton({
      role: [PAGE_CONFIG.UPDATE_USER.role, PAGE_CONFIG.RESET_MFA_USER.role],
      renderChildren: (item: any) => {
        const showEdit = item.id !== profile.id && !item.isSuperAdmin;
        return (
          <>
            <BasicActionButton
              Icon={RefreshCwIcon}
              buttonText="Reset MFA"
              role={PAGE_CONFIG.RESET_MFA_USER.role}
              onClick={() => onResetMfaButtonClick(item.id)}
            />
            {showEdit && (
              <ActionEditButton
                role={PAGE_CONFIG.UPDATE_USER.role}
                onClick={() =>
                  navigate(`/user/update/${item.id}`, { state: { query } })
                }
              />
            )}
          </>
        );
      },
    }),
  ];

  const onResetMfaButtonClick = (id: any) => {
    showModal(
      configBasicDialog({
        label: PAGE_CONFIG.RESET_MFA_USER.label,
        fetchApi: () => user.resetMfa(id),
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
          label: PAGE_CONFIG.USER.label,
        },
      ]}
      activeItem={PAGE_CONFIG.USER.name}
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
                  dataMap={USER_KIND_MAP}
                  placeholder="Kind..."
                />
                <StaticSelectBox
                  value={query.status}
                  onChange={(value: any) => {
                    setQuery({ ...query, status: value });
                  }}
                  dataMap={STATUS_MAP}
                  placeholder="Status..."
                />
              </>
            }
            onSearch={async () => await handleSubmitQuery(query)}
            onClear={async () => await handleSubmitQuery(initQuery)}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_USER.role}
                onClick={() =>
                  navigate(PAGE_CONFIG.CREATE_USER.path, {
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
        </>
      }
    ></Sidebar2>
  );
};

export default User;
