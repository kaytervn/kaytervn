import React, { useState } from "react";
import ChatItem from "./ChatItem";
import { Conversation, UserProfile } from "../../models/profile/chat";
import { Search, PlusCircle, Users } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";

interface ChatListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  userCurrent: UserProfile | null;
  handleConversationCreated: () => void;
}

const ChatList: React.FC<ChatListProps> = ({
  conversations,
  onSelectConversation,
  userCurrent,
  handleConversationCreated,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-y-auto h-full">
      <h2 className="text-xl font-semibold m-4 flex justify-between items-center">
        Cuộc trò chuyện
        <button
          onClick={() => setGroupModalOpen(true)}
          className="flex items-center text-base text-blue-500 hover:text-blue-700"
        >
          <Users className="mr-1" /> Tạo nhóm
        </button>
      </h2>

      <div className="m-4 relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm cuộc trò chuyện..."
          className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div>
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ChatItem
              key={conversation._id}
              conversation={conversation}
              onClick={() => onSelectConversation(conversation)}
              userCurrent={userCurrent}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">
            Không tìm thấy cuộc trò chuyện
          </p>
        )}
      </div>

      {/* Popup tạo nhóm */}
      {isGroupModalOpen && (
        <CreateGroupModal
          onClose={() => setGroupModalOpen(false)}
          userCurrent={userCurrent}
          handleConversationCreated={handleConversationCreated}
        />
      )}
    </div>
  );
};

export default ChatList;
