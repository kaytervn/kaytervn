import { useEffect, useRef, useState } from "react";
import useApi from "../../../hooks/useApi";
import { useGlobalContext } from "../../config/GlobalProvider";
import useModal from "../../../hooks/useModal";
import { LOCAL_STORAGE, TOAST } from "../../../types/constant";
import { N_LESSONS_CONFIG } from "../../config/PageConfigDetails";
import { ConfirmationDialog, LoadingDialog } from "../../form/Dialog";
import { Breadcrumb2 } from "../Breadcrumb";
import { MenuIcon } from "lucide-react";
import { OptionButton } from "../../form/Button";
import { useNavigate } from "react-router-dom";
import { GORGEOUS_SWAGGER } from "../../../types/pageConfig";

const NLessonsMainHeader = ({ breadcrumbs }: any) => {
  const navigate = useNavigate();
  const { media, loading } = useApi();
  const { setToast } = useGlobalContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/x-zip-compressed") {
      setToast("Định dạng tệp không hợp lệ", TOAST.ERROR);
      return;
    }
    const res = await media.pushBackup(file);
    if (res.result) {
      setToast("Nhập tệp thành công", TOAST.SUCCESS);
    } else {
      setToast(res.message, TOAST.ERROR);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      title: "Đăng xuất",
      message: "Bạn có chắc chắn muốn đăng xuất không?",
      confirmText: "Thoát",
      color: "crimson",
      onConfirm: () => {
        hideModal();
        localStorage.removeItem(LOCAL_STORAGE.N_LESSONS_API_KEY);
        window.location.href = N_LESSONS_CONFIG.CLIENT.path;
      },
      onCancel: () => {
        hideModal();
      },
    });
  };

  const handleDownLoadBackup = async () => {
    setIsDropdownOpen(false);
    const res = await media.downloadBackup();
    if (res.result) {
      setToast("Tải xuống thành công", TOAST.SUCCESS);
    } else {
      setToast(res.message, TOAST.ERROR);
    }
  };

  const handlePushBackup = () => {
    setIsDropdownOpen(false);
    fileInputRef.current?.click();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <>
      <input
        type="file"
        accept=".zip"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
      />
      <LoadingDialog isVisible={loading} />
      <ConfirmationDialog isVisible={isModalVisible} formConfig={formConfig} />
      <header className="flex items-center justify-between w-full text-white">
        <div className="flex-1 min-w-0">
          <Breadcrumb2 items={breadcrumbs} />
        </div>

        <div className="relative flex items-center space-x-4 flex-shrink-0">
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={toggleDropdown}
            >
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-700">
                <MenuIcon size={20} className="text-white" />
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-12 w-48 rounded-lg bg-gray-900 py-2 shadow-xl z-50 ring-1 ring-gray-700">
                <OptionButton
                  label={GORGEOUS_SWAGGER.label}
                  onClick={() => navigate(GORGEOUS_SWAGGER.path)}
                />
                <OptionButton
                  label={"Trang chủ"}
                  onClick={() => navigate(N_LESSONS_CONFIG.CLIENT.path)}
                />
                <OptionButton
                  label={"Tải tệp khôi phục"}
                  onClick={handleDownLoadBackup}
                />
                <OptionButton
                  label={"Nhập tệp khôi phục"}
                  onClick={handlePushBackup}
                />
                <OptionButton label="Thoát" onClick={handleLogout} />
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default NLessonsMainHeader;
