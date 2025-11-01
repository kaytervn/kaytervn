import { Link, Typography } from "@mui/material";
import { BasicAppBar } from "../../components/BasicAppBar";
import { BasicListView } from "../../components/ListView";
import { PAGE_CONFIG } from "../../config/PageConfig";
import useApi from "../../hooks/useApi";
import { useGridView } from "../../hooks/useGridView";
import { ITEMS_PER_PAGE, TEXT, TOAST } from "../../services/constant";
import { LoadingOverlay } from "../../components/CustomOverlay";
import { useDialog } from "../../hooks/useDialog";
import { useToast } from "../../config/ToastProvider";

const initQuery = {
  keyword: "",
  page: 0,
  size: ITEMS_PER_PAGE,
};

export const Platform = () => {
  const { showToast } = useToast();
  const { platform, loading } = useApi();
  const {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  } = useGridView({
    fetchListApi: platform.list,
    initQuery,
  });
  const {
    isVisible: crVisible,
    onOpen: crOpen,
    onClose: crClose,
  } = useDialog();

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

  const handleCreate = async (form: any) => {
    const res = await platform.create(form);
    if (res.result) {
      crClose();
      showToast(TEXT.CREATED, TOAST.SUCCESS);
    } else {
      showToast(res.message || TEXT.REQUEST_FAILED, TOAST.ERROR);
    }
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
    <BasicAppBar
      title={PAGE_CONFIG.PLATFORM.label}
      search={{
        value: query.keyword,
        onChange: (value: any) => setQuery({ ...query, keyword: value }),
        onSearch: async () => await handleSubmitQuery(query),
        onClear: async () => await handleSubmitQuery(initQuery),
      }}
      create={{
        onClick: crOpen,
      }}
    >
      <>
        <LoadingOverlay loading={loading} />
        <BasicListView
          data={data}
          renderContent={function (item: any): React.ReactNode {
            return (
              <>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                >
                  {item.name}
                </Typography>
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  noWrap
                  sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                >
                  {item.url}
                </Link>
              </>
            );
          }}
          menu={[]}
          pagination={{
            page: query.page,
            totalPages: totalPages,
            onChange: handlePageChange,
          }}
        />
      </>
    </BasicAppBar>
  );
};
