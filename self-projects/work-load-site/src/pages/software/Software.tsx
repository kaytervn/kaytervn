import { useLocation, useNavigate } from "react-router-dom";
import { GridView } from "../../components/main/GridView";
import { ALIGNMENT, ITEMS_PER_PAGE, TAG_KIND_MAP } from "../../types/constant";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useModal from "../../hooks/useModal";
import useApi from "../../hooks/useApi";
import { useGridView } from "../../hooks/useGridView";
import {
  basicRender,
  renderActionButton,
  renderHrefLink,
  renderTagField,
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
import { SelectBox2 } from "../../components/form/SelectTextField";
import { convertUtcToVn } from "../../types/utils";

const initQuery = {
  keyword: "",
  tagId: "",
  page: 0,
  size: ITEMS_PER_PAGE,
};

const Software = () => {
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();
  const { state } = useLocation();
  const { setToast } = useGlobalContext();
  const navigate = useNavigate();
  const { software, loading } = useApi();
  const { software: apiList, loading: loadingList } = useApi();
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
    renderTagField({
      label: "Name",
      accessor: "name",
      align: ALIGNMENT.LEFT,
      colorCodeField: "tag.color",
      tagNameField: "tag.name",
      colorCodePosition: ALIGNMENT.RIGHT,
    }),
    renderHrefLink({
      label: "Link",
      accessor: "link",
      align: ALIGNMENT.LEFT,
      onClick: (item: any) => {
        window.open(item.link, "_blank");
      },
    }),
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
        PAGE_CONFIG.UPDATE_SOFTWARE.role,
        PAGE_CONFIG.DELETE_SOFTWARE.role,
      ],
      renderChildren: (item: any) => {
        return (
          <>
            <ActionEditButton
              role={PAGE_CONFIG.UPDATE_SOFTWARE.role}
              onClick={() => onUpdateButtonClick(item.id)}
            />
            <ActionDeleteButton
              role={PAGE_CONFIG.DELETE_SOFTWARE.role}
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
        label: PAGE_CONFIG.DELETE_SOFTWARE.label,
        deleteApi: () => software.del(id),
        refreshData: () => handleSubmitQuery(query),
        hideModal,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    navigate(PAGE_CONFIG.CREATE_SOFTWARE.path, { state: { query } });
  };

  const onUpdateButtonClick = (id: any) => {
    navigate(`/software/update/${id}`, { state: { query } });
  };

  return (
    <Sidebar2
      breadcrumbs={[
        {
          label: PAGE_CONFIG.SOFTWARE.label,
        },
      ]}
      activeItem={PAGE_CONFIG.SOFTWARE.name}
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
                <SelectBox2
                  value={query.tagId}
                  onChange={(value: any) => {
                    setQuery({ ...query, tagId: value });
                  }}
                  fetchListApi={tag.autoComplete}
                  placeholder="Tag..."
                  colorCodeField="color"
                  queryParams={{ kind: TAG_KIND_MAP.SOFTWARE.value }}
                />
              </>
            }
            onSearch={async () => await handleSubmitQuery(query)}
            onClear={async () => await handleSubmitQuery(initQuery)}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_SOFTWARE.role}
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

export default Software;
