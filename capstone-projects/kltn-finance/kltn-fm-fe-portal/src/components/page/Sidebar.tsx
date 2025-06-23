import {
  ChevronDownIcon,
  ChevronUpIcon,
  MousePointer2Icon,
  MenuIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../config/GlobalProvider";
import { useEffect, useState, useRef } from "react";
import { LOCAL_STORAGE } from "../../services/constant";
import { getStorageData, setStorageData } from "../../services/storages";
import MainHeader from "./MainHeader";
import UnauthorizedDialog from "../../pages/auth/UnauthorizedDialog";
import { getMediaImage } from "../../services/utils";
import NotReadyDialog from "../../pages/auth/NotReadyDialog";
import { PAGE_CONFIG, SESSION_KEY_PAGES } from "../config/PageConfig";
import InputSessionKey from "../../pages/auth/InputSessionKey";
import "../../styles/Sidebar.css";

const Sidebar = ({ activeItem, breadcrumbs, renderContent }: any) => {
  const {
    tenantInfo,
    collapsedGroups,
    setCollapsedGroups,
    getSidebarMenus,
    isSystemNotReady,
    sessionKey,
  } = useGlobalContext();
  const navigate = useNavigate();
  const menuGroups = getSidebarMenus();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const activeItemRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const findActiveGroup = () => {
    for (const group of menuGroups) {
      for (const item of group.items) {
        if (item.name === activeItem) {
          return group.name;
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const smoothScrollTo = (
    element: HTMLElement,
    target: number,
    duration: number
  ) => {
    const start = element.scrollTop;
    const change = target - start;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      element.scrollTop = start + change * ease;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    const scrollToActiveItem = () => {
      if (activeItemRef.current && navRef.current) {
        const nav = navRef.current;
        const item = activeItemRef.current;

        const activeGroup = findActiveGroup();
        if (activeGroup && collapsedGroups[activeGroup]) {
          setCollapsedGroups((prev) => ({
            ...prev,
            [activeGroup]: false,
          }));
        }

        setTimeout(() => {
          if (activeItemRef.current && navRef.current) {
            const navRect = nav.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();

            const scrollTop =
              item.offsetTop -
              nav.offsetTop -
              navRect.height / 2 +
              itemRect.height / 2;

            smoothScrollTo(nav, scrollTop, 600);
          }
        }, 250);
      }
    };

    const loadAndScroll = async () => {
      const savedGroups = getStorageData(LOCAL_STORAGE.COLLAPSED_GROUPS, {});
      setCollapsedGroups(savedGroups);
      setTimeout(scrollToActiveItem, 100);
    };

    loadAndScroll();
  }, [activeItem, setCollapsedGroups]);

  const handleMenuItemClick = (itemName: string) => {
    const selectedItem = menuGroups
      .flatMap((group) => group.items)
      .find((item) => item.name === itemName);
    if (selectedItem) {
      navigate(selectedItem.path);
      if (isMobile) setIsSidebarOpen(false);
    }
  };

  const handleMyLocationClick = () => {
    navigate(PAGE_CONFIG.LOCATION.path);
    if (isMobile) setIsSidebarOpen(false);
  };

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups((prev) => {
      const updatedGroups = { ...prev, [groupName]: !prev[groupName] };
      setStorageData(LOCAL_STORAGE.COLLAPSED_GROUPS, updatedGroups);
      return updatedGroups;
    });
  };

  const isSessionKeyTimeout = () => {
    return (
      SESSION_KEY_PAGES.has(activeItem) && !sessionKey && !isSystemNotReady
    );
  };

  return (
    <>
      <UnauthorizedDialog />
      <div className="flex min-h-screen bg-gray-800">
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div
          className={`
            fixed top-0 left-0 h-screen 
            bg-gray-950 text-white
            transition-all duration-300 ease-in-out
            z-20 w-64 shadow-lg
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            ${!isMobile ? "translate-x-0" : ""}
            overflow-hidden group
          `}
        >
          <div className="h-full flex flex-col">
            <div className="relative">
              <div
                className="flex items-center m-2 space-x-3 cursor-pointer rounded-md p-3 bg-gray-800 hover:bg-gray-700 transition-all duration-200"
                onClick={handleMyLocationClick}
              >
                <div className="flex-shrink-0 h-10 w-10 relative overflow-hidden">
                  {tenantInfo?.logoPath ? (
                    <img
                      src={getMediaImage(tenantInfo.logoPath)}
                      className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-200"
                      alt="Logo"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-blue-500 hover:scale-105">
                      <MousePointer2Icon size={18} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-white truncate">
                    {tenantInfo?.name || "App Name"}
                  </h1>
                </div>
              </div>
            </div>

            <nav
              className="flex-grow overflow-y-auto space-y-1 px-2 sidebar-scrollbar"
              ref={navRef}
            >
              {menuGroups.map((group) => (
                <div key={group.name} className="mb-1">
                  <div
                    className={`
                      text-sm flex justify-between items-center p-2.5
                      rounded-lg cursor-pointer transition-all duration-200
                      ${
                        collapsedGroups[group.name]
                          ? "bg-gray-800 mb-1"
                          : "bg-gray-900 mb-1"
                      }
                      hover:bg-opacity-90
                    `}
                    onClick={() => toggleGroupCollapse(group.name)}
                  >
                    <div className="flex items-center font-medium">
                      <span className="inline-flex items-center w-4 h-4 mr-2 justify-center text-white">
                        {group.icon}
                      </span>
                      <span>{group.name}</span>
                    </div>
                    <span className="text-gray-200 transition-transform duration-200">
                      {collapsedGroups[group.name] ? (
                        <ChevronDownIcon size={16} />
                      ) : (
                        <ChevronUpIcon size={16} />
                      )}
                    </span>
                  </div>

                  <div
                    className={`
                      overflow-hidden transition-all duration-200
                      ${
                        collapsedGroups[group.name]
                          ? "max-h-0 opacity-0"
                          : "max-h-96 opacity-100"
                      }
                    `}
                  >
                    <ul className="pl-2 space-y-1">
                      {group.items.map((item: any) => (
                        <li key={item.name}>
                          <div
                            ref={
                              activeItem === item.name ? activeItemRef : null
                            }
                            className={`
                              text-sm flex items-center p-2 rounded-md cursor-pointer
                              transition-all duration-200 pl-6
                              ${
                                activeItem === item.name
                                  ? "bg-blue-700 text-white shadow-md"
                                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
                              }
                            `}
                            onClick={() => handleMenuItemClick(item.name)}
                          >
                            <span className="truncate">{item.label}</span>
                            {activeItem === item.name && (
                              <span className="ml-auto h-2 w-2 rounded-full bg-white"></span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </nav>

            <div className="p-4 text-xs text-gray-500 border-t border-gray-800">
              <p>Version: 1.0</p>
            </div>
          </div>
        </div>

        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
            !isMobile ? "ml-64" : ""
          }`}
        >
          <header className="bg-gray-800 border-b border-gray-700 shadow-md">
            <div className="p-4 flex items-center">
              {isMobile && (
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 mr-3 rounded-lg bg-gray-700 hover:bg-gray-600 focus:outline-none text-white transition-colors"
                >
                  <MenuIcon size={20} />
                </button>
              )}

              <div className="flex-1">
                <MainHeader breadcrumbs={breadcrumbs} />
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 bg-gray-800 overflow-auto">
            {isSystemNotReady ? (
              <NotReadyDialog
                color="goldenrod"
                message="Vui lòng liên hệ với quản trị viên để kích hoạt hệ thống"
                title="Hệ thống chưa sẵn sàng"
              />
            ) : isSessionKeyTimeout() ? (
              <InputSessionKey />
            ) : (
              renderContent
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
