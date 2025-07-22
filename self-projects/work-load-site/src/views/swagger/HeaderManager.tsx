/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GORGEOUS_SWAGGER, HEADER_MANAGER } from "../../types/pageConfig";
import Sidebar from "../../components/main/Sidebar";
import {
  getItemById,
  overwriteItemInStorage,
  truncateString,
} from "../../types/utils";
import ListHeadersComponent from "../../components/swagger/header/ListHeadersComponent";
import { PlusIcon } from "lucide-react";
import useModal from "../../hooks/useModal";
import HeaderForm from "../../components/swagger/header/HeaderForm";
import { Header } from "../../types/interfaces";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { TOAST } from "../../types/constant";

const HeaderManager = () => {
  const { setToast } = useGlobalContext();
  const [activeTab, setActiveTab] = useState<any>(null);
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [localHeaders, setLocalHeaders] = useState<Header[]>([]);
  const [remoteHeaders, setRemoteHeaders] = useState<Header[]>([]);
  const { state } = useLocation();
  const { showModal, formConfig, hideModal, isModalVisible } = useModal();

  const getDataById = () => {
    if (item == null) {
      navigate(GORGEOUS_SWAGGER.path);
      return;
    }
    return getItemById(GORGEOUS_SWAGGER.name, item.id);
  };

  const handleAddHeader = (header: any) => {
    const isLocal = activeTab === "local";
    const currentHeaders = isLocal ? localHeaders : remoteHeaders;
    const handledHeaders = [...currentHeaders, header].sort((a, b) =>
      a.key.localeCompare(b.key)
    );
    const item = getDataById();
    if (isLocal) {
      item.local.headers = handledHeaders;
      setLocalHeaders(handledHeaders);
    } else {
      item.remote.headers = handledHeaders;
      setRemoteHeaders(handledHeaders);
    }
    overwriteItemInStorage(GORGEOUS_SWAGGER.name, item);
    setToast("Header added successfully", TOAST.SUCCESS);
  };

  const handleEditHeader = (index: number, updatedHeader: any) => {
    const isLocal = activeTab === "local";
    const currentHeaders = isLocal ? localHeaders : remoteHeaders;
    const handledHeaders = currentHeaders
      .map((header, i) => (i === index ? updatedHeader : header))
      .sort((a, b) => a.key.localeCompare(b.key));
    const item = getDataById();
    if (isLocal) {
      item.local.headers = handledHeaders;
      setLocalHeaders(handledHeaders);
    } else {
      item.remote.headers = handledHeaders;
      setRemoteHeaders(handledHeaders);
    }
    overwriteItemInStorage(GORGEOUS_SWAGGER.name, item);
    setToast("Header edited successfully", TOAST.SUCCESS);
  };

  const handleRemoveHeader = (index: number) => {
    const isLocal = activeTab === "local";
    const currentHeaders = isLocal ? localHeaders : remoteHeaders;
    const handledHeaders = currentHeaders
      .filter((_, i) => i !== index)
      .sort((a, b) => a.key.localeCompare(b.key));
    const item = getDataById();
    if (isLocal) {
      item.local.headers = handledHeaders;
      setLocalHeaders(handledHeaders);
    } else {
      item.remote.headers = handledHeaders;
      setRemoteHeaders(handledHeaders);
    }
    overwriteItemInStorage(GORGEOUS_SWAGGER.name, item);
    setToast("Header deleted successfully", TOAST.SUCCESS);
  };

  useEffect(() => {
    if (state?.collectionId) {
      const item = getItemById(GORGEOUS_SWAGGER.name, state.collectionId);
      if (item) {
        setItem(item);
        if (!item.remote && !item.local) {
          navigate(GORGEOUS_SWAGGER.path);
          return;
        }
        if (item.remote) {
          setRemoteHeaders(item.remote?.headers || []);
          setActiveTab("remote");
        }
        if (item.local) {
          setLocalHeaders(item.local?.headers || []);
          setActiveTab("local");
        }
      } else {
        navigate(GORGEOUS_SWAGGER.path);
      }
    } else {
      navigate(GORGEOUS_SWAGGER.path);
    }
  }, [state]);

  const onAddButtonClick = () => {
    showModal({
      title: "Add New Header",
      color: "gray",
      buttonText: "ADD",
      onButtonClick: (form: any) => {
        handleAddHeader(form);
        hideModal();
      },
      initForm: {
        key: "",
        value: "",
      },
    });
  };

  return (
    <Sidebar
      activeItem={GORGEOUS_SWAGGER.name}
      breadcrumbs={[
        {
          label: GORGEOUS_SWAGGER.label,
          path: GORGEOUS_SWAGGER.path,
          state: { collectionId: item?.id },
        },
        { label: HEADER_MANAGER.label },
      ]}
      renderContent={
        <>
          <HeaderForm
            isVisible={isModalVisible}
            hideModal={hideModal}
            formConfig={formConfig}
          />
          <div className="flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center gap-2">
              <label className="ml-2 text-base font-semibold text-red-300">
                {item &&
                  item?.collectionName &&
                  truncateString(item.collectionName, 25)}
              </label>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-800 text-red-200">
                {activeTab === "local"
                  ? localHeaders?.length || 0
                  : remoteHeaders?.length || 0}
              </span>
            </div>

            <div className="flex space-x-2">
              {item?.local && (
                <button
                  className={`px-4 py-2 ${
                    activeTab === "local"
                      ? "border-b-2 border-blue-500 text-white font-bold"
                      : "text-gray-400"
                  }`}
                  onClick={() => setActiveTab("local")}
                >
                  Local
                </button>
              )}
              {item?.remote && (
                <button
                  className={`px-4 py-2 ${
                    activeTab === "remote"
                      ? "border-b-2 border-blue-500 text-white font-bold"
                      : "text-gray-400"
                  }`}
                  onClick={() => setActiveTab("remote")}
                >
                  Remote
                </button>
              )}
            </div>
            <button
              className="bg-red-700 hover:bg-red-900 text-red-100 py-1 px-3 rounded-lg flex items-center"
              onClick={onAddButtonClick}
            >
              <PlusIcon size={20} className="mr-2" />
              Add
            </button>
          </div>
          <ListHeadersComponent
            handleRemove={handleRemoveHeader}
            handleEdit={handleEditHeader}
            headers={activeTab === "local" ? localHeaders : remoteHeaders}
          />
        </>
      }
    ></Sidebar>
  );
};

export default HeaderManager;
