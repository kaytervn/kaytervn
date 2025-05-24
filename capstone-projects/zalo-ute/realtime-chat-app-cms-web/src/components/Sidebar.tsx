import { useEffect, useState } from "react";
import {
  BellIcon,
  ChartPieIcon,
  FileTextIcon,
  LogOutIcon,
  SettingsIcon,
  ShieldEllipsisIcon,
  UserIcon,
  MenuIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from "lucide-react";
import logo from "../assets/cms.png";
import userImage from "../assets/user_icon.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ConfimationDialog } from "./Dialog";
import Notification from "./Notification";
import UpdateProfile from "./user/UpdateProfile";
import useFetch from "../hooks/useFetch";
import useDialog from "../hooks/useDialog";
import { useGlobalContext } from "../types/context";
import { ZALO_UTE_CMS_ACCESS_TOKEN } from "../types/constant";

const Sidebar = ({ activeItem, renderContent }: any) => {
  const { profile, setProfile, isCollapsed, setIsCollapsed } =
    useGlobalContext();
  const navigate = useNavigate();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { isDialogVisible, showDialog, hideDialog } = useDialog();
  const { get } = useFetch();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarVisible(false);
        setIsCollapsed(true);
      } else {
        setIsSidebarVisible(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    hideDialog();
    localStorage.removeItem(ZALO_UTE_CMS_ACCESS_TOKEN);
    navigate("/");
    window.location.reload();
  };

  const getProfile = async () => {
    if (localStorage.getItem(ZALO_UTE_CMS_ACCESS_TOKEN)) {
      const res = await get("/v1/user/profile");
      setProfile(res.data);
    }
  };

  const menuItems = [
    {
      name: "user",
      label: "Quản lý người dùng",
      icon: <UserIcon size={20} />,
      path: "/",
    },
    {
      name: "post",
      label: "Quản lý bài đăng",
      icon: <FileTextIcon size={20} />,
      path: "/post",
    },
    {
      name: "role",
      label: "Quản lý quyền",
      icon: <ShieldEllipsisIcon size={20} />,
      path: "/role",
    },
    {
      name: "setting",
      label: "Cài đặt",
      icon: <SettingsIcon size={20} />,
      path: "/setting",
    },
    {
      name: "statistic",
      label: "Thống kê",
      icon: <ChartPieIcon size={20} />,
      path: "/statistic",
    },
  ];

  const handleMenuItemClick = (itemName: any) => {
    const selectedItem = menuItems.find((item) => item.name === itemName);
    if (selectedItem) {
      navigate(selectedItem.path);
    }
    if (isMobile) {
      setIsSidebarVisible(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarVisible(!isSidebarVisible);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="flex min-h-screen">
      {isMobile && (
        <button
          className="fixed bottom-4 left-4 z-40 p-2 rounded-lg bg-blue-900 text-white"
          onClick={toggleSidebar}
        >
          <MenuIcon size={24} />
        </button>
      )}

      <div
        className={`
          ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-64"}
          fixed left-0 top-0
          transition-all duration-300 ease-in-out
          h-screen
          z-40
          md:translate-x-0
          overflow-hidden
        `}
      >
        <div className="h-full flex flex-col bg-gray-900 text-white overflow-y-auto">
          <div className="flex flex-col items-center m-2">
            <img
              src={logo}
              className={`${
                isCollapsed ? "w-16" : "w-64"
              } rounded-lg transition-all duration-300`}
              alt="Logo"
            />
          </div>

          <div
            onClick={() => setModalVisible(true)}
            className="flex items-center cursor-pointer hover:bg-gray-700 transition-colors rounded-lg mx-2 mb-2 p-2"
          >
            <img
              src={profile?.avatarUrl || userImage}
              className="w-10 h-10 rounded-full border-gray-600 border object-cover"
              alt="User Avatar"
            />
            {!isCollapsed && (
              <span className="ml-2 truncate">{profile?.displayName}</span>
            )}
          </div>

          <div className="relative">
            <button
              className="flex text-gray-300 items-center justify-center bg-gray-800 cursor-pointer hover:bg-gray-700 transition-colors rounded-lg mb-2 mx-2 p-2 w-[calc(100%-16px)]"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <BellIcon size={20} />
              {!isCollapsed && <span className="ml-2">Thông báo</span>}
            </button>
          </div>

          <nav className="flex-grow overflow-y-auto">
            <ul>
              {menuItems.map((item) => (
                <li key={item.name} className="mb-2">
                  <div
                    className={`flex items-center p-3 mx-2 rounded-lg cursor-pointer transition-colors
                      ${
                        activeItem === item.name
                          ? "bg-blue-500"
                          : "hover:bg-blue-700"
                      }
                      ${isCollapsed ? "justify-center" : ""}
                    `}
                    onClick={() => handleMenuItemClick(item.name)}
                  >
                    {item.icon}
                    {!isCollapsed && <span className="ml-2">{item.label}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-3 mt-auto">
            <button
              className="w-full bg-red-600 text-white rounded-lg hover:bg-red-800 transition-colors p-2"
              onClick={showDialog}
            >
              <div
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <LogOutIcon size={20} />
                {!isCollapsed && <span className="ml-2">Đăng xuất</span>}
              </div>
            </button>
          </div>

          <button
            className="flex items-center justify-center p-2 hover:bg-gray-700 transition-colors"
            onClick={toggleSidebar}
          >
            {isMobile ? (
              <XIcon size={24} className="text-gray-400" />
            ) : isCollapsed ? (
              <ChevronRightIcon size={24} className="text-gray-400" />
            ) : (
              <ChevronLeftIcon size={24} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`flex-1 transition-all duration-300 ${
          isMobile ? "ml-0" : isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <div className="p-6 min-h-screen">{renderContent}</div>
      </div>

      {isMobile && isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarVisible(false)}
        />
      )}

      <ToastContainer />
      <ConfimationDialog
        isVisible={isDialogVisible}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất?"
        onConfirm={handleLogout}
        confirmText="Đăng xuất"
        onCancel={hideDialog}
        color="red"
      />
      <UpdateProfile
        isVisible={isModalVisible}
        setVisible={setModalVisible}
        userId={profile?._id}
        onUpdate={getProfile}
      />
      <Notification isOpen={isNotificationOpen} setIsOpen={setIsNotificationOpen} />
    </div>
  );
};

export default Sidebar;
