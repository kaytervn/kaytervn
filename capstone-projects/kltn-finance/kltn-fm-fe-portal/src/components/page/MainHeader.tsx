import { useState, useRef, useEffect } from "react";
import { BellIcon, MessageSquareIcon, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import { useGlobalContext } from "../config/GlobalProvider";
import { configModalForm, ConfirmationDialog, LoadingDialog } from "./Dialog";
import useModal from "../../hooks/useModal";
import { removeSessionCache } from "../../services/storages";
import { getMediaImage } from "../../services/utils";
import { PAGE_CONFIG } from "../config/PageConfig";
import { OptionButton } from "../form/Button";
import ChangeLocation from "../../pages/auth/ChangeLocation";
import useApi from "../../hooks/useApi";
import RequestKey from "../../pages/auth/RequestKey";
import NotificationDialog from "../../pages/auth/NotificationDialog";

const MainHeader = ({ breadcrumbs }: any) => {
  const { auth, loading } = useApi();
  const { isCustomer, setToast } = useGlobalContext();
  const { profile } = useGlobalContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();
  const {
    isModalVisible: changeTenantFormVisible,
    showModal: showChangeTenantForm,
    hideModal: hideChangeTenantForm,
    formConfig: changeTenantFormConfig,
  } = useModal();
  const {
    isModalVisible: requestKeyFormVisible,
    showModal: showRequestKeyForm,
    hideModal: hideRequestKeyForm,
    formConfig: requestKeyFormConfig,
  } = useModal();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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

  const handleChangeCompany = () => {
    setIsDropdownOpen(false);
    showChangeTenantForm({
      title: "Chuyển công ty",
      hideModal: hideChangeTenantForm,
    });
  };

  const handleRequestKey = () => {
    setIsDropdownOpen(false);
    showRequestKeyForm(
      configModalForm({
        label: "Gửi yêu cầu khóa",
        fetchApi: auth.requestKey,
        setToast,
        hideModal: hideRequestKeyForm,
        initForm: {
          password: "",
        },
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
      <NotificationDialog
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
      <ChangeLocation
        isVisible={changeTenantFormVisible}
        formConfig={changeTenantFormConfig}
      />
      <RequestKey
        isVisible={requestKeyFormVisible}
        formConfig={requestKeyFormConfig}
      />
      <header className="flex items-center justify-between w-full text-white">
        <div className="flex-1 min-w-0">
          <Breadcrumb items={breadcrumbs} />
        </div>

        <div className="relative flex items-center space-x-4 flex-shrink-0">
          {!isCustomer && (
            <>
              <button
                className="relative focus:outline-none"
                onClick={() => setIsNotificationOpen(true)}
                title="Thông báo"
              >
                <BellIcon size={24} className="text-white" />
              </button>
              <button
                className="relative focus:outline-none"
                onClick={() => navigate("/chat")}
                title="Nhắn tin"
              >
                <MessageSquareIcon size={24} className="text-white" />
              </button>
            </>
          )}

          <div className="relative" ref={dropdownRef}>
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
              <span className="text-sm hidden md:inline">
                {profile?.fullName}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-12 w-48 rounded-lg bg-gray-900 py-2 shadow-xl z-50 ring-1 ring-gray-700">
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
                  label={"Gửi yêu cầu khóa"}
                  onClick={handleRequestKey}
                />
                {isCustomer && (
                  <OptionButton
                    label={"Chuyển công ty"}
                    onClick={handleChangeCompany}
                  />
                )}
                <OptionButton label="Đăng xuất" onClick={handleLogout} />
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default MainHeader;
