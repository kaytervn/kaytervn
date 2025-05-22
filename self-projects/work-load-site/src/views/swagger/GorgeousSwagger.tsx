/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  addItemToStorage,
  deleteItemFromStorage,
  encrypt,
  getItemById,
  getItemPage,
  getPaginatedStorageData,
  getStorageData,
  initializeStorage,
  overwriteItemInStorage,
  parseResponseText,
} from "../../types/utils";
import Header from "../../components/swagger/Header";
import { SearchIcon } from "lucide-react";
import Card from "../../components/swagger/Card";
import { SwaggerCollection } from "../../types/interfaces";
import Pagination from "../../components/Pagination";
import {
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/form/Dialog";
import useDialog from "../../hooks/useDialog";
import ConvertCollection from "../../components/swagger/ConvertCollections";
import { transformJson } from "../../types/converter";
import { useLoading } from "../../hooks/useLoading";
import ExportCollection from "../../components/swagger/ExportCollection";
import ImportCollection from "../../components/swagger/ImportCollection";
import CollectionForm from "../../components/swagger/CollectionForm";
import useModal from "../../hooks/useModal";
import Sidebar from "../../components/main/Sidebar";
import {
  GORGEOUS_SWAGGER,
  HEADER_MANAGER,
  REQUEST_MANAGER,
} from "../../types/pageConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { InputBox } from "../../components/form/InputTextField";
import { NoData } from "../../components/NoData";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { TOAST } from "../../types/constant";

const GorgeousSwagger = () => {
  const { setToast } = useGlobalContext();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { isDialogVisible, showDialog, hideDialog, dialogConfig } = useDialog();
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();
  const [convertModalVisible, setConvertModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [data, setData] = useState<SwaggerCollection[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [fetchedJson, setFetchedJson] = useState<any>(null);
  const [exportedText, setExportedText] = useState<string>("");
  const { isLoading, showLoading, hideLoading } = useLoading();
  const size = 6;

  useEffect(() => {
    document.title = GORGEOUS_SWAGGER.label;

    const initializePage = async () => {
      if (state?.collectionId) {
        const itemPage = getItemPage(
          GORGEOUS_SWAGGER.name,
          state.collectionId,
          size
        );
        if (itemPage !== -1) {
          setCurrentPage(itemPage);
          await fetchData(itemPage, searchValue);
          return;
        }
      }
      await fetchData(currentPage, searchValue);
    };

    initializePage();
  }, []);

  const fetchData = (page: number, search: string) => {
    let { items, totalPages } = getPaginatedStorageData(
      GORGEOUS_SWAGGER.name,
      page,
      size,
      "collectionName",
      search
    );
    let newPage = page;
    if (items?.length === 0 && newPage > 0) {
      newPage = totalPages - 1;
      ({ items, totalPages } = getPaginatedStorageData(
        GORGEOUS_SWAGGER.name,
        newPage,
        size,
        "collectionName",
        search
      ));
    }
    setData(items);
    setTotalPages(totalPages);
    setCurrentPage(newPage);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    fetchData(0, value);
  };

  const handlePageChange = (page: number) => {
    fetchData(page, searchValue);
  };

  const handleExport = () => {
    setExportModalVisible(false);
    setExportedText("");
  };

  const handleImport = () => {
    setImportModalVisible(false);
    fetchData(currentPage, searchValue);
  };

  const handleDelete = (id: any) => {
    hideDialog();
    deleteItemFromStorage(GORGEOUS_SWAGGER.name, id);
    setToast("Collection deleted successfully", TOAST.SUCCESS);
    fetchData(currentPage, searchValue);
  };

  const handleConvert = async (id: any) => {
    showLoading();
    const item = getItemById(GORGEOUS_SWAGGER.name, id);
    const url = item.local?.isInit
      ? `${item.local.url}/v2/api-docs`
      : `${item.remote?.url}/v2/api-docs`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const text = await response.text();
      const transformedJson = transformJson(
        JSON.parse(parseResponseText(text)),
        item
      );
      setFetchedJson(JSON.stringify(transformedJson, null, 2));
      setConvertModalVisible(true);
    } catch (error: any) {
      setToast("Error: " + error.message, TOAST.ERROR);
      setFetchedJson(null);
    } finally {
      hideLoading();
    }
  };

  const handleDeleteDialog = (id: any) => {
    showDialog({
      title: "Delete Collection",
      message: "Are you sure you want to delete this collection?",
      confirmText: "Delete",
      color: "red",
      onConfirm: () => {
        handleDelete(id);
      },
      onCancel: hideDialog,
    });
  };

  const handleDeleteAllDialog = () => {
    const count = getStorageData(GORGEOUS_SWAGGER.name).length;
    if (!count) {
      setToast("There is no collection to delete", TOAST.WARN);
      return;
    }
    showDialog({
      title: "Delete All Collections",
      message: `Are you sure you want to delete ${count} ${
        count === 1 ? "collection" : "collections"
      }?`,
      confirmText: "Delete",
      color: "red",
      onConfirm: () => {
        hideDialog();
        initializeStorage(GORGEOUS_SWAGGER.name, []);
        fetchData(0, "");
        setToast(`Deleted ${count} collections`, TOAST.SUCCESS);
      },
      onCancel: hideDialog,
    });
  };

  const handleCloseConvertModal = () => {
    setConvertModalVisible(false);
    setFetchedJson(null);
  };

  const onExportButtonClick = (value: any) => {
    const count = value.length;
    if (!count) {
      setToast("There is no collection to export", TOAST.WARN);
      return;
    }
    setExportedText(encrypt(JSON.stringify(value, null, 2)));
    setExportModalVisible(true);
    setToast(
      `Exported ${count} ${count === 1 ? "collection" : "collections"}`,
      TOAST.SUCCESS
    );
  };

  const onCreateButtonClick = () => {
    showModal({
      isUpdateForm: false,
      title: "Create New Collection",
      color: "gray",
      buttonText: "CREATE",
      onButtonClick: (formattedItem: any) => {
        addItemToStorage(GORGEOUS_SWAGGER.name, formattedItem);
        setToast("Collection created successfully", TOAST.SUCCESS);
        hideModal();
        fetchData(0, "");
      },
      initForm: {
        collectionName: "",
        localUrl: "",
        localIsChecked: false,
        localHeaders: [],
        remoteUrl: "",
        remoteIsChecked: false,
        remoteHeaders: [],
        requests: [],
      },
    });
  };

  const onUpdateButtonClick = (id: any) => {
    const item = getItemById(GORGEOUS_SWAGGER.name, id);
    const requests = [];
    if (item.requests?.length > 0) {
      for (const req of item.requests) {
        requests.push({
          name: req.name,
          method: req.method,
          body: req.body ? req.body : "",
          preScript: req.preScript ? req.preScript : "",
          preScriptIsChecked: req.preScript ? true : false,
          postScript: req.postScript ? req.postScript : "",
          postScriptIsChecked: req.postScript ? true : false,
          path: req.path,
          authKind: req.authKind || "0",
          isCustomHost: req.host || "0",
          host: req.host || "",
          folder: req.folder || "custom-requests",
        });
      }
    }
    const localHeaders = [];
    if (item.local?.headers?.length > 0) {
      for (const head of item.local.headers) {
        localHeaders.push({ key: head.key, value: head.value });
      }
    }
    const remoteHeaders = [];
    if (item.remote?.headers?.length > 0) {
      for (const head of item.remote.headers) {
        remoteHeaders.push({ key: head.key, value: head.value });
      }
    }
    showModal({
      isUpdateForm: true,
      title: "Update Collection",
      color: "blue",
      buttonText: "UPDATE",
      onButtonClick: (formattedItem: any) => {
        overwriteItemInStorage(GORGEOUS_SWAGGER.name, formattedItem);
        setToast("Collection updated successfully", TOAST.SUCCESS);
        hideModal();
        fetchData(currentPage, searchValue);
      },
      initForm: {
        id: item.id,
        collectionName: item.collectionName,
        localUrl: item.local ? item.local.url : "",
        localIsChecked: item.local ? true : false,
        localHeaders,
        remoteUrl: item.remote ? item.remote.url : "",
        remoteIsChecked: item.remote ? true : false,
        remoteHeaders,
        createdAt: item.createdAt,
        requests: requests,
      },
    });
  };

  return (
    <>
      <LoadingDialog isVisible={isLoading} />
      <ConfirmationDialog
        isVisible={isDialogVisible}
        title={dialogConfig.title}
        message={dialogConfig.message}
        onConfirm={dialogConfig.onConfirm}
        onCancel={dialogConfig.onCancel}
        confirmText={dialogConfig.confirmText}
        color={dialogConfig.color}
      />
      <CollectionForm
        isVisible={isModalVisible}
        hideModal={hideModal}
        formConfig={formConfig}
      />
      <ConvertCollection
        isVisible={convertModalVisible}
        setVisible={setConvertModalVisible}
        json={fetchedJson}
        onButtonClick={handleCloseConvertModal}
      />
      <ExportCollection
        isVisible={exportModalVisible}
        setVisible={setExportModalVisible}
        onButtonClick={handleExport}
        text={exportedText}
      />
      <ImportCollection
        isVisible={importModalVisible}
        setVisible={setImportModalVisible}
        onButtonClick={handleImport}
      />
      <Sidebar
        activeItem={GORGEOUS_SWAGGER.name}
        breadcrumbs={[{ label: GORGEOUS_SWAGGER.label }]}
        renderContent={
          <>
            <Header
              onCreate={onCreateButtonClick}
              onDeleteAll={handleDeleteAllDialog}
              onImport={() => {
                setImportModalVisible(true);
              }}
              onExport={() => {
                onExportButtonClick(getStorageData(GORGEOUS_SWAGGER.name));
              }}
              SearchBoxes={
                <InputBox
                  placeholder="Searching..."
                  icon={SearchIcon}
                  value={searchValue}
                  onChangeText={handleSearch}
                />
              }
            />
            {data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.map((item) => (
                    <Card
                      key={item.id}
                      item={item}
                      onExport={(id: any) => {
                        onExportButtonClick([
                          getItemById(GORGEOUS_SWAGGER.name, id),
                        ]);
                      }}
                      onClickHeaders={(id: any) => {
                        navigate(HEADER_MANAGER.path, {
                          state: {
                            collectionId: id,
                          },
                        });
                      }}
                      onClickRequests={(id: any) => {
                        navigate(REQUEST_MANAGER.path, {
                          state: {
                            collectionId: id,
                          },
                        });
                      }}
                      onUpdate={(id: any) => {
                        onUpdateButtonClick(id);
                      }}
                      onDelete={(id: any) => {
                        handleDeleteDialog(id);
                      }}
                      onConvert={async (id: any) => {
                        await handleConvert(id);
                      }}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <NoData />
            )}
          </>
        }
      ></Sidebar>
    </>
  );
};

export default GorgeousSwagger;
