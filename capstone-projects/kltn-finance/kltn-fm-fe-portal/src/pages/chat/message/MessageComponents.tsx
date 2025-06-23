import { motion, AnimatePresence } from "framer-motion";
import { MESSAGE_REACTION_KIND_MAP } from "../../../components/config/PageConfig";
import {
  formatMessageTime,
  getMediaImage,
  getMimeType,
  getNestedValue,
  parseCustomDateString,
  truncateString,
} from "../../../services/utils";
import {
  ChevronRightIcon,
  Edit2Icon,
  MoreHorizontalIcon,
  ReplyIcon,
  ThumbsUpIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FileTypeIcon } from "../FileComponents";
import useApi from "../../../hooks/useApi";
import { BASIC_MESSAGES, SETTING_KEYS } from "../../../services/constant";

const ParentMessage = ({ parent, onClick }: any) => {
  return (
    <motion.div
      onClick={() => onClick(parent.id)}
      className="p-2 mb-2 bg-gray-800/50 rounded-lg border-l-4 border-blue-300/50 cursor-pointer hover:bg-gray-800/70 transition-all"
    >
      <p className="text-xs font-medium text-blue-400 truncate">
        {parent.sender.fullName}
      </p>
      {parent.isDeleted ? (
        <p
          className="text-sm italic text-gray-300"
          aria-label="Tin nhắn đã bị thu hồi"
        >
          {BASIC_MESSAGES.MESSAGE_DELETED}
        </p>
      ) : (
        <p className="text-xs text-gray-300 truncate">
          {parent.document
            ? "Đã gửi tệp đính kèm"
            : parent.content
            ? truncateString(parent.content, 50)
            : "Đã gửi một tin nhắn"}
        </p>
      )}
    </motion.div>
  );
};

