import { useState, useEffect, useRef } from "react";
import {
  PhoneIcon,
  SearchIcon,
  MenuIcon,
  XIcon,
  ImageIcon,
  FileIcon,
  ChevronDownIcon,
  InfoIcon,
  UserIcon,
  HandshakeIcon,
  BotIcon,
  UsersIcon,
  TrashIcon,
  PencilIcon,
  LogOutIcon,
} from "lucide-react";
import {
  convertDateByFields,
  decryptData,
  formatDistanceToNowVN,
  getMediaImage,
  getMimeType,
  getNestedValue,
  isOnline,
  parseCustomDateString,
  truncateString,
  truncateToDDMMYYYY,
} from "../../services/utils";
import chatImg from "../../assets/chat.png";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/Sidebar.css";
import { DateDivider, MessageItem } from "./message/MessageItem";
import { DocumentItem, FileModal, FileTypeIcon } from "./FileComponents";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import UnauthorizedDialog from "../auth/UnauthorizedDialog";
import InputSessionKey from "../auth/InputSessionKey";
import NotReadyDialog from "../auth/NotReadyDialog";
import useApi from "../../hooks/useApi";
import {
  configDeleteDialog,
  configModalForm,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/page/Dialog";
import RequestKey from "../auth/RequestKey";
import useModal from "../../hooks/useModal";
import VerifyFaceId from "../faceId/VerifyFaceId";
import CreateChatRoom from "./CreateChatRoom";
import {
  BASIC_MESSAGES,
  CHAT_HISTORY_ROLE,
  CHAT_ROOM_DEFAULT_SETTINGS,
  CHAT_ROOM_KIND_MAP,
  SETTING_KEYS,
  SOCKET_CMD,
  TOAST,
} from "../../services/constant";
import { GridViewLoading } from "../../components/page/GridView";
import {
  CONVER_DATE_FIELDS,
  DECRYPT_FIELDS,
  GEMINI_BOT_CONFIG,
} from "../../components/config/PageConfig";
import ChatSideBar from "./ChatSideBar";
import UpdateMessage from "./message/UpdateMessage";
import ChatInput from "./message/ChatInput";
import MemberReactions from "./message/MemberReactions";
import CreateChatRoomMember from "./CreateChatRoomMember";
import ChatRoomMembers from "./message/ChatRoomMembers";
import UpdateChatRoom from "./UpdateChatRoom";
import VideoChatModal from "./video/VideoChatModal";
import { Virtuoso } from "react-virtuoso";

const InternalChatPage = () => {
  const { isSystemNotReady, sessionKey, setToast, profile, message } =
    useGlobalContext();
  const [isFaceIdVerified, setIsFaceIdVerified] = useState<boolean>(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [parentMessage, setParentMessage] = useState<any>(null);
  const [searchConversations, setSearchConversations] = useState<string>("");
  const [searchMessages, setSearchMessages] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [panelState, setPanelState] = useState<"info" | "search" | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [mediaActiveTab, setMediaActiveTab] = useState<string>("media");
  const [messages, setMessages] = useState<any>([]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const messageRefs = useRef<any[]>([]);
  const virtuosoRef = useRef<any>(null);

  const {
    isModalVisible: verifyFaceIdVisible,
    showModal: showVerifyFaceIdForm,
    hideModal: hideVerifyFaceIdForm,
    formConfig: verifyFaceIdFormConfig,
  } = useModal();

  const {
    isModalVisible: requestKeyFormVisible,
    showModal: showRequestKeyForm,
    hideModal: hideRequestKeyForm,
    formConfig: requestKeyFormConfig,
  } = useModal();

  const {
    isModalVisible: createRoomFormVisible,
    showModal: showCreateRoomForm,
    hideModal: hideCreateRoomForm,
    formConfig: createRoomFormConfig,
  } = useModal();

  const {
    isModalVisible: updateRoomFormVisible,
    showModal: showUpdateRoomForm,
    hideModal: hideUpdateRoomForm,
    formConfig: updateRoomFormConfig,
  } = useModal();

  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();

  const {
    isModalVisible: inviteMembersFormVisible,
    showModal: showInviteMembersForm,
    hideModal: hideInviteMembersForm,
    formConfig: inviteMembersFormConfig,
  } = useModal();

  const {
    isModalVisible: viewMembersFormVisible,
    showModal: showViewMembersForm,
    hideModal: hideViewMembersForm,
    formConfig: viewMembersFormConfig,
  } = useModal();

  const [conversations, setConversations] = useState<any>([]);
  const { chatRoomMember, chatMessage, chatRoom, auth, media, loading } =
    useApi();
  const { chatMessage: chatMessageNoLoading, chatRoom: chatRoomListNoLoading } =
    useApi();
  const {
    chatMessage: chatMessageHiddenLoading,
    chatHistory: chatHistoryListNoLoading,
    loading: hiddenLoading,
  } = useApi();
  const {
    chatHistory: chatHistorySendMsg,
    chatMessage: sendMessage,
    loading: loadingSendMessage,
  } = useApi();
  const { chatRoom: chatRoomList, loading: loadingChatRoomList } = useApi();
  const {
    chatHistory: chatHistoryList,
    chatMessage: messageList,
    loading: loadingMessageList,
  } = useApi();
  const {
    isModalVisible: updateMessageFormVisible,
    showModal: showUpdateMessageForm,
    hideModal: hideUpdateMessageForm,
    formConfig: updateMessageFormConfig,
  } = useModal();
  const {
    isModalVisible: reactionCountFormVisible,
    showModal: showReactionCountForm,
    hideModal: hideReactionCountForm,
    formConfig: reactionCountFormConfig,
  } = useModal();

  const onReactionCountClick = (messageReactions: any) => {
    showReactionCountForm({
      title: "Thành viên đã thả cảm xúc",
      hideModal: hideReactionCountForm,
      messageReactions,
    });
  };

  const onUpdateMesageButtonClick = (id: any) => {
    showUpdateMessageForm(
      configModalForm({
        label: "Chỉnh sửa tin nhắn",
        fetchApi: chatMessage.update,
        refreshData: () => {},
        hideModal: hideUpdateMessageForm,
        setToast,
        successMessage: BASIC_MESSAGES.UPDATED,
        initForm: {
          id,
          content: "",
          document: "[]",
        },
      })
    );
  };

  const onCreateRoomButtonClick = () => {
    showCreateRoomForm({
      hideModal: hideCreateRoomForm,
      onButtonClick: () => {
        hideCreateRoomForm();
      },
    });
  };

  const onUpdateRoomButtonClick = () => {
    showUpdateRoomForm({
      settings: groupSettings,
      ...configModalForm({
        label: "Cập nhật thông tin hội thoại",
        fetchApi: chatRoom.update,
        refreshData: () => {},
        hideModal: hideUpdateRoomForm,
        setToast,
        successMessage: BASIC_MESSAGES.UPDATED,
        initForm: {
          id: selectedConversation?.id,
          avatar: "",
          name: "",
          allow_send_messages: true,
          allow_update_chat_room: true,
          allow_invite_members: true,
        },
      }),
    });
  };

  const onInviteMembersButtonClick = () => {
    showInviteMembersForm({
      title: "Thêm thành viên",
      hideModal: hideInviteMembersForm,
      onButtonClick: async (form: any) => {
        hideInviteMembersForm();
        const res = await chatRoomMember.create(form);
        if (res.result) {
          hideViewMembersForm();
          setToast(BASIC_MESSAGES.CREATED, TOAST.SUCCESS);
        } else {
          setToast(res.message, TOAST.ERROR);
        }
      },
      initForm: {
        chatRoomId: selectedConversation?.id,
        memberIds: [],
      },
    });
  };

  const onViewMembersClick = async () => {
    const res = await chatRoomMember.list({
      isPaged: 0,
      chatRoomId: selectedConversation?.id,
    });
    if (!res.result) {
      setToast(res.message, TOAST.ERROR);
      return;
    }
    const members = res?.data?.content || [];
    showViewMembersForm({
      title: "Danh sách thành viên",
      hideModal: hideViewMembersForm,
      members,
      settings: getGroupSettings(),
      onRemoveMember: onRemoveMemberClick,
      onInviteMember: onInviteMembersButtonClick,
    });
  };

  const handleRequestKey = () => {
    showRequestKeyForm(
      configModalForm({
        label: "Gửi yêu cầu khóa",
        fetchApi: auth.requestKey,
        setToast,
        hideModal: hideRequestKeyForm,
        initForm: {
          password: "",
        },
      })
    );
  };

  const handleVerifyFaceId = async () => {
    showVerifyFaceIdForm({
      hideModal: hideVerifyFaceIdForm,
      onButtonClick: async () => {
        hideVerifyFaceIdForm();
        setIsFaceIdVerified(true);
      },
    });
  };

  const fetchChatRooms = async (apiList: any) => {
    if (!sessionKey) {
      return;
    }
    const res = await apiList({ isPaged: 0 });
    if (res.result) {
      const data = res?.data?.content || [];
      setConversations([
        GEMINI_BOT_CONFIG,
        ...data?.map((item: any) => {
          const obj = decryptData(sessionKey, item, DECRYPT_FIELDS.CHAT_ROOM);
          const converted = convertDateByFields(
            obj,
            CONVER_DATE_FIELDS.CHAT_ROOM
          );
          return {
            ...converted,
            isOnline: isOnline(converted.lastLogin),
          };
        }),
      ]);
    } else {
      setConversations([]);
    }
  };

  const fetchChatHistoryListNoLoading = async () => {
    const res = await chatHistoryListNoLoading.list({
      isPaged: 0,
    });
    if (res.result) {
      const data = res?.data?.content || [];
      const decryptedData = data?.map((item: any) => {
        const obj = decryptData(sessionKey, item, DECRYPT_FIELDS.CHAT_HISTORY);
        return convertDateByFields(obj, CONVER_DATE_FIELDS.CHAT_HISTORY);
      });
      setMessages(decryptedData.reverse());
    } else {
      setMessages([]);
    }
  };

  const fetchMessagesByChatRoom = async (conversation: any) => {
    if (!sessionKey || !conversation) {
      setMessages([]);
      return;
    }
    if (conversation.kind === GEMINI_BOT_CONFIG.kind) {
      const res = await chatHistoryList.list({
        isPaged: 0,
      });
      if (res.result) {
        const data = res?.data?.content || [];
        const decryptedData = data?.map((item: any) => {
          const obj = decryptData(
            sessionKey,
            item,
            DECRYPT_FIELDS.CHAT_HISTORY
          );
          return convertDateByFields(obj, CONVER_DATE_FIELDS.CHAT_HISTORY);
        });
        setMessages(decryptedData.reverse());
      } else {
        setMessages([]);
      }
      return;
    }
    const res = await messageList.list({
      chatRoomId: conversation.id,
      isPaged: 0,
    });
    if (res.result) {
      const data = res?.data?.content || [];
      const decryptedData = data?.map((item: any) => {
        const obj = decryptData(sessionKey, item, DECRYPT_FIELDS.MESSAGE);
        return convertDateByFields(obj, CONVER_DATE_FIELDS.MESSAGE);
      });
      setMessages(decryptedData.reverse());
    } else {
      setMessages([]);
    }
    if (conversation?.totalUnreadMessages > 0) {
      await fetchChatRooms(chatRoomListNoLoading.list);
    }
  };

  const fetchMessageNoLoading = async (
    messageListApi: any,
    conversation: any
  ) => {
    if (!conversation) return;
    const res = await messageListApi.list({
      chatRoomId: conversation.id,
      isPaged: 0,
    });
    if (res.result) {
      const data = res?.data?.content || [];
      const decryptedData = data?.map((item: any) => {
        const obj = decryptData(sessionKey, item, DECRYPT_FIELDS.MESSAGE);
        return convertDateByFields(obj, CONVER_DATE_FIELDS.MESSAGE);
      });
      setMessages(decryptedData.reverse());
    } else {
      setMessages([]);
    }
  };

  useEffect(() => {
    if (!profile.isFaceIdRegistered) {
      setIsFaceIdVerified(true);
    } else {
      setIsFaceIdVerified(false);
    }
  }, []);

  useEffect(() => {
    if (!isFaceIdVerified) {
      handleVerifyFaceId();
    } else {
      hideVerifyFaceIdForm();
    }
  }, [isFaceIdVerified]);

  const applySeenToLastMessages = (messages: any[]) => {
    const seenTracker: Record<string, boolean> = {};
    const result = [...messages].reverse().map((msg) => {
      const filteredSeen = (msg.seenMembers || []).filter((member: any) => {
        if (seenTracker[member.id]) return false;
        seenTracker[member.id] = true;
        return true;
      });
      return {
        ...msg,
        seenMembers: filteredSeen,
        totalSeenMembers: filteredSeen.length,
      };
    });
    return result.reverse();
  };

  useEffect(() => {
    const handleProcessSocket = async () => {
      if (
        [
          SOCKET_CMD.CMD_CHAT_ROOM_CREATED,
          SOCKET_CMD.CMD_CHAT_ROOM_UPDATED,
          SOCKET_CMD.CMD_CHAT_ROOM_DELETED,
        ].includes(message?.cmd)
      ) {
        const chatRoomId = message?.data?.chatRoomId;
        if (selectedConversation?.id === chatRoomId) {
          if (SOCKET_CMD.CMD_CHAT_ROOM_UPDATED === message?.cmd) {
            setSelectedConversation(
              await handleGetConversationInfo(chatRoomId)
            );
          }
          if (SOCKET_CMD.CMD_CHAT_ROOM_DELETED === message?.cmd) {
            setSelectedConversation(null);
          }
        }
        await fetchChatRooms(chatRoomListNoLoading.list);
      }
      if (
        [SOCKET_CMD.CMD_NEW_MESSAGE, SOCKET_CMD.CMD_MESSAGE_UPDATED].includes(
          message?.cmd
        )
      ) {
        const messageId = message?.data?.messageId;
        const chatRoomId = message?.data?.chatRoomId;
        if (messageId && chatRoomId === selectedConversation?.id) {
          const res =
            SOCKET_CMD.CMD_NEW_MESSAGE === message?.cmd
              ? await chatMessageHiddenLoading.get(messageId)
              : await chatMessageNoLoading.get(messageId);
          const obj = decryptData(
            sessionKey,
            res?.data,
            DECRYPT_FIELDS.MESSAGE
          );
          setMessages((prev: any[]) => {
            const index = prev.findIndex((msg) => msg.id === obj.id);
            let updated;

            if (index !== -1) {
              updated = [...prev];
              updated[index] = obj;
            } else {
              updated = [...prev, obj];
            }
            return applySeenToLastMessages(updated);
          });
        }
        await fetchChatRooms(chatRoomListNoLoading.list);
      }
    };
    handleProcessSocket();
  }, [message]);

  const getMessageById = async (id: any) => {
    const res = await chatMessageNoLoading.get(id);
    if (!res.result) {
      setToast(BASIC_MESSAGES.FAILED, TOAST.ERROR);
    }
    const data = res?.data;
    return decryptData(sessionKey, data, DECRYPT_FIELDS.MESSAGE);
  };

  const handleSetParentMessageToReply = async (messageId: any) => {
    setParentMessage(await getMessageById(messageId));
  };

  const handleClickParentMessage = (messageId: any) => {
    scrollToMessage(messageId);
  };

  useEffect(() => {
    fetchChatRooms(chatRoomList.list);
    fetchMessagesByChatRoom(selectedConversation);
  }, [sessionKey]);

  const filteredConversations = conversations
    ? conversations.filter((conversation: any) => {
        const matchesSearch = conversation?.name
          .toLowerCase()
          .includes(searchConversations.toLowerCase());
        if (activeTab === "all") {
          return matchesSearch;
        }
        if (activeTab === "unread") {
          return matchesSearch && (conversation?.totalUnreadMessages || 0) > 0;
        }
        return matchesSearch;
      })
    : [];

  const filteredMessages = messages.filter(
    (message: any) =>
      searchMessages.trim() &&
      ((message?.content &&
        message.content.toLowerCase().includes(searchMessages.toLowerCase())) ||
        (message?.message &&
          message.message.toLowerCase().includes(searchMessages.toLowerCase())))
  );

  const [searchQuery, setSearchQuery] = useState("");

  const attachedFiles = messages
    .filter((message: any) => message.document)
    .flatMap((message: any) => JSON.parse(message.document || "[]"));

  const mediaFiles = attachedFiles.filter((file: any) => {
    const mimeType = getMimeType(file.name);
    return mimeType.startsWith("image/") || mimeType.startsWith("video/");
  });

  const otherFiles = attachedFiles.filter((file: any) => {
    const mimeType = getMimeType(file.name);
    return !mimeType.startsWith("image/") && !mimeType.startsWith("video/");
  });

  const filteredMediaFiles = mediaFiles.filter((file: any) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredOtherFiles = otherFiles.filter((file: any) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetChatInputForm = () => {
    setNewMessage("");
    setParentMessage(null);
  };

  const onRefreshButtonClick = async () => {
    await fetchChatRooms(chatRoomList.list);
  };

  const handleGetConversationInfo = async (conversationId: any) => {
    const res = await chatRoomListNoLoading.get(conversationId);
    if (!res.result) {
      return null;
    }
    const obj1 = decryptData(sessionKey, res.data, DECRYPT_FIELDS.CHAT_ROOM);
    const obj2 = convertDateByFields(obj1, CONVER_DATE_FIELDS.CHAT_ROOM);
    obj2.isOnline = isOnline(obj2.lastLogin);
    return obj2;
  };

  const handleSelectConversation = async (conversationId: any) => {
    let conversation = null;
    if (conversationId === GEMINI_BOT_CONFIG.id) {
      conversation = GEMINI_BOT_CONFIG;
    } else {
      conversation = await handleGetConversationInfo(conversationId);
    }
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    setSelectedConversation(conversation);
    fetchMessagesByChatRoom(conversation);
    resetChatInputForm();
    setPanelState(null);
  };

  useEffect(() => {
    if (!loadingMessageList || !hiddenLoading) {
      scrollToBottom();
    }
  }, [loadingMessageList, hiddenLoading]);

  const scrollToMessage = (messageId: string) => {
    const messageIndex = messages.findIndex((msg: any) => msg.id === messageId);
    if (messageIndex !== -1 && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: messageIndex,
        align: "center",
        behavior: "smooth",
      });
      const messageElement = messageRefs.current[messageIndex];
      if (messageElement) {
        messageElement.classList.add("bg-blue-500/20");
        setTimeout(() => {
          messageElement.classList.remove("bg-blue-500/20");
        }, 2000);
      }
      if (messageIndex === messages.length) {
        scrollToBottom();
      }
    }
    if (panelState === "search") {
      setPanelState(null);
    }
  };

  const scrollToBottom = () => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: messages.length - 1,
        align: "end",
        behavior: "smooth",
      });
      setTimeout(() => {
        virtuosoRef.current.scrollTo({
          top: Number.MAX_SAFE_INTEGER,
          behavior: "smooth",
        });
      }, 300);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSearchMessages("");
    setSearchQuery("");
    setMediaActiveTab("media");
  }, [panelState]);

  const onDeleteMessageButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: "Thu hồi tin nhắn",
        message: "Bạn có chắc muốn thu hồi tin nhắn này?",
        deleteApi: () => chatMessageNoLoading.del(id),
        refreshData: () => {},
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onRemoveMemberClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: "Xóa thành viên",
        message: "Bạn có chắc muốn xóa thành viên này khỏi nhóm?",
        deleteApi: () => chatRoomMember.del(id),
        refreshData: () => hideViewMembersForm(),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onDeleteChatRoomClick = () => {
    const label = isOwner
      ? "Giải tán nhóm"
      : isGroup
      ? "Rời nhóm"
      : "Xóa cuộc trò chuyện";
    const message = isOwner
      ? "Bạn có chắc muốn giải tán nhóm này?"
      : isGroup
      ? "Bạn có chắc muốn rời nhóm này?"
      : "Bạn có chắc muốn xóa hội thoại này?";
    showDeleteDialog(
      configDeleteDialog({
        label,
        message,
        deleteApi: async () => {
          if (isGroup) {
            await chatRoom.leave(selectedConversation?.id);
          } else {
            await chatRoom.del(selectedConversation?.id);
          }
        },
        refreshData: () => setSelectedConversation(null),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const getGroupSettings = () => {
    let settings;
    if (isGroup && isOwner) {
      settings = CHAT_ROOM_DEFAULT_SETTINGS;
    } else {
      try {
        settings = selectedConversation?.settings
          ? JSON.parse(selectedConversation.settings)
          : CHAT_ROOM_DEFAULT_SETTINGS;
      } catch {
        settings = CHAT_ROOM_DEFAULT_SETTINGS;
      }
    }
    settings.isOwner = isOwner;
    return settings;
  };

  const isOwner = selectedConversation?.isOwner;
  const isGroup = selectedConversation?.kind === CHAT_ROOM_KIND_MAP.GROUP.value;
  const isDirectMessage =
    selectedConversation?.kind === CHAT_ROOM_KIND_MAP.DIRECT_MESSAGE.value;
  const groupSettings = getGroupSettings();
  const allowEditGroup = getNestedValue(
    groupSettings,
    SETTING_KEYS.ALLOW_UPDATE_CHAT_ROOM
  );

  const isNotSameDay = (date1: any, date2: any) => {
    return (
      parseCustomDateString(date1).toDateString() !==
      parseCustomDateString(date2).toDateString()
    );
  };

  const renderItem = (index: number) => {
    const isBot = selectedConversation.kind == GEMINI_BOT_CONFIG.kind;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const message = messages[index];
    const nextMessage =
      index < messages.length - 1 ? messages[index + 1] : null;

    const showDateDivider =
      index === 0 ||
      !previousMessage ||
      isNotSameDay(message.createdDate, previousMessage.createdDate);

    const showAvatar =
      !isBot &&
      (!nextMessage ||
        (nextMessage &&
          (nextMessage.sender.id !== message.sender.id ||
            isNotSameDay(message.createdDate, nextMessage.createdDate))));
    return (
      <div className="flex flex-col">
        {showDateDivider && (
          <DateDivider date={truncateToDDMMYYYY(message.createdDate)} />
        )}
        <div ref={(el) => (messageRefs.current[index] = el)}>
          <MessageItem
            showAvatar={showAvatar}
            settings={groupSettings}
            onReactionCountClick={onReactionCountClick}
            openModal={setSelectedFile}
            message={message}
            onRecallMessage={onDeleteMessageButtonClick}
            onEditMessage={onUpdateMesageButtonClick}
            onReplyMessage={() => handleSetParentMessageToReply(message.id)}
            onClickParentMessage={handleClickParentMessage}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <UnauthorizedDialog />
      <LoadingDialog isVisible={loading} />
      <VerifyFaceId
        isVisible={verifyFaceIdVisible}
        formConfig={verifyFaceIdFormConfig}
      />
      <ConfirmationDialog
        zIndex={980}
        isVisible={deleteDialogVisible}
        formConfig={deleteDialogConfig}
      />
      <RequestKey
        isVisible={requestKeyFormVisible}
        formConfig={requestKeyFormConfig}
      />
      {isVideoModalOpen && (
        <VideoChatModal
          conversation={selectedConversation}
          closeModal={() => setIsVideoModalOpen(false)}
        />
      )}
      <CreateChatRoomMember
        isVisible={inviteMembersFormVisible}
        formConfig={inviteMembersFormConfig}
      />
      <ChatRoomMembers
        isVisible={viewMembersFormVisible}
        formConfig={viewMembersFormConfig}
      />
      <MemberReactions
        isVisible={reactionCountFormVisible}
        formConfig={reactionCountFormConfig}
      />
      <UpdateMessage
        isVisible={updateMessageFormVisible}
        formConfig={updateMessageFormConfig}
      />
      <CreateChatRoom
        isVisible={createRoomFormVisible}
        formConfig={createRoomFormConfig}
      />
      <UpdateChatRoom
        isVisible={updateRoomFormVisible}
        formConfig={updateRoomFormConfig}
      />
      <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 overflow-hidden">
        <ChatSideBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          handleRequestKey={handleRequestKey}
          searchConversations={searchConversations}
          setSearchConversations={setSearchConversations}
          onRefreshButtonClick={onRefreshButtonClick}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          loadingChatRoomList={loadingChatRoomList}
          filteredConversations={filteredConversations}
          selectedConversation={selectedConversation}
          handleSelectConversation={handleSelectConversation}
          onCreateRoomButtonClick={onCreateRoomButtonClick}
        />

        {isSystemNotReady ? (
          <NotReadyDialog
            color="goldenrod"
            message="Vui lòng liên hệ với quản trị viên để kích hoạt hệ thống"
            title="Hệ thống chưa sẵn sàng"
          />
        ) : !sessionKey && !isSystemNotReady ? (
          <InputSessionKey />
        ) : (
          <>
            <div className="flex flex-1">
              <div className="flex-1 flex flex-col relative">
                {!isSidebarOpen && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-4 lg:hidden text-gray-400 hover:text-white"
                  >
                    <MenuIcon size={24} />
                  </motion.button>
                )}

                {selectedConversation ? (
                  <>
                    <div className="p-4 border-b border-gray-700/50 flex items-center justify-between bg-gray-800/30 backdrop-blur-md">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          {selectedConversation.kind ===
                          GEMINI_BOT_CONFIG.kind ? (
                            <div className="w-10 h-10 rounded-full bg-blue-900 border border-gray-600 shadow-md flex items-center justify-center">
                              <GEMINI_BOT_CONFIG.icon className="text-gray-300" />
                            </div>
                          ) : (
                            <>
                              {selectedConversation.avatar ? (
                                <img
                                  src={getMediaImage(
                                    selectedConversation.avatar
                                  )}
                                  className="w-10 h-10 rounded-full object-cover border border-gray-600"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-700 border border-gray-600 shadow-md flex items-center justify-center">
                                  {isDirectMessage ? (
                                    <UserIcon
                                      size={20}
                                      className="text-gray-300"
                                    />
                                  ) : (
                                    <UsersIcon
                                      size={20}
                                      className="text-gray-300"
                                    />
                                  )}
                                </div>
                              )}
                            </>
                          )}
                          {isDirectMessage && selectedConversation.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                          )}
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-white">
                            {selectedConversation.name}
                          </h2>
                          <p
                            onClick={isGroup ? onViewMembersClick : undefined}
                            className={`text-sm text-gray-400 ${
                              isGroup &&
                              "hover:text-gray-300 cursor-pointer transition-colors duration-200"
                            }`}
                          >
                            {selectedConversation.kind ===
                            CHAT_ROOM_KIND_MAP.DIRECT_MESSAGE.value ? (
                              <>
                                {selectedConversation.isOnline
                                  ? "Đang hoạt động"
                                  : selectedConversation.lastLogin
                                  ? `Truy cập ${formatDistanceToNowVN(
                                      selectedConversation.lastLogin
                                    )}`
                                  : ""}
                              </>
                            ) : isGroup ? (
                              <>{`${selectedConversation.totalMembers} thành viên`}</>
                            ) : (
                              <>{GEMINI_BOT_CONFIG.description}</>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {isDirectMessage && (
                          <motion.button
                            onClick={() => setIsVideoModalOpen(true)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                          >
                            <PhoneIcon size={20} />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (panelState === "search") {
                              setPanelState(null);
                            } else {
                              setPanelState("search");
                            }
                          }}
                          className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                        >
                          <SearchIcon size={20} />
                        </motion.button>
                        {selectedConversation.kind !==
                          GEMINI_BOT_CONFIG.kind && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              if (panelState === "info") {
                                setPanelState(null);
                              } else {
                                setPanelState("info");
                              }
                            }}
                            className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                          >
                            <InfoIcon size={20} />
                          </motion.button>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 py-2 overflow-y-auto bg-gray-900/50 backdrop-blur-md">
                      {loadingMessageList ? (
                        <div className="flex-1">
                          <GridViewLoading loading={loadingMessageList} />
                        </div>
                      ) : messages.length > 0 ? (
                        <Virtuoso
                          ref={virtuosoRef}
                          data={messages}
                          style={{ height: "100%" }}
                          totalCount={messages.length}
                          itemContent={renderItem}
                          atBottomStateChange={(atBottom) => {
                            setShowScrollTop(!atBottom);
                          }}
                          initialTopMostItemIndex={messages.length - 1}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 mt-10">
                          {selectedConversation.kind ===
                          GEMINI_BOT_CONFIG.kind ? (
                            <>
                              <BotIcon
                                size={48}
                                className="text-gray-500 mb-4"
                                strokeWidth={1.5}
                              />
                              <p className="text-lg font-medium text-gray-300 text-center">
                                Tôi có thể giúp gì cho bạn
                              </p>
                            </>
                          ) : (
                            <>
                              <HandshakeIcon
                                size={48}
                                className="text-gray-500 mb-4"
                                strokeWidth={1.5}
                              />
                              <p className="text-lg font-medium text-gray-300 text-center">
                                Hãy gửi tin nhắn đầu tiên
                              </p>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <AnimatePresence>
                      {showScrollTop && (
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={scrollToBottom}
                          className="absolute bottom-24 right-4 p-2 bg-gray-700 backdrop-blur-md rounded-full text-white shadow-lg"
                        >
                          <ChevronDownIcon size={20} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                    <ChatInput
                      loadingMessageList={loadingMessageList}
                      settings={groupSettings}
                      selectedConversation={selectedConversation}
                      newMessage={newMessage}
                      setNewMessage={setNewMessage}
                      setMessages={setMessages}
                      scrollToBottom={scrollToBottom}
                      fetchChatHistoryListNoLoading={
                        fetchChatHistoryListNoLoading
                      }
                      parentMessage={parentMessage}
                      setParentMessage={setParentMessage}
                      chatHistorySendMsgApi={chatHistorySendMsg}
                      sendMessageApi={sendMessage}
                      mediaApi={media}
                      loadingSendMessage={loadingSendMessage}
                      onClickParentMessage={handleClickParentMessage}
                      openModal={setSelectedFile}
                      resetChatInputForm={resetChatInputForm}
                    />
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-2 bg-gray-900/50 backdrop-blur-md">
                    <motion.img
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={chatImg}
                      className="w-full object-contain max-w-lg"
                    />
                    <p className="text-gray-400 text-center text-lg">
                      Chọn một cuộc trò chuyện để bắt đầu
                    </p>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {panelState && selectedConversation && (
                  <motion.div
                    initial={{ x: 400 }}
                    animate={{ x: 0 }}
                    exit={{ x: 400 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="w-100 bg-gray-800/70 backdrop-blur-md border-l border-gray-700/50 flex flex-col lg:w-1/4"
                  >
                    {panelState === "info" ? (
                      <>
                        <div className="p-4 border-b border-gray-700/50 flex items-center justify-between bg-gray-800/30 backdrop-blur-md">
                          <h2 className="text-lg font-semibold text-white">
                            Thông tin hội thoại
                          </h2>
                          <div className="flex flex-row space-x-1">
                            {isGroup && allowEditGroup && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onUpdateRoomButtonClick}
                                className="p-2 rounded-full hover:bg-blue-700/50 transition-all text-blue-400 hover:text-blue-300"
                              >
                                <PencilIcon size={20} />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={onDeleteChatRoomClick}
                              className="p-2 rounded-full hover:bg-red-700/50 transition-all text-red-400 hover:text-red-300"
                            >
                              {isGroup ? (
                                <LogOutIcon size={20} />
                              ) : (
                                <TrashIcon size={20} />
                              )}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setPanelState(null)}
                              className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                            >
                              <XIcon size={20} />
                            </motion.button>
                          </div>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                          <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                              {selectedConversation.avatar ? (
                                <img
                                  src={getMediaImage(
                                    selectedConversation.avatar
                                  )}
                                  className="w-16 h-16 rounded-full mb-2 border border-gray-600"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-700 border border-gray-600 shadow-md flex items-center justify-center">
                                  {isDirectMessage ? (
                                    <UserIcon className="text-gray-300" />
                                  ) : (
                                    <UsersIcon className="text-gray-300" />
                                  )}
                                </div>
                              )}
                              {isDirectMessage &&
                                selectedConversation.isOnline && (
                                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                                )}
                            </div>
                            <h3 className="text-lg font-medium text-white">
                              {selectedConversation.name}
                            </h3>
                            <p
                              onClick={isGroup ? onViewMembersClick : undefined}
                              className={`text-sm text-gray-400 ${
                                isGroup &&
                                "hover:text-gray-300 cursor-pointer transition-colors duration-200"
                              }`}
                            >
                              {isDirectMessage ? (
                                <>
                                  {selectedConversation.isOnline
                                    ? "Đang hoạt động"
                                    : selectedConversation.lastLogin
                                    ? `Truy cập ${formatDistanceToNowVN(
                                        selectedConversation.lastLogin
                                      )}`
                                    : ""}
                                </>
                              ) : (
                                <>{`${selectedConversation.totalMembers} thành viên`}</>
                              )}
                            </p>
                          </div>

                          <div className="mb-6">
                            <div className="relative mb-4">
                              <SearchIcon
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                              />
                              <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm tệp..."
                                className="w-full pl-10 pr-10 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                aria-label="Tìm kiếm tệp"
                              />
                              {searchQuery && (
                                <motion.button
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.15 }}
                                  onClick={() => setSearchQuery("")}
                                  className="absolute right-3 top-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                                  aria-label="Xóa nội dung tìm kiếm"
                                >
                                  <XIcon size={16} />
                                </motion.button>
                              )}
                            </div>

                            <div className="flex border-b border-gray-700/50 mb-4">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setMediaActiveTab("media")}
                                className={`flex-1 py-2 px-4 text-sm font-medium transition-all ${
                                  mediaActiveTab === "media"
                                    ? "border-b-2 border-blue-500 text-white"
                                    : "text-gray-400 hover:text-gray-200"
                                }`}
                                aria-selected={mediaActiveTab === "media"}
                                role="tab"
                              >
                                <div className="flex items-center justify-center">
                                  <ImageIcon
                                    size={16}
                                    className="mr-1 text-blue-400"
                                  />
                                  Ảnh/Video
                                </div>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setMediaActiveTab("files")}
                                className={`flex-1 py-2 px-4 text-sm font-medium transition-all ${
                                  mediaActiveTab === "files"
                                    ? "border-b-2 border-blue-500 text-white"
                                    : "text-gray-400 hover:text-gray-200"
                                }`}
                                aria-selected={mediaActiveTab === "files"}
                                role="tab"
                              >
                                <div className="flex items-center justify-center">
                                  <FileIcon
                                    size={16}
                                    className="mr-1 text-gray-400"
                                  />
                                  Tệp
                                </div>
                              </motion.button>
                            </div>

                            <AnimatePresence mode="wait">
                              {mediaActiveTab === "media" ? (
                                <motion.div
                                  key="media"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {filteredMediaFiles.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-2">
                                      {filteredMediaFiles.map(
                                        (file: any, idx: number) => (
                                          <DocumentItem
                                            key={idx}
                                            file={file}
                                            openModal={setSelectedFile}
                                          />
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-gray-400 text-sm text-center">
                                      Không tìm thấy ảnh hoặc video
                                    </p>
                                  )}
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="files"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {filteredOtherFiles.length > 0 ? (
                                    <div className="space-y-2">
                                      {filteredOtherFiles.map(
                                        (file: any, idx: number) => (
                                          <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() =>
                                              setSelectedFile(file)
                                            }
                                            className="flex items-center space-x-2 bg-gray-700/50 backdrop-blur-sm p-3 rounded-lg hover:bg-gray-600/70 cursor-pointer border border-gray-600/30 transition-all"
                                          >
                                            <FileTypeIcon
                                              mimeType={getMimeType(file.name)}
                                            />
                                            <div className="flex-1">
                                              <p className="text-sm text-gray-200 truncate">
                                                {truncateString(file.name, 50)}
                                              </p>
                                              <p className="text-xs text-gray-400">
                                                {parseCustomDateString(
                                                  messages.find((msg: any) =>
                                                    msg.document?.includes(
                                                      file.name
                                                    )
                                                  )?.createdDate
                                                ).toLocaleString("vi-VN", {
                                                  day: "2-digit",
                                                  month: "2-digit",
                                                  year: "numeric",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                })}
                                              </p>
                                            </div>
                                          </motion.div>
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-gray-400 text-sm text-center">
                                      Không tìm thấy tệp
                                    </p>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-4 border-b border-gray-700/50 flex items-center justify-between bg-gray-800/30 backdrop-blur-md">
                          <h2 className="text-lg font-semibold text-white">
                            Tìm kiếm tin nhắn
                          </h2>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setPanelState(null)}
                            className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                          >
                            <XIcon size={20} />
                          </motion.button>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                          <div className="relative mb-4">
                            <SearchIcon
                              size={16}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type="text"
                              value={searchMessages}
                              onChange={(e) =>
                                setSearchMessages(e.target.value)
                              }
                              placeholder="Tìm kiếm tin nhắn..."
                              className="w-full pl-10 pr-10 p-3 bg-gray-700/50 border border-gray-600/30 rounded-xl text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                            {searchMessages.length > 0 && (
                              <button
                                onClick={() => setSearchMessages("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                                aria-label="Xóa nội dung tìm kiếm"
                              >
                                <XIcon size={16} />
                              </button>
                            )}
                          </div>
                          {filteredMessages.length > 0 ? (
                            filteredMessages.map((message: any) => (
                              <motion.div
                                key={message.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => scrollToMessage(message.id)}
                                className="p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer mb-2 border border-gray-600/30 transition-all flex items-start space-x-3"
                                role="button"
                              >
                                {selectedConversation.kind !==
                                  GEMINI_BOT_CONFIG.kind && (
                                  <>
                                    {message.sender.avatarPath ? (
                                      <img
                                        src={getMediaImage(
                                          message.sender.avatarPath
                                        )}
                                        className="w-8 h-8 rounded-full object-cover border border-gray-600 shadow-md"
                                      />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-gray-700 border border-gray-600 shadow-md flex items-center justify-center">
                                        <UserIcon
                                          size={20}
                                          className="text-gray-300"
                                        />
                                      </div>
                                    )}
                                  </>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between">
                                    <p className="text-sm font-semibold text-blue-500 truncate">
                                      {selectedConversation?.kind ===
                                      GEMINI_BOT_CONFIG.kind ? (
                                        <>
                                          {message.role ===
                                          CHAT_HISTORY_ROLE.USER
                                            ? "Bạn"
                                            : GEMINI_BOT_CONFIG.name}
                                        </>
                                      ) : (
                                        <>{message.sender?.fullName}</>
                                      )}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {parseCustomDateString(
                                        message.createdDate
                                      ).toLocaleString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-200 truncate">
                                    {selectedConversation?.kind ===
                                    GEMINI_BOT_CONFIG.kind
                                      ? truncateString(message.message, 50)
                                      : truncateString(message.content, 50)}
                                  </p>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <p className="text-gray-400 text-sm text-center">
                              Không tìm thấy tin nhắn
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {selectedFile && (
                <FileModal
                  file={selectedFile}
                  onClose={() => setSelectedFile(null)}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </>
  );
};

export default InternalChatPage;
