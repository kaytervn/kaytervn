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
import { USER_CONFIG } from "../config/PageConfigDetails";
import { PAGE_CONFIG } from "../config/PageConfig";

const MainHeader = ({ breadcrumbs }: any) => {
  const { user, loading } = useApi();
  const { profile, setToast } = useGlobalContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();
  const {
    isModalVisible: requestKeyFormVisible,
    showModal: showRequestKeyForm,
    hideModal: hideRequestKeyForm,
    formConfig: requestKeyFormConfig,
  } = useModal();

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

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
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
                  label={PAGE_CONFIG.PROFILE.label}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate(PAGE_CONFIG.PROFILE.path);
                  }}
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