const ReactionPicker = ({
  onAddReaction,
  onRemoveReaction,
  currentReaction,
  isSender,
  setShowReactionPicker,
}: any) => {
  return (
    <motion.div
      onMouseEnter={() => setShowReactionPicker(true)}
      onMouseLeave={() => setShowReactionPicker(false)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`absolute bottom-8 ${
        isSender ? "right-0" : "left-0"
      } bg-gray-800/90 backdrop-blur-md rounded-lg p-2 shadow-lg border border-gray-700/50 flex space-x-2 z-50`}
    >
      {Object.entries(MESSAGE_REACTION_KIND_MAP).map(([key, reaction]) => (
        <motion.button
          key={key}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{
            scale: { duration: 0.3, delay: 0.1 },
          }}
          onClick={() =>
            currentReaction === reaction.value
              ? onRemoveReaction()
              : onAddReaction(reaction.value)
          }
          className={`px-1 py-0.5 rounded-full ${
            currentReaction === reaction.value
              ? "bg-blue-700"
              : "hover:bg-gray-700/50"
          } transition-all`}
          aria-label={reaction.label}
        >
          <span className="text-current">{reaction.emoji}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};

const SeenAvatars = ({ seenMembers, totalSeenMembers }: any) => {
  const maxAvatars = 5;
  const displayedMembers = seenMembers?.slice(0, maxAvatars);
  const remainingCount = totalSeenMembers - maxAvatars;

  if (totalSeenMembers <= 0) return null;
  return (
    <div className="flex items-center mt-1">
      <div className="flex -space-x-1.5">
        {displayedMembers.map((member: any, index: any) => (
          <div
            key={member.id}
            className="w-4 h-4 rounded-full bg-gray-800 border border-gray-700 shadow-md overflow-hidden flex items-center justify-center group relative"
            style={{ zIndex: maxAvatars - index }}
            title={member.fullName || "User"}
          >
            {member.avatarPath ? (
              <img
                src={getMediaImage(member.avatarPath)}
                alt={member.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon size={10} className="text-gray-300" />
            )}
          </div>
        ))}

        {remainingCount > 0 && (
          <div
            className="w-4 h-4 rounded-full bg-gray-700 border border-gray-600 shadow-md flex items-center justify-center text-xs text-gray-300 font-medium"
            title={`${remainingCount} more ${
              remainingCount === 1 ? "person" : "people"
            }`}
          >
            <span className="text-[9px]">+{remainingCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const MessageTime = ({ createdDate }: any) => (
  <span className="text-xs text-gray-300/70 mt-1.5">
    {formatMessageTime(createdDate)}
  </span>
);

const AttachedFiles = ({ files, openModal }: any) => (
  <div className="mt-3 space-y-2">
    {files.map((file: any, idx: any) => (
      <motion.div
        key={idx}
        onClick={() => openModal(file)}
        whileHover={{ scale: 1.01 }}
        className="flex items-center space-x-2 bg-gray-800/80 backdrop-blur-sm p-2.5 rounded-lg cursor-pointer hover:bg-gray-750 border border-gray-700/30 transition-all"
      >
        <FileTypeIcon mimeType={getMimeType(file.name)} />
        <span className="text-sm truncate flex-1">{file.name}</span>
        <ChevronRightIcon size={16} className="text-gray-400" />
      </motion.div>
    ))}
  </div>
);

const ReactionCount = ({ totalReactions, messageReactions, onClick }: any) => {
  if (totalReactions <= 0) return null;

  const lastReaction = [...messageReactions]
    .reverse()
    .find((r) =>
      Object.values(MESSAGE_REACTION_KIND_MAP).some(
        (kind: any) => kind.value === r.kind
      )
    );

  const kind: any = lastReaction
    ? Object.values(MESSAGE_REACTION_KIND_MAP).find(
        (k: any) => k.value === lastReaction.kind
      )
    : null;

  if (!kind) return null;

  return (
    <div className="flex items-center mt-1.5 space-x-1">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center`}>
        <div onClick={onClick} className="text-current hover:cursor-pointer">
          {kind.emoji}
        </div>
      </div>
      <span className="text-xs text-gray-400">{totalReactions}</span>
    </div>
  );
};

const MessageActions = ({
  id,
  isReacted,
  matched,
  myReaction,
  onReplyMessage,
  isSender,
  onRecallMessage,
  isDeleted,
  onEditMessage,
  settings,
}: any) => {
  const allowSendMessage = getNestedValue(
    settings,
    SETTING_KEYS.ALLOW_SEND_MESSAGES
  );
  const { chatMessage } = useApi();
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const ReplyButton = () => {
    if (!allowSendMessage) return null;
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onReplyMessage(id)}
        className="text-gray-400 hover:text-white p-0.5 rounded-full hover:bg-gray-700/50 transition-all"
        aria-label="Trả lời tin nhắn"
      >
        <ReplyIcon size={16} />
      </motion.button>
    );
  };

  const ReactionButton = () => {
    return (
      <div
        className="relative"
        onMouseEnter={() => setShowReactionPicker(true)}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-white p-0.5 rounded-full hover:bg-gray-700/50 transition-all"
          aria-label="Thả phản ứng"
        >
          {isReacted && matched ? (
            <span className="text-current">{matched.emoji}</span>
          ) : (
            <ThumbsUpIcon size={16} />
          )}
        </motion.button>

        <AnimatePresence>
          {showReactionPicker && (
            <ReactionPicker
              setShowReactionPicker={setShowReactionPicker}
              onAddReaction={async (kind: any) => {
                setShowReactionPicker(false);
                await chatMessage.react({ messageId: id, kind });
              }}
              onRemoveReaction={async () => await chatMessage.remove(id)}
              currentReaction={myReaction}
              isSender={isSender}
            />
          )}
        </AnimatePresence>
      </div>
    );
  };

  const MenuButton = () => {
    return (
      <MessageMenuButton
        id={id}
        isSender={isSender}
        isDeleted={isDeleted}
        onRecallMessage={onRecallMessage}
        handleEdit={onEditMessage}
      />
    );
  };

  return (
    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {isSender ? (
        <>
          <ReplyButton />
          <ReactionButton />
          <MenuButton />
        </>
      ) : (
        <>
          <MenuButton />
          <ReactionButton />
          <ReplyButton />
        </>
      )}
    </div>
  );
};

const MessageMenuButton = ({
  id,
  isSender,
  onRecallMessage,
  handleEdit,
  isDeleted,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleShowActions = () => {
    const actionsToShow = [];
    if (isSender && !isDeleted) {
      actionsToShow.push({
        label: "Chỉnh sửa",
        onClick: () => {
          handleEdit(id);
          setIsOpen(false);
        },
        icon: Edit2Icon,
      });
      actionsToShow.push({
        label: "Thu hồi",
        onClick: () => {
          onRecallMessage(id);
          setIsOpen(false);
        },
        icon: TrashIcon,
      });
    }
    return actionsToShow;
  };

  const actions = handleShowActions();

  if (!actions.length) return null;

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-white p-0.5 rounded-full hover:bg-gray-700/50 transition-all"
        aria-label="Tùy chọn tin nhắn"
      >
        <MoreHorizontalIcon size={16} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${
              isSender ? "bottom-0 right-5" : "bottom-0 left-5"
            } mt-1 py-1 w-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50`}
          >
            {actions.map((action: any, index: any) => {
              const Icon = action.icon;
              return (
                <div
                  key={index}
                  onClick={action.onClick}
                  className="whitespace-nowrap flex items-center px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <Icon size={14} className="mr-2 text-gray-400" />
                  {action.label}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Avatar = ({ sender }: any) => {
  if (sender.avatarPath) {
    return (
      <img
        src={getMediaImage(sender.avatarPath)}
        className="w-8 h-8 rounded-full border border-gray-700 shadow-md"
        alt={`${sender.name}'s avatar`}
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 shadow-md flex items-center justify-center">
      <UserIcon size={18} className="text-gray-300" />
    </div>
  );
};

export {
  ParentMessage,
  ReactionPicker,
  SeenAvatars,
  MessageTime,
  AttachedFiles,
  ReactionCount,
  MessageActions,
  Avatar,
};
