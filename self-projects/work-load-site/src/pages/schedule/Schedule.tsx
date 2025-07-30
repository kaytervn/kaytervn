import { useLocation, useNavigate } from "react-router-dom";
import { GridView } from "../../components/main/GridView";
import {
  ALIGNMENT,
  ITEMS_PER_PAGE,
  SCHEDULE_KIND_MAP,
  SCHEDULE_TYPE_MAP,
  TAG_KIND_MAP,
} from "../../types/constant";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useModal from "../../hooks/useModal";
import useApi from "../../hooks/useApi";
import { useGridView } from "../../hooks/useGridView";
import {
  basicRender,
  renderActionButton,
  renderEnum,
  renderExpirationDateField,
  renderImage,
} from "../../components/config/ItemRender";
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
import Sidebar2 from "../../components/main/Sidebar2";
import { CreateButton, ToolBar } from "../../components/main/ToolBar";
import { InputBox2 } from "../../components/form/InputTextField";
import {
  SelectBox2,
  StaticSelectBox,
} from "../../components/form/SelectTextField";
import { convertUtcToVn, getEnumItem } from "../../types/utils";
import { BoxIcon } from "lucide-react";

const initQuery = {
  keyword: "",
  kind: "",
  tagId: "",
  page: 0,
  size: ITEMS_PER_PAGE,
};

const Schedule = () => {
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();
  const { state } = useLocation();
  const { setToast } = useGlobalContext();
  const navigate = useNavigate();
  const { schedule, loading } = useApi();
  const { schedule: apiList, loading: loadingList } = useApi();
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
    initQuery: state?.query || initQuery,
  });

  const columns = [
    renderImage({ label: "Image", accessor: "imagePath", Icon: BoxIcon }),
    {
      label: "Name",
      accessor: "name",
      align: ALIGNMENT.LEFT,
      render: (item: any) => {
        const value: any = getEnumItem(SCHEDULE_KIND_MAP, item.kind);
        const colorCode = item.tag?.color;
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
    renderEnum({
      label: "Type",
      accessor: "type",
      align: ALIGNMENT.CENTER,
      dataMap: SCHEDULE_TYPE_MAP,
    }),
    {
      label: "Due Date",
      accessor: "dueDate",
      align: ALIGNMENT.LEFT,
      render: (item: any) =>
        renderExpirationDateField(convertUtcToVn(item?.dueDate), item?.dueDate),
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
        PAGE_CONFIG.UPDATE_SCHEDULE.role,
        PAGE_CONFIG.DELETE_SCHEDULE.role,
      ],
      renderChildren: (item: any) => {
        return (
          <>
            <ActionEditButton
              role={PAGE_CONFIG.UPDATE_SCHEDULE.role}
              onClick={() => onUpdateButtonClick(item.id)}
            />
            <ActionDeleteButton
              role={PAGE_CONFIG.DELETE_SCHEDULE.role}
              onClick={() => onDeleteButtonClick(item.id)}
            />
          </>
        );
      },
    }),
  ];

  const onDeleteButtonClick = (id: any) => {
    showModal(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_SCHEDULE.label,
        deleteApi: () => schedule.del(id),
        refreshData: () => handleSubmitQuery(query),
        hideModal,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    navigate(PAGE_CONFIG.CREATE_SCHEDULE.path, { state: { query } });
  };

  const onUpdateButtonClick = (id: any) => {
    navigate(`/schedule/update/${id}`, { state: { query } });
  };

  return (
    <Sidebar2
      breadcrumbs={[
        {
          label: PAGE_CONFIG.SCHEDULE.label,
        },
      ]}
      activeItem={PAGE_CONFIG.SCHEDULE.name}
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
                  dataMap={SCHEDULE_KIND_MAP}
                  placeholder="Kind..."
                />
                <SelectBox2
                  value={query.tagId}
                  onChange={(value: any) => {
                    setQuery({ ...query, tagId: value });
                  }}
                  fetchListApi={tag.autoComplete}
                  placeholder="Tag..."
                  colorCodeField="color"
                  queryParams={{ kind: TAG_KIND_MAP.SCHEDULE.value }}
                />
              </>
            }
            onSearch={async () => await handleSubmitQuery(query)}
            onClear={async () => await handleSubmitQuery(initQuery)}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_SCHEDULE.role}
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

export default Schedule;
