import React, { useState, useEffect, useRef, useCallback } from "react";
import useFetch from "../../hooks/useFetch";
import useSocketChat from "../../hooks/useSocketChat";
import {
  Message,
  Friends,
  ChatWindowProps,
  ConversationMembers,
} from "../../models/profile/chat";
import UserIcon from "../../assets/user_icon.png";
import {
  MoreVertical,
  Edit,
  Trash,
  X,
  Check,
  UserPlus,
  Settings,
  Heart,
  ImageIcon,
  XIcon,
  UserRoundMinus,
  LogOut,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertErrorDialog,
  ConfimationDialog,
  LoadingDialog,
} from "../Dialog";
import { encrypt, decrypt, uploadImage } from "../../types/utils";
import { remoteUrl } from "../../types/constant";
import MessageSearch from "./MessageSearch";
import EditProfileDialog from "./EditProfilePopup";
import EditProfilePopup from "./EditProfilePopup";
import { set } from "react-datepicker/dist/date_utils";
import { useNavigate } from "react-router-dom";
import UserInfoPopup from "./UserInfoPopup";
import { on } from "events";
import { useProfile } from "../../types/UserContext";

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  userCurrent,
  onMessageChange,
  onConversationUpdateInfo,
  handleLeaveGroupUpdate,
  handleConversationDeleted,
  onFowardMessage,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [editedImageUrl, setEditedImageUrl] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [friends, setFriends] = useState<Friends[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { get, post, del, put, loading } = useFetch();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const scrollContainerRef = useRef<null | HTMLDivElement>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAlertErrorDialogOpen, setIsAlertErrorDialogOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(0);
  const [isCanUpdate, setIsCanUpdate] = useState<Number>();
  const [isCanMessage, setIsCanMessage] = useState<Number>();
  const [isCanAddMember, setIsCanAddMember] = useState<Number>();
  const [conversationMembersIdList, setConversationMembersIdList] = useState<
    string[]
  >([]);
  const [isManageMembersModalOpen, setIsManageMembersModalOpen] =
    useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const size = 20;
  const [isScrollToBottom, setIsScrollToBottom] = useState(false);
  const [updatedGroupName, setUpdatedGroupName] = useState(conversation.name);
  const [avatar, setAvatar] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // add member
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isConfirmLeaveDialogOpen, setIsConfirmLeaveDialogOpen] =
    useState(false);
  // delete member
  const [isMemberListOpen, setIsMemberListOpen] = useState(false);
  const [membersList, setMembersList] = useState<ConversationMembers[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [isConfirmDelMemDialogOpen, setIsConfirmDelMemDialogOpen] =
    useState(false);
  const [memberIdSelected, setMemberIdSelected] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const { profile } = useProfile();

  const handleAvatarClick = (user: any) => {
    setSelectedUser(user);
  };

  const closePopup = () => {
    setSelectedUser(null);
  };

  useEffect(() => {
    const fetchMembersList = async () => {
      setLoadingMembers(true);
      try {
        const response = await get(`/v1/conversation-member/list`, {
          conversation: conversation._id,
        });

        if (response?.data?.content) {
          setMembersList(response.data.content);
        } else {
          console.error("Không có dữ liệu thành viên");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thành viên:", error);
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchMembersList();
  }, [conversation._id]);

  console.log("Members list:", membersList);

  // Get member list
  const handleOpenMemberList = async () => {
    setLoadingMembers(true);
    setIsMemberListOpen(true);
    try {
      const response = await get(`/v1/conversation-member/list`, {
        conversation: conversation._id,
      });
      if (response.result) {
        setMembersList(response.data.content);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thành viên:", error);
    } finally {
      setLoadingMembers(false);
    }
  };

  // Delete member
  const handleRemoveMember = async (memberId: string | null) => {
    setLoadingUpdate(true);
    try {
      const response = await del(`/v1/conversation-member/remove/${memberId}`);
      if (response.result) {
        setMembersList((prev) =>
          prev.filter((member) => member._id !== memberId)
        );
        onConversationUpdateInfo(conversation);
      } else {
        alert("Xóa thành viên thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa thành viên:", error);
      alert("Đã xảy ra lỗi khi xóa thành viên.");
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Disband group
  const handleDisbandGroup = async () => {
    setLoadingUpdate(true);
    try {
      await deleteConversation(conversation._id);
      handleConversationDeleted();
      setIsManageMembersModalOpen(false);
      onConversationUpdateInfo(conversation);
    } catch (error) {
      console.error("Lỗi khi giải tán nhóm:", error);
      alert("Đã xảy ra lỗi khi giải tán nhóm. Vui lòng thử lại sau.");
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Leave group
  const handleLeaveGroup = async (memberId: string | null) => {
    setLoadingUpdate(true);
    try {
      await del(`/v1/conversation-member/remove/${memberId}`);
      handleConversationDeleted();
      setIsManageMembersModalOpen(false);
      handleLeaveGroupUpdate(conversation);
    } catch (error) {
      console.error("Lỗi khi rời nhóm:", error);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const deleteConversation = async (conversationId: any) => {
    try {
      const response = await del(`/v1/conversation/delete/${conversationId}`);
      if (response.result) {
        console.log("Xóa nhóm thành công:", response);
      }
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra khi giải tán nhóm.");
    }
  };

  const filteredFriends = friends.filter((friend) =>
    friend.friend.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMember = (userId: string) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.includes(userId)
        ? prevMembers.filter((id) => id !== userId)
        : [...prevMembers, userId]
    );
  };

  const handleNewMessage = useCallback(
    async (messageId: string) => {
      try {
        const res = await get(`/v1/message/get/${messageId}`);
        const newMessage = res.data;
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
        setIsScrollToBottom(true);
        onMessageChange();
      } catch (error) {
        console.error("Error fetching new message:", error);
      }
    },
    [get, onMessageChange]
  );

  const handleUpdateMessageSocket = useCallback(
    async (messageId: string) => {
      console.log("Updating message socket:", messageId);
      try {
        const resMessage = await get(`/v1/message/get/${messageId}`);
        const updatedMessage = resMessage.data;

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === updatedMessage._id ? updatedMessage : msg
          )
        );
        onMessageChange();
      } catch (error) {
        console.error("Error fetching updated message and reactions:", error);
      }
    },
    [get, onMessageChange]
  );

  const handleDeleteMessageSocket = useCallback(
    (messageId: string) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== messageId)
      );
      onMessageChange();
    },
    [onMessageChange]
  );

  const handleUpdateConversationSocket = useCallback(
    async (conversationId: string) => {
      // console.log("Updating message socket:", messageId);
      try {
        const resMessage = await get(`/v1/conversation/get/${conversationId}`);
        setIsCanUpdate(resMessage.data.canUpdate);
        setIsCanMessage(resMessage.data.canMessage);
        setIsCanAddMember(resMessage.data.canAddMember);
        // onMessageChange();
      } catch (error) {
        console.error("Error fetching updated message and reactions:", error);
      }
    },
    [get]
  );

  useSocketChat({
    conversationId: conversation._id,
    userId: userCurrent?._id,
    remoteUrl,
    onNewMessage: handleNewMessage,
    onUpdateMessage: handleUpdateMessageSocket,
    onDeleteMessage: handleDeleteMessageSocket,
    onConversationUpdate: onMessageChange,
    onHandleUpdateConversation: handleUpdateConversationSocket,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    setIsScrollToBottom(false);
  }, [isScrollToBottom]);

  useEffect(() => {
    getOwner();
  }, [conversation]);

  const getOwner = () => {
    if (conversation.isOwner === 1) {
      setIsOwner(conversation.owner._id === userCurrent?._id ? 1 : 0);
    }
  };

  const fetchMessages = useCallback(
    async (pageNumber: number) => {
      if (!conversation._id) return;
      setIsLoadingMessages(true);

      try {
        setIsCanUpdate(conversation.canUpdate);
        setIsCanMessage(conversation.canMessage);
        setIsCanAddMember(conversation.canAddMember);

        const response = await get("/v1/message/list", {
          page: pageNumber,
          size,
          conversation: conversation._id,
        });

        console.log("Response messages:", response.data.content);
        const newMessages = response.data.content;
        if (pageNumber === 0) {
          setMessages([...newMessages]);
          setIsScrollToBottom(true);
        } else {
          setMessages((prev) => [...prev, ...newMessages]);
        }
        setHasMore(newMessages.length === size);
        setPage(pageNumber);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [conversation._id, get, userCurrent?._id]
  );

  const handleScroll = async () => {
    if (
      scrollContainerRef.current &&
      scrollContainerRef.current.scrollTop === 0 &&
      !isLoadingMessages &&
      hasMore
    ) {
      const firstMessage = scrollContainerRef.current.firstElementChild;
      const previousScrollTop = scrollContainerRef.current.scrollTop;
      const previousOffsetTop = firstMessage
        ? (firstMessage as HTMLElement).offsetTop
        : 0;

      await fetchMessages(page + 1);

      if (firstMessage) {
        scrollContainerRef.current.scrollTop =
          (firstMessage as HTMLElement).offsetTop -
          previousOffsetTop +
          previousScrollTop;
      }
    }
  };

  useEffect(() => {
    fetchMessages(0);
  }, [fetchMessages]);

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (!newMessage && !selectedImage) return;
    setIsSendingMessage(true);

    let imageUrl: string | null = null;

    if (selectedImage) {
      imageUrl = await uploadImage(selectedImage, post);
    }

    console.log("Image URL:", imageUrl);

    try {
      const encryptedMessage = encrypt(
        newMessage.trim(),
        userCurrent?.secretKey
      );
      await post("/v1/message/create", {
        conversation: conversation._id,
        content: encryptedMessage,
        imageUrl: imageUrl,
      });

      setNewMessage("");
      removeSelectedImage();
    } catch (error) {
      console.error("Error creating message:", error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleDeleteMessage = async (messageId: any) => {
    try {
      await del(`/v1/message/delete/${messageId}`);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleUpdateMessage = async (messageId: any) => {
    try {
      const encryptedMessage = encrypt(
        editedMessage.trim(),
        userCurrent?.secretKey
      );

      await put("/v1/message/update", {
        id: messageId,
        content: encryptedMessage,
        imageUrl: editedImageUrl,
      });
      setEditingMessageId(null);
      setEditedMessage("");
      setEditedImageUrl("");
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Có lỗi xảy ra khi cập nhật tin nhắn");
    }
  };

  const handleReaction = async (messageId: any) => {
    try {
      if (messages.find((msg) => msg._id === messageId)?.isReacted === 1) {
        await del(`/v1/message-reaction/delete/${messageId}`);
      } else {
        await post("/v1/message-reaction/create", {
          message: messageId,
        });
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
    }
  };

  const toggleDropdown = (messageId: string) => {
    setActiveDropdown(activeDropdown === messageId ? null : messageId);
  };

  const fetchFriends = async () => {
    try {
      const response = await get("/v1/friendship/list", {
        getListKind: 0,
      });
      console.log("List ban be:", response.data.content);
      setFriends(response.data.content);

      const membersResponse = await get(`/v1/conversation-member/list`, {
        conversation: conversation._id,
      });
      setConversationMembersIdList(
        membersResponse.data.content.map((member: any) => member.user._id)
      );
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const handleAddMember = async () => {
    // console.log("Selected friends:",);
    // console.log("Conversation:", conversation._id);
    setLoadingUpdate(true);
    try {
      const response = await post("/v1/conversation-member/add", {
        conversation: conversation._id,
        users: selectedMembers,
      });
      console.log("Response add member:", response.result);
      if (!response.result) {
        setErrorMessage(
          response.message || "Có lỗi xảy ra khi thêm thành viên."
        );
        console.error("Error adding members:", response.message);
        setIsAddMemberModalOpen(false);
        setIsAlertErrorDialogOpen(true);
        return;
      }
      setIsAddMemberModalOpen(false);
      setIsAlertDialogOpen(true);
      setSelectedMembers([]);
      onConversationUpdateInfo(conversation);
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra khi thêm thành viên.");
      setIsAlertErrorDialogOpen(true);
      console.error("Error adding members:", error);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const updateConversationPermission = async (
    id: string,
    permissions: {
      canMessage?: Number;
      canUpdate?: Number;
      canAddMember?: Number;
    }
  ) => {
    try {
      const responsePermission = await put("/v1/conversation/permission", {
        id: id,
        ...permissions,
      });
      console.log("Response permission:", responsePermission);
      if (permissions.canMessage !== undefined) {
        setIsCanMessage(permissions.canMessage);
      }
      if (permissions.canUpdate !== undefined) {
        setIsCanUpdate(permissions.canUpdate);
      }
      if (permissions.canAddMember !== undefined) {
        setIsCanAddMember(permissions.canAddMember);
      }
    } catch (error) {
      console.error("Error updating conversation permissions:", error);
      toast.error("Có lỗi xảy ra khi cập nhật quyền cuộc trò chuyện");
    }
  };
  console.log("Test Owner:", isOwner);
  console.log("Test permission:", isCanUpdate, isCanMessage, isCanAddMember);

  const handleUpdate = async (formData: any) => {
    setLoadingUpdate(true);
    setError(null);
    try {
      console.log("Data to send", formData);
      const response = await put("/v1/conversation/update", formData);
      if (!response.result) {
        setError(response.message);
        return;
      }
      setIsEditDialogOpen(false);
      onMessageChange();
      onConversationUpdateInfo(conversation);
      toast.success("Cập nhật thông tin cuộc trò chuyện thành công!");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Send image message
  const pickImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddFriend = (user: any) => {
    // console.log(`Gửi yêu cầu kết bạn đến: ${user.displayName}`);
    // setSelectedUser({ ...user, isFriend: true });
  };

  const handleForwardMessage = (friendObject: Friends) => {
    onFowardMessage(friendObject.conversation._id);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="bg-white p-4 border-b shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={conversation.avatarUrl || UserIcon}
            alt="Avatar"
            className="rounded-full w-12 h-12 object-cover border-4 border-blue-100 shadow-lg"
          />
          <div>
            <div className="flex items-center space-x-2 group">
              <h2 className="text-xl font-semibold mr-2">
                {conversation.name}
              </h2>
              {conversation.kind === 1 && isCanUpdate === 1 && (
                <button
                  onClick={() => setIsEditDialogOpen(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit
                    size={18}
                    className="text-gray-600 hover:text-gray-900"
                  />
                </button>
              )}
            </div>
            {conversation.totalMembers > 1 && (
              <p
                className={`text-sm text-gray-500 ${
                  conversation.isOwner === 1
                    ? "cursor-pointer hover:underline"
                    : ""
                }`}
                onClick={handleOpenMemberList}
              >
                {conversation.totalMembers} thành viên
              </p>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center space-x-2">
          <MessageSearch
            conversation={conversation}
            userCurrent={userCurrent}
            onMessageSelect={async (messageId: any) => {
              console.log("Message selected:", messageId);

              let messageElement: HTMLElement | null =
                document.getElementById(messageId);
              if (messageElement) {
                messageElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
                messageElement.classList.add("bg-blue-100");
                setTimeout(() => {
                  messageElement?.classList.remove("bg-blue-100");
                }, 2000);
              } else {
                let page = 0;
                let messageFound = false;

                while (!messageFound) {
                  await fetchMessages(page);
                  messageElement = document.getElementById(messageId);
                  if (messageElement) {
                    messageFound = true;
                    messageElement.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                    messageElement.classList.add("bg-blue-100");
                    setTimeout(() => {
                      messageElement?.classList.remove("bg-blue-100");
                    }, 5000);
                  } else {
                    page++;
                  }
                }
              }
            }}
          />

          {conversation.kind === 1 && (
            <button
              onClick={() => {
                if (isCanAddMember === 1 || isOwner === 1) {
                  fetchFriends();
                  setIsAddMemberModalOpen(true);
                } else {
                  toast.error(
                    "Bạn không có quyền thêm thành viên vào cuộc trò chuyện này!"
                  );
                  return;
                }
              }}
              className={`p-2 rounded-full text-white transition-colors ${
                isCanAddMember === 1 || isOwner === 1
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={isCanAddMember === 0 && isOwner === 0}
            >
              <UserPlus size={20} />
            </button>
          )}
          {isOwner === 1 && conversation.kind === 1 && (
            <button
              onClick={() => setIsManageMembersModalOpen(true)}
              className="p-2 ml-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Settings size={20} />
            </button>
          )}

          {isOwner !== 1 && conversation.kind === 1 && (
            <button
              onClick={() => {
                // Tìm thành viên hiện tại trong membersList và lấy ID
                const memberToLeave = membersList.find(
                  (member) => member.user._id === userCurrent?._id
                );
                if (memberToLeave) {
                  // Truyền id của thành viên để rời nhóm
                  setIsConfirmLeaveDialogOpen(true);
                  setMemberIdSelected(memberToLeave._id); // Lưu lại id thành viên
                }
              }}
              className="p-2 ml-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>
      <div
        className="flex-1 overflow-y-auto p-4"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {isLoadingMessages && (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        {messages
          .slice()
          .reverse()
          .map((message) => (
            <div
              id={message._id}
              key={message._id}
              className={`mb-4 flex ${
                message.user._id === userCurrent?._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.user._id !== userCurrent?._id && (
                <div className="flex-shrink-0 mr-3">
                  <img
                    src={message.user.avatarUrl || UserIcon}
                    alt={message.user.displayName}
                    className="w-8 h-8 rounded-full border-4 border-blue-100 shadow-lg"
                    onClick={() => handleAvatarClick(message.user)}
                  />
                </div>
              )}

              <div className="relative">
                <div
                  className={`p-3 rounded-lg max-w-xs break-all ${
                    message.user._id === userCurrent?._id
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black shadow"
                  } relative`}
                >
                  {message.user._id !== userCurrent?._id && (
                    <p className="font-semibold text-sm">
                      {message.user.displayName}
                    </p>
                  )}

                  {editingMessageId === message._id ? (
                    <div className="flex flex-col items-start gap-2">
                      <div className="flex w-full gap-2">
                        {/* Input chỉnh sửa tin nhắn */}
                        <input
                          type="text"
                          value={editedMessage}
                          onChange={(e) => setEditedMessage(e.target.value)}
                          className="flex-grow text-black p-2 border rounded-md"
                        />

                        {/* Nút hủy chỉnh sửa */}
                        <button
                          onClick={() => setEditingMessageId(null)}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X size={16} />
                        </button>

                        {/* Nút xác nhận chỉnh sửa */}
                        <button
                          onClick={() => handleUpdateMessage(message._id)}
                          className="px-2 py-1 bg-green-500 text-white rounded-md"
                        >
                          <Check size={16} />
                        </button>
                      </div>

                      {/* Hiển thị ảnh đã chọn nếu có */}
                      {editedImageUrl && (
                        <div className="w-full mt-2">
                          <img
                            src={editedImageUrl}
                            alt="Message attachment"
                            className="max-w-full max-h-40 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() =>
                              window.open(editedImageUrl, "_blank")
                            }
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Hiển thị nội dung tin nhắn nếu có */}
                      {message.content && (
                        <p className="mt-1">
                          {decrypt(message.content, userCurrent?.secretKey)}
                        </p>
                      )}

                      {/* Hiển thị hình ảnh nếu có */}
                      {message.imageUrl && (
                        <div className={`${message.content ? "mt-2" : "mt-0"}`}>
                          <img
                            src={message.imageUrl}
                            alt="Message attachment"
                            className="max-w-full max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() =>
                              window.open(message.imageUrl, "_blank")
                            }
                          />
                        </div>
                      )}

                      {/* Hiển thị thông báo khi không có cả nội dung và hình ảnh */}
                      {!message.content && !message.imageUrl && (
                        <p className="mt-1">Không thể hiển thị tin nhắn</p>
                      )}
                    </>
                  )}

                  <p className="text-xs mt-1 opacity-70">{message.createdAt}</p>

                  <div className="absolute -bottom-2 -right-2">
                    <button
                      onClick={() => handleReaction(message._id)}
                      className="flex items-center space-x-1 bg-gray-50 shadow-md rounded-full p-2 hover:bg-gray-300 transition-colors"
                    >
                      <Heart
                        size={14}
                        className={
                          message.isReacted === 1
                            ? "text-red-500"
                            : "text-gray-500"
                        }
                      />
                      {message.totalReactions > 0 && (
                        <span className="text-xs text-gray-500">
                          {message.totalReactions}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {message.user._id === userCurrent?._id && (
                  <div className="absolute top-0 right-0 -mt-1 -mr-1">
                    <button
                      onClick={() => toggleDropdown(message._id)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {activeDropdown === message._id && (
                      <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10">
                        <button
                          onClick={() => {
                            setEditingMessageId(message._id);
                            setEditedMessage(
                              decrypt(message.content, userCurrent.secretKey)
                            );
                            setEditedImageUrl(message.imageUrl);
                            setActiveDropdown(null);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit size={16} className="mr-2" /> Chỉnh sửa
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteMessage(message._id);
                            setActiveDropdown(null);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <Trash size={16} className="mr-2" /> Xoá
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

        <div ref={messagesEndRef} />
      </div>

      {isCanMessage === 1 || isOwner || conversation.kind == 2 ? (
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
          <div className="relative">
            {selectedImage && (
              <div className="mb-2 relative inline-block">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  className="max-h-32 rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                >
                  <XIcon size={14} />
                </button>
              </div>
            )}
            <div className="flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn tại đây..."
                className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelected}
                accept="image/*"
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer border-y border-r"
              >
                <ImageIcon size={20} />
              </label>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors"
                disabled={isSendingMessage}
              >
                {isSendingMessage ? "Sending..." : "Gửi"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-gray-100 border-t text-gray-600 text-center">
          Bạn không có quyền gửi tin nhắn trong nhóm này.
        </div>
      )}

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Thêm thành viên</h3>

            <input
              type="text"
              placeholder="Tìm kiếm bạn bè..."
              className="w-full p-2 mb-4 border rounded focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="max-h-60 overflow-y-auto">
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend) => {
                  const isAlreadyInConversation =
                    conversationMembersIdList.includes(friend.friend._id);

                  return (
                    <div
                      key={friend._id}
                      className="flex items-center justify-between mb-2"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={friend._id}
                          checked={selectedMembers.includes(friend.friend._id)}
                          onChange={() => toggleMember(friend.friend._id)}
                          className="mr-2"
                          disabled={isAlreadyInConversation}
                        />
                        <label
                          htmlFor={friend._id}
                          className={
                            isAlreadyInConversation ? "text-gray-500" : ""
                          }
                        >
                          {friend.friend.displayName}
                        </label>
                      </div>

                      {isAlreadyInConversation && (
                        <p className="text-gray-500 ml-auto">Đã tham gia</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">Không tìm thấy bạn bè nào</p>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsAddMemberModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleAddMember}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {isManageMembersModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">
              Cho phép các thành viên trong nhóm:
            </h3>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="toggleUpdateAll"
                checked={isCanUpdate === 1}
                onChange={(e) => {
                  updateConversationPermission(conversation._id, {
                    canUpdate: e.target.checked ? 1 : 0,
                  });
                }}
              />
              <label htmlFor="toggleUpdateAll" className="ml-2">
                Có thể cập nhật tên và avatar của nhóm
              </label>
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="toggleMessageAll"
                checked={isCanMessage === 1}
                onChange={(e) => {
                  updateConversationPermission(conversation._id, {
                    canMessage: e.target.checked ? 1 : 0,
                  });
                }}
              />
              <label htmlFor="toggleMessageAll" className="ml-2">
                Có thể nhắn tin trong nhóm
              </label>
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="toggleAddMemberAll"
                checked={isCanAddMember === 1}
                onChange={(e) => {
                  updateConversationPermission(conversation._id, {
                    canAddMember: e.target.checked ? 1 : 0,
                  });
                }}
              />
              <label htmlFor="toggleAddMemberAll" className="ml-2">
                Có thể thêm thành viên vào nhóm
              </label>
            </div>

            {/* Nút Giải tán nhóm */}
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setIsConfirmDialogOpen(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Giải tán nhóm
              </button>
              <button
                onClick={() => {
                  setIsManageMembersModalOpen(false);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member List */}
      {isMemberListOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Danh sách thành viên</h3>
            {loadingMembers ? (
              <p>Đang tải danh sách...</p>
            ) : (
              <div className="space-y-4">
                {membersList.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <img
                        src={member.user.avatarUrl || UserIcon}
                        alt={member.user.displayName}
                        className="w-8 h-8 rounded-full mr-2"
                        onClick={() => handleAvatarClick(member.user)}
                      />
                      <span className="text-gray-700">
                        {member.user.displayName}
                        {member.user._id === profile?._id && (
                    <span className="ml-2 text-sm text-gray-500">(Tôi)</span>
                  )}
                      </span>
                    </div>
                  
                    {isOwner === 1 ? (
                      member.isOwner === 1 ? (
                        <span className="text-sm text-blue-500">
                          Nhóm trưởng
                        </span>
                      ) : (
                        membersList.length > 3 && (
                          <button
                            onClick={() => {
                              setIsConfirmDelMemDialogOpen(true);
                              setMemberIdSelected(member._id);
                            }}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Xóa
                          </button>
                        )
                      )
                    ) : (
                      member.isOwner === 1 && (
                        <span className="text-sm text-blue-500">
                          Nhóm trưởng
                        </span>
                      )
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsMemberListOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <AlertDialog
        isVisible={isAlertDialogOpen}
        title="Thành công"
        message="Bạn đã thêm thành viên thành công!"
        onAccept={() => {
          setIsAlertDialogOpen(false);
        }}
      />

      <AlertErrorDialog
        isVisible={isAlertErrorDialogOpen}
        title="Thất bại"
        message={errorMessage}
        onAccept={() => {
          setIsAlertErrorDialogOpen(false);
        }}
      />

      <ConfimationDialog
        isVisible={isConfirmDelMemDialogOpen}
        title="Xác nhận"
        color="red"
        message="Bạn có chắc chắn muốn xoá thành viên này ra khỏi nhóm?"
        onConfirm={() => {
          handleRemoveMember(memberIdSelected);
          setIsConfirmDelMemDialogOpen(false);
        }}
        onCancel={() => setIsConfirmDelMemDialogOpen(false)}
      />

      <ConfimationDialog
        isVisible={isConfirmDialogOpen}
        title="Xác nhận"
        color="red"
        message="Bạn có chắc chắn muốn giải tán nhóm?"
        onConfirm={() => {
          handleDisbandGroup();
          setIsConfirmDialogOpen(false);
        }}
        onCancel={() => setIsConfirmDialogOpen(false)}
      />

      <ConfimationDialog
        isVisible={isConfirmLeaveDialogOpen}
        title="Xác nhận"
        color="red"
        message="Bạn có chắc chắn muốn rời nhóm?"
        onConfirm={() => {
          handleLeaveGroup(memberIdSelected);
          setIsConfirmLeaveDialogOpen(false);
        }}
        onCancel={() => setIsConfirmLeaveDialogOpen(false)}
      />

      <EditProfilePopup
        conversation={conversation}
        onUpdate={handleUpdate}
        isVisible={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />

      <UserInfoPopup
        user={selectedUser}
        onClose={closePopup}
        onAddFriend={handleAddFriend}
        onFowardMessage={handleForwardMessage}
      />

      <LoadingDialog isVisible={isLoadingUpdate} />

      {error &&
        AlertErrorDialog({
          isVisible: true,
          title: "Thất bại",
          message: error,
          onAccept: () => setError(null),
        })}
    </div>
  );
};

export default ChatWindow;
