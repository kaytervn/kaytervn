import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  Send,
  Plus,
  ImageIcon,
  MoreHorizontal,
  MoreVertical,
  Lock,
  Edit,
  Edit2,
  Edit3Icon,
  Edit2Icon,
  EditIcon,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import useFetch from "../../hooks/useFetch";
import { LoadingDialog } from "@/src/components/Dialog";
import { MessageModel } from "@/src/models/chat/MessageModel";
import defaultUserImg from "../../../assets/user_icon.png";
import { ConversationModel } from "@/src/models/chat/ConversationModel";
import { UserModel } from "@/src/models/user/UserModel";
import { decrypt, encrypt, uploadImage } from "@/src/types/utils";
import HeaderLayout from "@/src/components/header/Header";
import { remoteUrl } from "@/src/types/constant";
import { io, Socket } from "socket.io-client";
import MessageItem from "./MessageItem";
import Toast, { ErrorToast } from "react-native-toast-message";
import { errorToast, successToast } from "@/src/types/toast";
import eventBus from "@/src/types/eventBus";
import HeaderLayout2 from "@/src/components/header/HeaderLayout2";
import MenuManageConversation from "@/src/components/MenuManageConversation";
import { useRefresh } from "../home/RefreshContext";
import { set } from "lodash";
import MenuClick from "@/src/components/post/MenuClick";
import ModalConfirm from "@/src/components/post/ModalConfirm";

