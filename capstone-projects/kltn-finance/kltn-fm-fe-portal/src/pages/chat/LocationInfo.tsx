import { motion } from "framer-motion";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { getMediaImage, truncateString } from "../../services/utils";
import { KeyRoundIcon, MousePointer2Icon, XIcon } from "lucide-react";

const LocationInfo = ({ onBannerClick, onCloseSideBar, onRequestKey }: any) => {
  const { tenantInfo } = useGlobalContext();
  return (
    <div className="p-4 border-b border-gray-700/50 flex items-center justify-between bg-gray-800/30 backdrop-blur-md">
      <div className="flex items-center space-x-3">
        <div
          className="flex items-center space-x-3 cursor-pointer rounded-xl p-3 hover:bg-gray-700/50 transition-all duration-200"
          onClick={onBannerClick}
        >
          <div className="flex-shrink-0 h-10 w-10 relative overflow-hidden">
            {tenantInfo?.logoPath ? (
              <motion.img
                whileHover={{ scale: 1.1 }}
                src={getMediaImage(tenantInfo.logoPath)}
                className="w-full h-full object-cover rounded-lg shadow-md border border-gray-600/30"
                alt="Logo"
              />
            ) : (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md"
              >
                <MousePointer2Icon size={18} className="text-white" />
              </motion.div>
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold text-white whitespace-nowrap">
              {truncateString(tenantInfo?.name, 30) || "Chat App"}
            </h1>
            <p className="text-xs text-gray-400">Trò chuyện nội bộ</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRequestKey}
          title="Yêu cầu khóa"
          className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all"
        >
          <KeyRoundIcon size={18} />
        </motion.button>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onCloseSideBar}
        className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white lg:hidden"
      >
        <XIcon size={18} />
      </motion.button>
    </div>
  );
};

export default LocationInfo;
