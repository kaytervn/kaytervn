import React, { useState } from "react";
import { Search, X } from "lucide-react";
import UserIcon from "../../assets/user_icon.png";
import useFetch from "../../hooks/useFetch";
import { decrypt } from "../../types/utils";
import { Message, UserProfile } from "../../models/profile/chat";

const MessageSearch = ({
  conversation,
  onMessageSelect,
  userCurrent,
}: {
  userCurrent: UserProfile | null;
  conversation: any;
  onMessageSelect: (id: string) => void;
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchComplete, setIsSearchComplete] = useState(false);
  const { get } = useFetch();

  const handleSearch = async (e: any) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setIsLoading(true);
      setIsSearchComplete(false);
      try {
        const res = await get(
          `/v1/message/list?conversation=${conversation._id}&content=${searchQuery}`
        );
        const data = await res.data.content;
        console.log("search result:", data);
        if (data.length > 0) {
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
        setIsSearchComplete(true);
      }
    }
  };

  return (
    <div className="relative">
      {!isSearchOpen ? (
        <button
          onClick={() => setIsSearchOpen(true)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Search size={20} className="text-gray-600" />
        </button>
      ) : (
        <div className="absolute right-0 top-0 flex items-center bg-white rounded-lg shadow-lg">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Tìm kiếm tin nhắn..."
            className="w-64 p-2 rounded-l-lg focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery("");
              setSearchResults([]);
            }}
            className="p-2 hover:bg-gray-100 rounded-r-lg"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
      )}

      {searchResults.length > 0 ? (
        <div className="absolute z-50 right-0 top-12 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg">
          {searchResults.map((message: Message) => (
            <div
              key={message._id}
              onClick={() => {
                onMessageSelect(message._id);
                setIsSearchOpen(false);
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b"
            >
              <div className="flex items-center space-x-2">
                <img
                  src={message.user.avatarUrl || UserIcon}
                  alt={message.user.displayName}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium text-sm">
                    {message.user.displayName}
                  </p>
                  <p className="text-xs text-gray-500">{message.createdAt}</p>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-700">
                {decrypt(message.content, userCurrent?.secretKey)}
              </p>
            </div>
          ))}
        </div>
      ) : isSearchComplete && !isLoading && searchQuery.trim() ? (
        <div className="absolute z-50 right-0 top-12 w-80 p-4 bg-white rounded-lg shadow-lg text-center">
          Không tìm thấy kết quả
        </div>
      ) : null}

      {isLoading && (
        <div className="absolute right-0 z-50 top-12 w-80 p-4 bg-white rounded-lg shadow-lg text-center">
          Đang tìm kiếm...
        </div>
      )}
    </div>
  );
};

export default MessageSearch;
