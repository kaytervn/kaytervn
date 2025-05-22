import React from "react";
import { Conversation, UserProfile } from "../../models/profile/chat";
import UserIcon from "../../assets/user_icon.png";
import { decrypt } from "../../types/utils";

interface ChatItemProps {
  conversation: Conversation;
  onClick: () => void;
  userCurrent: UserProfile | null;
  className?: string;
}

const ChatItem: React.FC<ChatItemProps> = ({
  conversation,
  onClick,
  userCurrent,
  className,
}) => {
  console.log("Conversation:", conversation);

  const hasUnreadMessages = conversation.totalUnreadMessages > 0;
  const backgroundClass = hasUnreadMessages ? "bg-blue-50" : "";

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center p-3 w-full border-b cursor-pointer hover:bg-gray-100
        ${backgroundClass}
        ${className}
      `}
    >
      <div className="relative">
        <img
          src={conversation.avatarUrl || UserIcon}
          alt="Avatar"
          className="rounded-full w-12 h-12 object-cover border-4 border-blue-100 shadow-lg"
        />
        {hasUnreadMessages && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {conversation.totalUnreadMessages}
          </div>
        )}
      </div>
      <div className="flex-1 max-w-72 ml-2">
        <h3 className="font-semibold flex justify-between">
          <span className={`${hasUnreadMessages ? "text-blue-600" : ""}`}>
            {conversation.name}
          </span>
          <span className="text-xs text-gray-500 ml-auto mt-1">
            {conversation.lastMessage
              ? conversation.lastMessage.createdAt
              : " "}
          </span>
        </h3>
        <p
          className={`text-sm truncate mt-1 ${
            hasUnreadMessages ? "text-gray-900" : "text-gray-600"
          }`}
        >
          {conversation.lastMessage ? (
            <>
              <span>
                {conversation.lastMessage.user.displayName.length > 15
                  ? conversation.lastMessage.user.displayName.slice(0, 15) +
                    "..."
                  : conversation.lastMessage.user.displayName}
                :{" "}
              </span>
              {(() => {
                const decryptedContent = decrypt(
                  conversation.lastMessage.content,
                  userCurrent?.secretKey
                );
                return decryptedContent.length > 20
                  ? decryptedContent.slice(0, 20) + "..."
                  : decryptedContent;
              })()}
            </>
          ) : (
            " "
          )}
        </p>
      </div>
    </div>
  );
};

export default ChatItem;
