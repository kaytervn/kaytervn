import { useState, useRef, useEffect } from "react";
import { UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import { useGlobalContext } from "../GlobalProvider";
import { configModalForm, ConfirmationDialog, LoadingDialog } from "./Dialog";
import useModal from "../../hooks/useModal";
import { removeSessionCache } from "../../services/storages";
import { getMediaImage } from "../../services/utils";
import { PAGE_CONFIG } from "../PageConfig";
import { OptionButton } from "../form/Button";
import InputKey from "../../pages/auth/InputKey";
import ClearKey from "../../pages/auth/ClearKey";
import useApi from "../../hooks/useApi";
import VerifyBackup from "../../pages/auth/VerifyBackup";
import PushBackup from "../../pages/auth/PushBackup";

const MainHeader = ({ breadcrumbs }: any) => {
  const { setToast } = useGlobalContext();
  const { auth, loading } = useApi();
  const { profile } = useGlobalContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();
  const {
    isModalVisible: inputKeyFormVisible,
    showModal: showInputKeyForm,
    hideModal: hideInputKeyForm,
    formConfig: inputKeyFormConfig,
  } = useModal();
  const {
    isModalVisible: clearKeyFormVisible,
    showModal: showClearKeyForm,
    hideModal: hideClearKeyForm,
    formConfig: clearKeyFormConfig,
  } = useModal();
  const {
    isModalVisible: verifyBackupVisible,
    showModal: showVerifyBackupForm,
    hideModal: hideVerifyBackupForm,
    formConfig: verifyBackupConfig,
  } = useModal();
  const {
    isModalVisible: pushBackupVisible,
    showModal: showPushBackupForm,
    hideModal: hidePushBackupForm,
    formConfig: pushBackupConfig,
  } = useModal();

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

  const handleClickButton = (path: string) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    showModal({
      title: "Đăng xuất",
      message: "Bạn có chắc chắn muốn đăng xuất không?",
      confirmText: "Đăng xuất",
      color: "crimson",
      onConfirm: () => {
        hideModal();
        removeSessionCache();
        window.location.href = "/";
      },
      onCancel: () => {
        hideModal();
      },
    });
  };

  const handleInputKey = () => {
    setIsDropdownOpen(false);
    showInputKeyForm(
      configModalForm({
        label: PAGE_CONFIG.INPUT_KEY.label,
        fetchApi: auth.inputKey,
        hideModal: hideInputKeyForm,
        setToast,
        initForm: { privateKey: "" },
      })
    );
  };

  const handleClearKey = () => {
    setIsDropdownOpen(false);
    showClearKeyForm(
      configModalForm({
        label: PAGE_CONFIG.CLEAR_KEY.label,
        fetchApi: auth.clearKey,
        hideModal: hideClearKeyForm,
        setToast,
        initForm: { password: "" },
      })
    );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <>
      <LoadingDialog isVisible={loading} />
      <ConfirmationDialog isVisible={isModalVisible} formConfig={formConfig} />
      <InputKey
        isVisible={inputKeyFormVisible}
        formConfig={inputKeyFormConfig}
      />
      <ClearKey
        isVisible={clearKeyFormVisible}
        formConfig={clearKeyFormConfig}
      />
      <VerifyBackup
        isVisible={verifyBackupVisible}
        formConfig={verifyBackupConfig}
      />
      <PushBackup isVisible={pushBackupVisible} formConfig={pushBackupConfig} />
      <header className="flex items-center justify-between w-full text-white">
        <div className="flex-1 min-w-0">
          <Breadcrumb items={breadcrumbs} />
        </div>

        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={toggleDropdown}
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-700">
              {profile?.avatarPath ? (
                <img
                  src={getMediaImage(profile.avatarPath)}
                  className="h-full w-full object-cover"
                  alt="User avatar"
                />
              ) : (
                <UserIcon size={20} className="text-white" />
              )}
            </div>
            <span className="text-sm hidden md:inline">{profile.fullName}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-900 py-2 shadow-lg transition-opacity duration-200 z-50">
              <OptionButton
                label={PAGE_CONFIG.PROFILE.label}
                onClick={() => handleClickButton(PAGE_CONFIG.PROFILE.path)}
              />
              <OptionButton
                label={PAGE_CONFIG.CHANGE_PASSWORD.label}
                onClick={() =>
                  handleClickButton(PAGE_CONFIG.CHANGE_PASSWORD.path)
                }
              />
              <OptionButton
                role={PAGE_CONFIG.INPUT_KEY.role}
                label={PAGE_CONFIG.INPUT_KEY.label}
                onClick={handleInputKey}
              />
              <OptionButton
                role={PAGE_CONFIG.CLEAR_KEY.role}
                label={PAGE_CONFIG.CLEAR_KEY.label}
                onClick={handleClearKey}
              />
              <OptionButton label="Đăng xuất" onClick={handleLogout} />
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default MainHeader;
