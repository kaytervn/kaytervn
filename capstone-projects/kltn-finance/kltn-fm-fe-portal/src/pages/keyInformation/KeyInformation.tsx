import {
  ActionDeleteButton,
  ActionEditButton,
} from "../../components/form/Button";
import {
  configDeleteDialog,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/page/Dialog";
import {
  DECRYPT_FIELDS,
  PAGE_CONFIG,
} from "../../components/config/PageConfig";
import useApi from "../../hooks/useApi";
import useModal from "../../hooks/useModal";
import {
  ALIGNMENT,
  BASIC_MESSAGES,
  ITEMS_PER_PAGE,
  KEY_KIND_MAP,
  TAG_KIND,
  TOAST,
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import {
  CreateButton,
  DecryptPasswordButton,
  ExportExcelButton,
  ToolBar,
} from "../../components/page/ToolBar";
import InputBox from "../../components/page/InputBox";
import { GridView } from "../../components/page/GridView";
import {
  renderActionButton,
  renderIconField,
  renderTagField,
} from "../../components/config/ItemRender";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useGridViewLocal from "../../hooks/useGridViewLocal";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SelectBoxLazy,
  StaticSelectBox,
} from "../../components/page/SelectBox";
import ImportExcelButton from "../../components/form/ImportExcelButton";
import DecryptPassword from "./DecryptPassword";

const initQuery = {
  name: "",
  kind: "",
  keyInformationGroupId: "",
  organizationId: "",
  tagId: "",
};

const KeyInformation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData.filter((item) => {
      const nameFilter =
        !query?.name ||
        item.name.toLowerCase().includes(query.name.toLowerCase());
      const kindFilter = !query?.kind || item.kind == query.kind;
      const keyInformationGroupIdFilter =
        !query?.keyInformationGroupId ||
        item?.keyInformationGroup?.id == query.keyInformationGroupId;
      const organizationIdFilter =
        !query?.organizationId ||
        item?.organization?.id == query.organizationId;
      const tagIdFilter = !query?.tagId || item?.tag?.id == query.tagId;
      return (
        nameFilter &&
        organizationIdFilter &&
        tagIdFilter &&
        kindFilter &&
        keyInformationGroupIdFilter
      );
    });
  }, []);
  const { setToast, sessionKey } = useGlobalContext();
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { keyInformation: apiList, loading: loadingList } = useApi();
  const { keyInformation, loading } = useApi();
  const { keyInformationGroup, organization, tag } = useApi();
  const {
    data,
    query,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
    handleDeleteItem,
    handleRefreshData,
  } = useGridViewLocal({
    initQuery: state?.query || initQuery,
    filterData: customFilterData,
    decryptFields: DECRYPT_FIELDS.KEY_INFORMATION,
    secretKey: sessionKey,
    fetchListApi: apiList.list,
  });
  const {
    isModalVisible: decryptFormVisible,
    showModal: showDecryptForm,
    hideModal: hideDecryptForm,
    formConfig: decryptFormConfig,
  } = useModal();

  const columns = [
    renderIconField({
      label: "Tên key",
      accessor: "name",
      iconMapField: "kind",
      dataMap: KEY_KIND_MAP,
      role: PAGE_CONFIG.VIEW_KEY_INFORMATION.role,
      onClick: (item: any) => onViewClick(item.id),
    }),
    renderTagField({
      label: "Nhóm key",
      accessor: "keyInformationGroup.name",
      colorCodeField: "tag.colorCode",
    }),
    {
      label: "Công ty",
      accessor: "organization.name",
      align: ALIGNMENT.LEFT,
    },
    renderActionButton({
      role: [
        PAGE_CONFIG.DELETE_KEY_INFORMATION.role,
        PAGE_CONFIG.UPDATE_KEY_INFORMATION.role,
      ],
      renderChildren: (item: any) => (
        <>
          <ActionEditButton
            role={PAGE_CONFIG.UPDATE_KEY_INFORMATION.role}
            onClick={() => onUpdateButtonClick(item.id)}
          />
          <ActionDeleteButton
            role={PAGE_CONFIG.DELETE_KEY_INFORMATION.role}
            onClick={() => onDeleteButtonClick(item.id)}
          />
        </>
      ),
    }),
  ];

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_KEY_INFORMATION.label,
        deleteApi: () => keyInformation.del(id),
        refreshData: () => handleDeleteItem(id),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    navigate(PAGE_CONFIG.CREATE_KEY_INFORMATION.path, { state: { query } });
  };

  const onUpdateButtonClick = (id: any) => {
    navigate(`/key-information/update/${id}`, { state: { query } });
  };

  const onViewClick = (id: any) => {
    navigate(`/key-information/view/${id}`, { state: { query } });
  };

  const onExportExcelButtonClick = async () => {
    if (!data.length) {
      setToast(BASIC_MESSAGES.NO_DATA, TOAST.WARN);
      return;
    }
    if (!query.kind) {
      setToast("Vui lòng chọn loại key", TOAST.WARN);
      return;
    }
    const ids = data.map((item: any) => item.id);
    const res = await keyInformation.exportToExcel(ids, query.kind);
    if (res.result) {
      setToast(BASIC_MESSAGES.EXPORTED, TOAST.SUCCESS);
    } else {
      setToast(BASIC_MESSAGES.FAILED, TOAST.ERROR);
    }
  };

  const onDecryptPasswordButtonClick = async () => {
    showDecryptForm({
      title: PAGE_CONFIG.DECRYPT_PASSWORD_KEY_INFORMATION.label,
      hideModal: hideDecryptForm,
      initForm: {
        value: "",
      },
    });
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: PAGE_CONFIG.KEY_INFORMATION.label,
        },
      ]}
      activeItem={PAGE_CONFIG.KEY_INFORMATION.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <DecryptPassword
            isVisible={decryptFormVisible}
            formConfig={decryptFormConfig}
          />
          <ToolBar
            searchBoxes={
              <>
                <InputBox
                  value={query.name}
                  onChangeText={(value: any) =>
                    handleSubmitQuery({ ...query, name: value })
                  }
                  placeholder="Tên key..."
                />
                <StaticSelectBox
                  value={query.kind}
                  onChange={(value: any) => {
                    handleSubmitQuery({ ...query, kind: value });
                  }}
                  dataMap={KEY_KIND_MAP}
                  placeholder="Loại..."
                />
                <SelectBoxLazy
                  value={query.keyInformationGroupId}
                  onChange={(value: any) => {
                    handleSubmitQuery({
                      ...query,
                      keyInformationGroupId: value,
                    });
                  }}
                  fetchListApi={keyInformationGroup.autoComplete}
                  placeholder="Nhóm key..."
                  decryptFields={DECRYPT_FIELDS.KEY_INFORMATION_GROUP}
                />
                <SelectBoxLazy
                  value={query.organizationId}
                  onChange={(value: any) => {
                    handleSubmitQuery({ ...query, organizationId: value });
                  }}
                  fetchListApi={organization.autoComplete}
                  placeholder="Công ty..."
                  decryptFields={DECRYPT_FIELDS.ORGANIZATION}
                />
                <SelectBoxLazy
                  value={query.tagId}
                  onChange={(value: any) => {
                    handleSubmitQuery({ ...query, tagId: value });
                  }}
                  fetchListApi={tag.autoComplete}
                  queryParams={{ kind: TAG_KIND.KEY_INFORMATION }}
                  placeholder="Thẻ..."
                  colorCodeField="colorCode"
                  decryptFields={DECRYPT_FIELDS.TAG}
                />
              </>
            }
            onClear={() => handleSubmitQuery(initQuery)}
            onRefresh={handleRefreshData}
            actionButtons2={
              <div className="flex justify-between">
                <span className="flex space-x-2">
                  <DecryptPasswordButton
                    onClick={onDecryptPasswordButtonClick}
                  />
                  <ImportExcelButton
                    role={PAGE_CONFIG.IMPORT_EXCEL_KEY_INFORMATION.role}
                    fetchApi={keyInformation.importExcel}
                    onFileUploaded={handleRefreshData}
                  />
                </span>
                <span className="flex space-x-2">
                  <ExportExcelButton
                    role={PAGE_CONFIG.EXPORT_EXCEL_KEY_INFORMATION.role}
                    onClick={onExportExcelButtonClick}
                  />
                  <CreateButton
                    role={PAGE_CONFIG.CREATE_KEY_INFORMATION.role}
                    onClick={onCreateButtonClick}
                  />
                </span>
              </div>
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
            isVisible={deleteDialogVisible}
            formConfig={deleteDialogConfig}
          />
        </>
      }
    ></Sidebar>
  );
};
export default KeyInformation;
