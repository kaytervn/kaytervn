import { motion } from "framer-motion";
import { formatMessageTime, truncateString } from "../../../services/utils";
import { BASIC_MESSAGES, CHAT_HISTORY_ROLE } from "../../../services/constant";
import {
  AttachedFiles,
  Avatar,
  MessageActions,
  MessageTime,
  ParentMessage,
  ReactionCount,
  SeenAvatars,
} from "./MessageComponents";
import { MESSAGE_REACTION_KIND_MAP } from "../../../components/config/PageConfig";

const MessageItem = ({
  message,
  openModal,
  onRecallMessage,
  onEditMessage,
  onReplyMessage,
  onClickParentMessage,
  onReactionCountClick,
  settings,
  showAvatar,
}: any) => {
  const {
    isSender,
    content,
    document,
    createdDate,
    sender,
    isDeleted,
    isUpdated,
    isChildren,
    parent,
    seenMembers,
    totalSeenMembers,
    myReaction,
    isReacted,
    totalReactions,
    messageReactions,
    id,
  } = message;
  const { message: msg, role } = message;
  const isBot = [CHAT_HISTORY_ROLE.MODEL, CHAT_HISTORY_ROLE.USER].includes(
    role
  );
  const isUser = role === CHAT_HISTORY_ROLE.USER;
  const files = document ? JSON.parse(document) : [];
  const matched = Object.values(MESSAGE_REACTION_KIND_MAP).find(
    (item) => item.value === myReaction
  );
  const RenderSeenAvatars = () => {
    return (
      <div className="flex flex-col mx-1">
        <div
          className={`flex ${isSender ? "justify-end" : "justify-start"} mt-1`}
        >
          <div className="flex flex-1 space-x-1">
            <MessageActions
              id={id}
              isSender={isSender}
              isReacted={isReacted}
              isDeleted={isDeleted}
              matched={matched}
              totalReactions={totalReactions}
              myReaction={myReaction}
              onRecallMessage={onRecallMessage}
              onEditMessage={onEditMessage}
              onReplyMessage={onReplyMessage}
              settings={settings}
            />
          </div>
        </div>
        <div className="flex flex-1" />
        <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
          <SeenAvatars
            seenMembers={seenMembers}
            totalSeenMembers={totalSeenMembers}
          />
        </div>
      </div>
    );
  };

  const RenderMessageTime = () => {
    return <MessageTime createdDate={createdDate} />;
  };

  const RenderReactionCout = () => {
    return (
      <ReactionCount
        onClick={() => onReactionCountClick(messageReactions)}
        totalReactions={totalReactions}
        messageReactions={messageReactions}
      />
    );
  };

  return (
    <>
      {isBot ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          data-message-id={message.id}
          className={`flex ${
            isUser ? "justify-end" : "justify-start"
          } mb-2 group transition-all duration-300 mx-2`}
        >
          <div
            className={`max-w-[80%] sm:max-w-[60%] md:max-w-[50%] p-4 rounded-xl shadow-md ${
              isUser ? "bg-blue-600/80 text-white" : "bg-gray-700 text-gray-200"
            } ${isUser ? "rounded-br-sm" : "rounded-bl-sm"}`}
          >
            <p className="text-sm">{msg}</p>
            <div
              className={`${
                isUser ? "justify-end" : "justify-start"
              } flex items-center  mt-2 space-x-1`}
            >
              <p className="text-xs text-gray-300/70">
                {formatMessageTime(createdDate)}
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`flex ${
            isSender ? "justify-end" : "justify-start"
          } mb-2 group mx-2`}
        >
          {!isSender && showAvatar ? (
            <div className="mr-2 self-end">
              <Avatar sender={sender} />
            </div>
          ) : !isSender ? (
            <div className="mr-2 self-end w-8" />
          ) : (
            <RenderSeenAvatars />
          )}
          <div className="flex flex-col">
            <div
              className={`max-w-xs sm:max-w-md md:max-w-lg p-3 rounded-2xl shadow-md ${
                isSender
                  ? `bg-blue-600/90 text-white ${
                      !showAvatar ? "rounded" : "rounded-br-sm"
                    }`
                  : `bg-gray-700 text-gray-200 ${
                      !showAvatar ? "rounded" : "rounded-bl-sm"
                    }`
              } border ${
                isSender ? "border-blue-500/30" : "border-gray-700/30"
              }`}
            >
              {showAvatar && (
                <p className="text-sm font-semibold text-blue-200 mb-1 truncate">
                  {truncateString(sender.fullName, 30)}
                </p>
              )}
              {isChildren && parent && (
                <ParentMessage parent={parent} onClick={onClickParentMessage} />
              )}
              {isDeleted ? (
                <p
                  className="text-sm italic text-gray-300"
                  aria-label="Tin nhắn đã bị thu hồi"
                >
                  {BASIC_MESSAGES.MESSAGE_DELETED}
                </p>
              ) : (
                <p className="text-sm whitespace-pre-wrap truncate">
                  {content}
                  {isUpdated && (
                    <span className="text-xs italic text-gray-300 ml-1">
                      (đã chỉnh sửa)
                    </span>
                  )}
                </p>
              )}
              {document && files.length > 0 && (
                <AttachedFiles files={files} openModal={openModal} />
              )}
              <div className={`flex flex-row justify-between space-x-5`}>
                {isSender ? (
                  <>
                    <RenderMessageTime />
                    <RenderReactionCout />
                  </>
                ) : (
                  <>
                    <RenderReactionCout />
                    <RenderMessageTime />
                  </>
                )}
              </div>
            </div>
          </div>
          {isSender && showAvatar ? (
            <div className="ml-2 self-end">
              <Avatar sender={sender} />
            </div>
          ) : isSender ? (
            <div className="ml-2 self-end w-8" />
          ) : (
            <RenderSeenAvatars />
          )}
        </motion.div>
      )}
    </>
  );
};

const DateDivider = ({ date }: { date: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-center my-6"
  >
    <div className="bg-gray-800/70 backdrop-blur-sm text-gray-300 text-sm px-4 py-1 rounded-full shadow-md border border-gray-700/30">
      {date}
    </div>
  </motion.div>
);

export { MessageItem, DateDivider };
