import { useState, useRef, useEffect } from "react";
import { RefreshCcwIcon, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../config/GlobalProvider";
import useModal from "../../hooks/useModal";
import { removeSessionCache } from "../../services/storages";
import { OptionButton } from "../form/Button";
import { Breadcrumb2 } from "./Breadcrumb";
import { BUTTON_TEXT, TOAST } from "../../types/constant";
import {
  configModalForm,
  ConfirmationDialog,
  LoadingDialog,
} from "../form/Dialog";
import useApi from "../../hooks/useApi";
import RequestKey from "../../pages/auth/RequestKey";
import ChangePassword from "../../pages/auth/ChangePassword";
import { USER_CONFIG } from "../config/PageConfigDetails";
import ChangePin from "../../pages/auth/ChangePin";

const MainHeader = ({ breadcrumbs }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, loading, dataBackup } = useApi();
  const { profile, setToast } = useGlobalContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();
  const {
    isModalVisible: changePasswordFormVisible,
    showModal: showChangePasswordForm,
    hideModal: hideChangePasswordForm,
    formConfig: changePasswordFormConfig,
  } = useModal();
  const {
    isModalVisible: changePinFormVisible,
    showModal: showChangePinForm,
    hideModal: hideChangePinForm,
    formConfig: changePinFormConfig,
  } = useModal();
  const {
    isModalVisible: requestKeyFormVisible,
    showModal: showRequestKeyForm,
    hideModal: hideRequestKeyForm,
    formConfig: requestKeyFormConfig,
  } = useModal();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isTxtFile =
      file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt");
    if (!isTxtFile) {
      setToast("Invalid file type", TOAST.ERROR);
      return;
    }
    const res = await dataBackup.upload(file);
    if (res.result) {
      setToast("Upload data backup successfully", TOAST.SUCCESS);
    } else {
      setToast(res.message, TOAST.ERROR);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRequestKey = () => {
    setIsDropdownOpen(false);
    showRequestKeyForm(
      configModalForm({
        label: "Send request key",
        fetchApi: user.requestKey,
        setToast,
        hideModal: hideRequestKeyForm,
        initForm: {
          password: "",
        },
      })
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    showModal({
      title: BUTTON_TEXT.LOGOUT,
      message: "You want to exit?",
      confirmText: BUTTON_TEXT.SUBMIT,
      color: "crimson",
      onConfirm: () => {
        hideModal();
        removeSessionCache();
        window.location.href = USER_CONFIG.LOGIN.path;
      },
      onCancel: () => {
        hideModal();
      },
    });
  };

  const handleChangePassword = () => {
    setIsDropdownOpen(false);
    showChangePasswordForm({
      title: BUTTON_TEXT.CHANGE_PASSWORD,
      hideModal: hideChangePasswordForm,
    });
  };

  const handleChangePin = () => {
    setIsDropdownOpen(false);
    showChangePinForm({
      title: BUTTON_TEXT.CHANGE_PIN,
      hideModal: hideChangePinForm,
    });
  };

  const handleUploadDataBackup = () => {
    setIsDropdownOpen(false);
    fileInputRef.current?.click();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClearSystemKey = async () => {
    setIsDropdownOpen(false);
    showModal({
      title: BUTTON_TEXT.CLEAR_SYSTEM_KEY,
      message: "You want to clear system key?",
      confirmText: BUTTON_TEXT.SUBMIT,
      color: "crimson",
      onConfirm: async () => {
        hideModal();
        const res = await user.clearSystemKey();
        if (res.result) {
          setToast("System key has been cleared", TOAST.SUCCESS);
          removeSessionCache();
          window.location.href = USER_CONFIG.LOGIN.path;
        } else {
          setToast(res.message, TOAST.ERROR);
        }
      },
      onCancel: () => {
        hideModal();
      },
    });
  };

  const handleDownloadDataBackup = async () => {
    setIsDropdownOpen(false);
    showModal({
      title: BUTTON_TEXT.DOWNLOAD_DATA_BACKUP,
      message: "You want to download data backup?",
      confirmText: BUTTON_TEXT.DOWNLOAD,
      color: "mediumseagreen",
      onConfirm: async () => {
        hideModal();
        const res = await dataBackup.download();
        if (res.result) {
          setToast("File downloaded successfully", TOAST.SUCCESS);
        } else {
          setToast(res.message, TOAST.ERROR);
        }
      },
      onCancel: () => {
        hideModal();
      },
    });
  };

  const handleSyncAppProps = async () => {
    const res = await user.syncSystemProps();
    if (res.result) {
      setToast("Synchronized successfully", TOAST.SUCCESS);
    } else {
      setToast(res.message, TOAST.ERROR);
    }
  };

  return (
    <>
      <LoadingDialog isVisible={loading} />
      <ConfirmationDialog isVisible={isModalVisible} formConfig={formConfig} />
      <RequestKey
        isVisible={requestKeyFormVisible}
        formConfig={requestKeyFormConfig}
      />
      <ChangePassword
        isVisible={changePasswordFormVisible}
        formConfig={changePasswordFormConfig}
      />
      <ChangePin
        isVisible={changePinFormVisible}
        formConfig={changePinFormConfig}
      />
      <input
        type="file"
        accept=".txt"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
      />
      <header className="flex items-center justify-between w-full text-white">
        <div className="flex-1 min-w-0">
          <Breadcrumb2 items={breadcrumbs} />
        </div>

        <div className="relative flex items-center space-x-4 flex-shrink-0">
          <button
            className="relative focus:outline-none"
            onClick={handleSyncAppProps}
            title="Synchronize properties"
          >
            <RefreshCcwIcon size={24} className="text-white" />
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={toggleDropdown}
            >
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-700">
                <UserIcon size={20} className="text-white" />
              </div>
              <span className="text-sm hidden md:inline">
                {profile?.username}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-12 w-48 rounded-lg bg-gray-900 py-2 shadow-xl z-50 ring-1 ring-gray-700">
                <OptionButton
                  label={BUTTON_TEXT.HOME}
                  onClick={() => navigate("/")}
                />
                <OptionButton
                  label={BUTTON_TEXT.REQUEST_KEY}
                  onClick={handleRequestKey}
                />
                <OptionButton
                  label={BUTTON_TEXT.CHANGE_PASSWORD}
                  onClick={handleChangePassword}
                />
                <OptionButton
                  label={BUTTON_TEXT.CHANGE_PIN}
                  onClick={handleChangePin}
                />
                <OptionButton
                  label={BUTTON_TEXT.DOWNLOAD_DATA_BACKUP}
                  onClick={handleDownloadDataBackup}
                />
                <OptionButton
                  label={BUTTON_TEXT.UPLOAD_DATA_BACKUP}
                  onClick={handleUploadDataBackup}
                />
                <OptionButton
                  label={BUTTON_TEXT.CLEAR_SYSTEM_KEY}
                  onClick={handleClearSystemKey}
                />
                <OptionButton
                  label={BUTTON_TEXT.LOGOUT}
                  onClick={handleLogout}
                />
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default MainHeader;
