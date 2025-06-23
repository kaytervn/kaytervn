import { motion } from "framer-motion";
import {
  formatMessageTime,
  getMediaImage,
  truncateString,
} from "../../services/utils";
import { UserIcon, UsersIcon } from "lucide-react";
import { CHAT_ROOM_KIND_MAP } from "../../services/constant";
import { GEMINI_BOT_CONFIG } from "../../components/config/PageConfig";

const ConversationItem = ({ conversation, selected, onClick }: any) => {
  const lastMessage = conversation?.lastMessage;
  const isBot = conversation?.kind === GEMINI_BOT_CONFIG.kind;
  const isUnread = conversation?.totalUnreadMessages > 0;
  return (
    <>
      {isBot ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className={`relative flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 m-2 ${
              selected
                ? "bg-blue-500/10 border border-blue-500/20"
                : "hover:bg-gray-700/50"
            }`}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-blue-900 border border-gray-600 shadow-md flex items-center justify-center">
                <GEMINI_BOT_CONFIG.icon className="text-gray-300" />
              </div>
            </div>
            <div className="flex-1 ml-3">
              <div className="flex justify-between items-center space-y-2">
                <span
                  className={`font-medium ${
                    selected ? "text-blue-400" : "text-gray-200"
                  }`}
                >
                  {GEMINI_BOT_CONFIG.name}
                </span>
              </div>
              <p className={`text-sm truncate text-gray-400`}>
                {truncateString(GEMINI_BOT_CONFIG.description, 30)}
              </p>
            </div>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClick}
          className={`relative flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 m-2 ${
            selected
              ? "bg-blue-500/10 border border-blue-500/20"
              : "hover:bg-gray-700/50"
          }`}
        >
          <div className="relative">
            {conversation.avatar ? (
              <img
                src={getMediaImage(conversation.avatar)}
                className="w-12 h-12 rounded-full object-cover shadow-md border border-gray-600"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-700 border border-gray-600 shadow-md flex items-center justify-center">
                {CHAT_ROOM_KIND_MAP.DIRECT_MESSAGE.value ===
                conversation.kind ? (
                  <UserIcon className="text-gray-300" />
                ) : (
                  <UsersIcon className="text-gray-300" />
                )}
              </div>
            )}
            {CHAT_ROOM_KIND_MAP.DIRECT_MESSAGE.value === conversation.kind &&
              conversation.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
              )}
          </div>
          <div className="flex-1 ml-3">
            <div className="flex justify-between items-center space-x-5">
              <span
                className={`font-medium ${
                  selected ? "text-blue-400" : "text-gray-200"
                }`}
              >
                {conversation.name}
              </span>
              <span className="text-xs text-gray-400">
                {formatMessageTime(lastMessage?.createdDate)}
              </span>
            </div>
            {lastMessage?.sender?.fullName && (
              <>
                {lastMessage?.isDeleted ? (
                  <p
                    className={`text-sm italic ${
                      isUnread ? "text-gray-200" : "text-gray-400"
                    }`}
                    aria-label="Tin nhắn đã bị thu hồi"
                  >
                    {truncateString(
                      `${lastMessage?.sender?.fullName} thu hồi tin nhắn`,
                      30
                    )}
                  </p>
                ) : (
                  <p
                    className={`text-sm truncate ${
                      isUnread ? "text-gray-200" : "text-gray-400"
                    }`}
                  >
                    {lastMessage?.document
                      ? truncateString(
                          `${lastMessage?.sender?.fullName} gửi tệp đính kèm`,
                          30
                        )
                      : lastMessage?.content
                      ? truncateString(
                          `${lastMessage?.sender?.fullName}: ${lastMessage?.content}`,
                          30
                        )
                      : truncateString(
                          `${lastMessage?.sender?.fullName} gửi một tin nhắn`,
                          30
                        )}
                  </p>
                )}
              </>
            )}
          </div>
          {isUnread && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-opacity-65 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">
                {conversation.totalUnreadMessages}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </>
  );
};

export default ConversationItem;