const ChatDetail = ({ route, navigation }: any) => {
  const [item, setItem] = useState<ConversationModel>(route.params?.item);
  const user: UserModel = route.params?.user;
  const [modalVisible, setModalVisible] = useState(false);
  const { get, post, put, del, loading } = useFetch();
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const socketRef = useRef<Socket | null>(null);
  const size = 10;
  const { refreshTrigger } = useRefresh();

  const [canAddMember, setCanAddMember] = useState(item.canAddMember);
  const [canMessage, setCanMessage] = useState(item.canMessage);
  const [canUpdate, setCanUpdate] = useState(item.canUpdate);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [sending, setSending] = useState(false);

  useEffect(() => {
    // navigation.setOptions({
    //   title: item.name,
    //   headerRight: () =>
    //     item.canAddMember &&
    //     item.kind == 1 && (
    //       <TouchableOpacity
    //         onPress={() => navigation.navigate("AddMember", { item })}
    //         style={styles.headerButton}
    //       >
    //         <Plus size={24} color="#059BF0" />
    //       </TouchableOpacity>
    //     ),
    // });

    fetchMessages(0);
    initializeSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.emit("LEAVE_CONVERSATION", item._id);
        socketRef.current.disconnect();
      }
      eventBus.off("REFRESH_DATA", handleRefresh);
    };
  }, []);

  useEffect(() => {
    fetchConversation();
  }, [refreshTrigger]);

  const fetchConversation = async () => {
    try {
      const res = await get(`/v1/conversation/get/${item._id}`);
      setItem(res.data);
      console.log("item", res.data);
      setCanAddMember(res.data.canAddMember);
      setCanMessage(res.data.canMessage);
      setCanUpdate(res.data.canUpdate);
    } catch (error) {
      console.error("Error fetching conversation data:", error);
    }
  };

  const fetchNewMessage = async (messageId: string) => {
    try {
      const res = await get(`/v1/message/get/${messageId}`);
      const newMessage = res.data;
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      if (newMessage.isOwner) {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }
    } catch (error) {
      console.error("Error fetching message data:", error);
    }
  };

  const fetchUpdateMessage = async (messageId: string) => {
    try {
      // Encrypt the updated message content
      const res = await get(`/v1/message/get/${messageId}`);
      const updatedMessage = res.data;

      // Update the messages state with the new message
      setMessages((prevMessages) => {
        const index = prevMessages.findIndex((msg) => msg._id === messageId);
        if (index !== -1) {
          const newMessages = [...prevMessages];
          newMessages[index] = updatedMessage;
          return newMessages;
        }
        return prevMessages;
      });
    } catch (error) {
      console.error("Lỗi mạng!", error);
    }
  };

  const fetchDeleteMessage = async (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId)
    );
  };

  const fetchMessages = async (pageNumber: number) => {
    try {
      const res = await get(`/v1/message/list/`, {
        page: pageNumber,
        size,
        conversation: item._id,
      });

      const newMessages = res.data.content;
      if (pageNumber === 0) {
        setMessages([...newMessages]);
      } else {
        setMessages((prev) => [...prev, ...newMessages]);
      }
      setHasMore(newMessages.length === size);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchConversation();
    fetchMessages(0).then(() => setRefreshing(false));
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchMessages(page + 1);
    }
  };

  const initializeSocket = () => {
    const socket = io(remoteUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    socket.on("connect", () => {
      console.log("Socket.IO Connected");
      // Join conversation room on connect
      socket.emit("JOIN_CONVERSATION", item._id);
      // socket.emit("JOIN_NOTIFICATION", user._id);
    });

    // socket.on("NEW_NOTIFICATION", async (profile: UserModel) => {
    //   console.log("NEW_NOTIFICATION_CHAT");
    //   fetchConversation();
    // });

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO Disconnected:", reason);
    });

    socket.on("CREATE_MESSAGE", async (messageId: string) => {
      await fetchNewMessage(messageId);
    });

    socket.on("UPDATE_MESSAGE", async (messageId: string) => {
      console.log("UPDATE MESSAGE");
      await fetchUpdateMessage(messageId);
    });

    socket.on("DELETE_MESSAGE", (messageId: string) => {
      fetchDeleteMessage(messageId);
    });

    socketRef.current = socket;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;
    if (!inputMessage.trim()) {
      Toast.show(errorToast("Bạn chưa điền nội dung!"));
      return;
    }
    // setLoadingDialog(true);
    setSending(true);
    try {
      let messageData: any = {
        conversation: item._id,
      };

      // Handle image upload if present
      if (selectedImage) {
        const imageUrl = await uploadImage(selectedImage, post);
        messageData.imageUrl = imageUrl;
      }

      // Handle text content if present
      if (inputMessage.trim()) {
        const messageEncrypt = encrypt(inputMessage.trim(), user.secretKey);
        messageData.content = messageEncrypt;
      }

      const res = await post("/v1/message/create", messageData);

      // Clear input states
      setInputMessage("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: MessageModel }) => {
    return (
      <MessageItem
        item={item}
        userSecretKey={user.secretKey}
        onItemUpdate={() => {}}
        onItemDelete={() => {}}
        navigation={navigation}
      />
    );
  };

  const handleGoBack = () => {
    route.params?.onRefresh();
    navigation.goBack();
  };

  const handleModelVisible = () => {
    setModalVisible(true);
  };

  const handleAddMember = () => {
    navigation.navigate("AddMember", {
      item: item,
      user: user,
      onRefresh: () => {
        handleRefresh();
      },
    });
  };

  const handlePermissionAddMember = async () => {
    setLoadingDialog(true);
    const data = {
      id: item._id,
      canAddMember: canAddMember ? 0 : 1,
    };
    setCanAddMember(canAddMember ? 0 : 1);
    await put(`/v1/conversation/permission`, data);
    setLoadingDialog(false);
  };
  const handlePermissionCanMessage = async () => {
    setLoadingDialog(true);
    const data = {
      id: item._id,
      canMessage: canMessage ? 0 : 1,
    };
    setCanMessage(canMessage ? 0 : 1);
    await put(`/v1/conversation/permission`, data);
    setLoadingDialog(false);
  };
  const handlePermissionCanUpdate = async () => {
    setLoadingDialog(true);
    const data = {
      id: item._id,
      canUpdate: canUpdate ? 0 : 1,
    };
    setCanUpdate(canUpdate ? 0 : 1);
    await put(`/v1/conversation/permission`, data);
    setLoadingDialog(false);
  };

  const handleUpdateConversation = async () => {
    setModalVisible(false);
    navigation.navigate("UpdateGroup", {
      item,
      onRefresh: () => {
        handleRefresh();
      },
    });
  };

  const handleDeleteConversation = async () => {
    setLoadingDialog(true);
    const res = await del(`/v1/conversation/delete/${item._id}`);
    if (res.result) {
      Toast.show(successToast("Xóa cuộc trò chuyện thành công"));
    }
    setLoadingDialog(false);
    handleGoBack();
  };

  const handleSettingConversation = () => {
    if (item.isOwner) {
      handleModelVisible();
    } else {
      if (canUpdate) {
        handleUpdateConversation();
      }
    }
  };

  const getIcon = () => {
    if (item.isOwner) {
      return MoreVertical;
    } else {
      if (canUpdate) {
        return Edit;
      }
    }
    return null;
  };

  const handleWatchMembers = () => {
    navigation.navigate("WatchMember", {
      item,
      user,
      onRefresh: () => {
        handleRefresh();
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}

      <HeaderLayout2
        title={item.name}
        subtitle={item.kind == 1 && item.totalMembers + " thành viên"}
        onTitlePress={() => handleWatchMembers()}
        showBackButton={true}
        onBackPress={() => handleGoBack()}
        onRightIcon2Press={() => handleAddMember()}
        onRightIcon1Press={() => handleSettingConversation()}
        RightIcon2={
          item.isOwner || (canAddMember && item.kind === 1) ? Plus : null
        }
        RightIcon1={getIcon()}
        titleLeft={true}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => `${item._id} - ${index}`}
        renderItem={renderMessage}
        inverted={true}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loading && hasMore ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : null
        }
        contentContainerStyle={styles.flatListContent}
      />

      <MenuManageConversation
        titleUpdate="Cập nhật cuộc trò truyện"
        titleDelete="Xóa cuộc trò truyện"
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onUpdate={() => handleUpdateConversation()}
        onDelete={() => setShowDeleteModal(true)}
        onAddMemberToggle={() => handlePermissionAddMember()}
        onMessageToggle={() => {
          handlePermissionCanMessage();
        }}
        onUpdateGroupToggle={() => {
          handlePermissionCanUpdate();
        }}
        initialAddMember={!!canAddMember}
        initialMessage={!!canMessage}
        initialUpdateGroup={!!canUpdate}
      />

      <ModalConfirm
        isVisible={showDeleteModal}
        title="Xác cuộc trò chuyện này?"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConversation}
      />

      {item.isOwner || (canMessage == 1 && item.kind == 1) || item.kind == 2 ? (
        <View>
          {selectedImage && (
            <View style={styles.selectedImageContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.selectedImage}
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <Text style={styles.removeImageText}>×</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Nhập tin nhắn..."
              multiline
            />
            <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
              <ImageIcon size={24} color="#059BF0" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={(!inputMessage.trim() && !selectedImage) || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#059BF0" />
              ) : (
                <Send
                  size={24}
                  color={
                    inputMessage.trim() || selectedImage ? "#059BF0" : "#999"
                  }
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.noMessagePermissionContainer}>
          <Text style={styles.noMessagePermissionText}>
            Bạn không có quyền nhắn tin
          </Text>
        </View>
      )}

      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  flatListContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingTop: 15,
  },
  headerButton: {
    marginRight: 15,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 4,
    marginHorizontal: 8,
  },
  myMessage: {
    justifyContent: "flex-end",
  },
  otherMessage: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    alignSelf: "flex-end",
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: "#059BF0",
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: "white",
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  myMessageText: {
    color: "white",
  },
  otherMessageText: {
    color: "black",
  },
  messageTime: {
    fontSize: 10,
    color: "#rgba(0, 0, 0, 0.5)",
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: "#f8f8f8",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedImageContainer: {
    padding: 8,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  noPermissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  noPermissionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    textAlign: "center",
  },
  noPermissionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
  noMessagePermissionContainer: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  noMessagePermissionText: {
    color: "#666",
    fontSize: 14,
  },
});

export default ChatDetail;
