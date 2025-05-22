import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useGlobalContext } from "../../../components/config/GlobalProvider";
import useModal from "../../../hooks/useModal";
import useApi from "../../../hooks/useApi";
import useGridViewLocal from "../../../hooks/useGridViewLocal";
import {
  ALIGNMENT,
  BASIC_MESSAGES,
  ITEMS_PER_PAGE,
} from "../../../types/constant";
import { renderActionButton } from "../../../components/config/ItemRender";
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
import { N_LESSONS_PAGE_CONFIG } from "../../../components/config/PageConfig";
import NLessonsSideBar from "../../../components/main/n-lessons/NLessonsSideBar";
import CreateCategory from "./CreateCategory";
import UpdateCategory from "./UpdateCategory";
import { CreateButton, ToolBar } from "../../../components/main/ToolBar";
import { InputBox2 } from "../../../components/form/InputTextField";
import { GridView } from "../../../components/main/GridView";

const initQuery = { name: "" };

const Category = () => {
  const { state } = useLocation();
  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData?.filter((item) => {
      const nameFilter =
        !query?.name ||
        item.name.toLowerCase().includes(query.name.toLowerCase());
      return nameFilter;
    });
  }, []);
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
  const { category: apiList, loading: loadingList } = useApi();
  const { category, loading } = useApi();
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
    fetchListApi: apiList.list,
  });

  const columns = [
    {
      label: "Tên danh mục",
      accessor: "name",
      align: ALIGNMENT.LEFT,
    },
    renderActionButton({
      renderChildren: (item: any) => (
        <>
          <ActionEditButton onClick={() => onUpdateButtonClick(item._id)} />
          {item.canDelete == 1 && (
            <ActionDeleteButton onClick={() => onDeleteButtonClick(item._id)} />
          )}
        </>
      ),
    }),
  ];

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: N_LESSONS_PAGE_CONFIG.DELETE_CATEGORY.label,
        deleteApi: () => category.del(id),
        refreshData: () => handleDeleteItem(id),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    showCreateForm(
      configModalForm({
        label: N_LESSONS_PAGE_CONFIG.CREATE_CATEGORY.label,
        fetchApi: category.create,
        refreshData: handleRefreshData,
        hideModal: hideCreateForm,
        setToast,
        successMessage: BASIC_MESSAGES.CREATED,
        initForm: {
          name: "",
        },
      })
    );
  };

  const onUpdateButtonClick = (id: any) => {
    showUpdateForm(
      configModalForm({
        label: N_LESSONS_PAGE_CONFIG.UPDATE_CATEGORY.label,
        fetchApi: category.update,
        refreshData: handleRefreshData,
        hideModal: hideUpdateForm,
        setToast,
        successMessage: BASIC_MESSAGES.UPDATED,
        initForm: {
          id,
        },
      })
    );
  };

  return (
    <NLessonsSideBar
      breadcrumbs={[
        {
          label: N_LESSONS_PAGE_CONFIG.CATEGORY.label,
        },
      ]}
      activeItem={N_LESSONS_PAGE_CONFIG.CATEGORY.name}
      renderContent={
        <>
          <CreateCategory
            isVisible={createFormVisible}
            formConfig={createFormConfig}
          />
          <UpdateCategory
            isVisible={updateFormVisible}
            formConfig={updateFormConfig}
          />
          <ConfirmationDialog
            isVisible={deleteDialogVisible}
            formConfig={deleteDialogConfig}
          />
          <LoadingDialog isVisible={loading} />
          <ToolBar
            searchBoxes={
              <>
                <InputBox2
                  value={query.name}
                  onChangeText={(value: any) =>
                    handleSubmitQuery({ ...query, name: value })
                  }
                  placeholder="Tên danh mục..."
                />
              </>
            }
            onClear={() => handleSubmitQuery(initQuery)}
            onRefresh={handleRefreshData}
            actionButtons={<CreateButton onClick={onCreateButtonClick} />}
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
    ></NLessonsSideBar>
  );
};
export default Category;
