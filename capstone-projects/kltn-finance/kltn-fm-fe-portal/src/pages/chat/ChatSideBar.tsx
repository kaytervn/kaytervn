import {
  SearchIcon,
  XIcon,
  PlusIcon,
  MessageCircleOffIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/Sidebar.css";
import ConversationItem from "./ConversationItem";
import LocationInfo from "./LocationInfo";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { GridViewLoading } from "../../components/page/GridView";
import { useEffect, useRef } from "react";
import { Virtuoso } from "react-virtuoso";

const ChatSideBar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  handleRequestKey,
  searchConversations,
  setSearchConversations,
  onRefreshButtonClick,
  activeTab,
  setActiveTab,
  loadingChatRoomList,
  filteredConversations,
  selectedConversation,
  handleSelectConversation,
  onCreateRoomButtonClick,
}: any) => {
  const { isSystemNotReady, sessionKey } = useGlobalContext();
  const navigate = useNavigate();

  const virtuosoRef = useRef<any>(null);

  const renderConversationItem = (index: any) => {
    const conversation = filteredConversations[index];
    return (
      <ConversationItem
        key={conversation.id}
        conversation={conversation}
        selected={selectedConversation?.id === conversation.id}
        onClick={() => handleSelectConversation(conversation.id)}
      />
    );
  };

  useEffect(() => {
    if (selectedConversation && virtuosoRef.current) {
      const selectedIndex = filteredConversations.findIndex(
        (conv: any) => conv.id === selectedConversation.id
      );
      if (selectedIndex !== -1) {
        virtuosoRef.current.scrollToIndex({
          index: selectedIndex,
          align: "center",
          behavior: "smooth",
        });
      }
    }
  }, [selectedConversation]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -400 }}
        animate={{ x: isSidebarOpen ? 0 : -400 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`z-30 fixed inset-y-0 left-0 w-[340px] bg-gray-800/70 backdrop-blur-md border-r border-gray-700/50 flex flex-col lg:static ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <LocationInfo
          onBannerClick={() => navigate("/")}
          onCloseSideBar={() => setIsSidebarOpen(false)}
          onRequestKey={handleRequestKey}
        />
        {isSystemNotReady || (!sessionKey && !isSystemNotReady) ? (
          <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-800/50 rounded-lg my-auto">
            <MessageCircleOffIcon
              size={48}
              className="text-gray-500 mb-4"
              strokeWidth={1.5}
            />
            <p className="text-lg font-medium text-gray-300 text-center">
              Các cuộc trò chuyện không có sẵn
            </p>
          </div>
        ) : (
          <>
            <div className="p-4 space-y-3">
              <div className="relative">
                <SearchIcon
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchConversations}
                  onChange={(e) => setSearchConversations(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full pl-10 pr-10 p-3 bg-gray-700/50 border border-gray-600/30 rounded-xl text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
                {searchConversations ? (
                  <button
                    onClick={() => setSearchConversations("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                    aria-label="Xóa nội dung tìm kiếm"
                  >
                    <XIcon size={16} />
                  </button>
                ) : (
                  <button
                    onClick={onRefreshButtonClick}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                    aria-label="Làm mới danh sách"
                  >
                    <RefreshCwIcon size={16} />
                  </button>
                )}
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "all"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-gray-700/50 text-gray-400 hover:bg-gray-600/50"
                  }`}
                >
                  Tất cả
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("unread")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "unread"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-gray-700/50 text-gray-400 hover:bg-gray-600/50"
                  }`}
                >
                  Chưa đọc
                </motion.button>
              </div>
            </div>
            {loadingChatRoomList ? (
              <div className="flex-1">
                <GridViewLoading loading={loadingChatRoomList} />
              </div>
            ) : (
              <div className="flex-1 px-2 space-y-2">
                {filteredConversations.length > 0 ? (
                  <Virtuoso
                    ref={virtuosoRef}
                    style={{ height: "100%" }}
                    totalCount={filteredConversations.length}
                    itemContent={renderConversationItem}
                    computeItemKey={(index) =>
                      filteredConversations[index]?.id || index
                    }
                    className="virtuoso-conversations"
                  />
                ) : (
                  <p className="p-4 text-gray-400 text-center">
                    Không tìm thấy cuộc trò chuyện
                  </p>
                )}
              </div>
            )}
            <div className="p-4 border-t border-gray-700/50">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCreateRoomButtonClick}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all"
              >
                <PlusIcon size={18} />
                <span>Cuộc trò chuyện mới</span>
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatSideBar;
