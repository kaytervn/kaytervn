import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { MessageModel } from "@/src/models/chat/MessageModel";
import defaultUserImg from "../../../assets/user_icon.png";
import { decrypt, encrypt } from "@/src/types/utils";
import ModalConfirm from "@/src/components/post/ModalConfirm";
import { Ionicons } from "@expo/vector-icons";
import useFetch from "../../hooks/useFetch";
import { successToast } from "@/src/types/toast";

import MenuClick from "@/src/components/post/MenuClick";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ModalUpdate from "@/src/components/chat/ModalUpdate";
import { LoadingDialog } from "@/src/components/Dialog";
import ModalSingleImageComponent from "@/src/components/post/ModalSingleImageComponent";

const MessageItem = ({
  item,
  userSecretKey,
  onItemUpdate,
  onItemDelete,
  navigation,
}: any) => {
  const { put, post, del, loading } = useFetch();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [isModalImageVisible, setIsModalImageVisible] = useState(false);

  const handleImagePress = () => {
    setIsModalImageVisible(true);
  };
  const [editedContent, setEditedContent] = useState(
    decrypt(item.content, userSecretKey)
  );

  const handleToggleReaction = async () => {
    let updatedItem = { ...item };
    try {
      if (item.isReacted) {
        updatedItem.isReacted = 0;
        updatedItem.totalReactions--;
        onItemUpdate(updatedItem);
        const reactResponse = await del(
          `/v1/message-reaction/delete/${item._id}`
        );
        if (!reactResponse.result) {
          throw new Error("Failed to unlike");
        }
      } else {
        updatedItem.isReacted = 1;
        updatedItem.totalReactions++;
        onItemUpdate(updatedItem);
        const reactResponse = await post("/v1/message-reaction/create", {
          message: item._id,
        });
        if (!reactResponse.result) {
          throw new Error("Failed to like");
        }
      }
    } catch (error) {
      // Revert UI if something goes wrong
      onItemUpdate(item);
      console.error("Error updating like status:", error);
    }
  };

  const handleUpdate = () => {
    setShowMenu(false);
    setShowUpdateModal(true);
  };

  const handleUpdateCancel = () => {
    setEditedContent(decrypt(item.content, userSecretKey));
    setShowUpdateModal(false);
  };

  const handleUpdateConfirm = async (content: string) => {
    setEditedContent(content);
    if (!content.trim()) {
      Alert.alert("Lỗi", "Nội dung tin nhắn không được để trống");
      return;
    }

    setShowUpdateModal(false);
    setLoadingDialog(true);

    try {
      const encryptedContent = encrypt(content, userSecretKey);
      const response = await put(`/v1/message/update/`, {
        id: item._id,
        content: encryptedContent,
      });

      if (response.result) {
        const updatedMessage = {
          ...item,
          content: encryptedContent,
        };
        Toast.show(successToast("Cập nhật tin nhắn thành công!"));
        onItemUpdate(updatedMessage);
      } else {
        throw new Error("Failed to update item");
      }
    } catch (error) {
      console.error("Lỗi cập nhật tin nhắn:", error);
      Alert.alert("Lỗi cập nhật tin nhắn. Vui lòng thử lại.");
    } finally {
      setLoadingDialog(false);
    }
  };

  const handleMenuPress = () => {
    setShowMenu(!showMenu);
  };

  const handleDeletePress = () => {
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    setLoadingDialog(true);
    try {
      const response = await del(`/v1/message/delete/${item._id}`);
      if (response.result) {
        Toast.show(successToast("Xóa tin nhắn thành công!"));
        onItemDelete(item._id);
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      console.error("Lỗi xóa tin nhắn:", error);
      Alert.alert("Lỗi xóa tin nhắn. Vui lòng thử lại.");
    } finally {
      setLoadingDialog(false);
    }
  };

  return (
    <View>
      {item.imageUrl && (
        <TouchableOpacity
          onPress={handleImagePress}
          style={[
            styles.imageWrapper,
            item.isOwner
              ? { alignSelf: "flex-end" }
              : { alignSelf: "flex-start", marginLeft: 50 },
          ]}
        >
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.imageStyle}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onLongPress={item.isOwner ? handleMenuPress : undefined}
        style={styles.messageItemContainer}
      >
        {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}

        <View style={styles.messageItem}>
          <View
            style={[
              styles.messageContainer,
              item.isOwner ? styles.myMessage : styles.otherMessage,
            ]}
          >
            {!item.isOwner && (
              <Image
                source={
                  item.user.avatarUrl
                    ? { uri: item.user.avatarUrl }
                    : defaultUserImg
                }
                style={styles.messageAvatar}
              />
            )}
            <View
              style={[
                styles.messageBubble,
                item.isOwner
                  ? styles.myMessageBubble
                  : styles.otherMessageBubble,
              ]}
            >
              {!item.isOwner && (
                <Text style={styles.senderName}>{item.user.displayName}</Text>
              )}
              <Text
                style={[
                  styles.messageText,
                  item.isOwner ? styles.myMessageText : styles.otherMessageText,
                ]}
              >
                {decrypt(item.content, userSecretKey)}
              </Text>

              <Text style={styles.messageTime}>{item.createdAt}</Text>
              <View
                style={[
                  item.isOwner
                    ? styles.ownReactionContainer
                    : styles.otherReactionContainer,
                ]}
              >
                <TouchableOpacity
                  onPress={handleToggleReaction}
                  style={[
                    item.isOwner
                      ? styles.ownReactionButton
                      : styles.otherReactionButton,
                  ]}
                >
                  <Ionicons
                    name={item.isReacted ? "heart" : "heart-outline"}
                    size={15}
                    color={
                      item.isReacted
                        ? "#e74c3c"
                        : item.Owner
                        ? "#ffffff"
                        : "#7f8c8d"
                    }
                  />
                </TouchableOpacity>

                <Text
                  style={[
                    item.isOwner
                      ? styles.ownReactionCount
                      : styles.reactionCount,
                  ]}
                >
                  {item.totalReactions}
                </Text>
              </View>
            </View>

            <ModalSingleImageComponent
              imageUri={item.imageUrl}
              isVisible={isModalImageVisible}
              onClose={() => setIsModalImageVisible(false)}
            />

            <MenuClick
              titleUpdate={"Chỉnh sửa tin nhắn"}
              titleDelete={"Xóa tin nhắn"}
              isVisible={showMenu}
              onClose={() => setShowMenu(false)}
              onUpdate={handleUpdate}
              onDelete={handleDeletePress}
            />

            <ModalConfirm
              isVisible={showDeleteModal}
              title="Bạn sẽ xóa tin nhắn này chứ?"
              onClose={handleDeleteCancel}
              onConfirm={handleDeleteConfirm}
            />

            <ModalUpdate
              visible={showUpdateModal}
              onCancel={handleUpdateCancel}
              onUpdate={handleUpdateConfirm}
              initialContent={editedContent}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  messageItemContainer: {
    paddingStart: 5,
  },
  messageContainer: {},
  myMessage: {
    justifyContent: "flex-end",

    flexDirection: "row",
    marginVertical: 4,
    marginHorizontal: 8,
    position: "relative",
  },
  otherMessage: {
    justifyContent: "flex-start",
    flexDirection: "row",
    marginVertical: 4,
    marginHorizontal: 8,
    paddingEnd: 10,
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,

    alignSelf: "flex-start",
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
    alignSelf: "flex-start",
  },
  menuIcon: {
    padding: 8,
    marginLeft: 4,
    alignSelf: "center",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f1f1f1",
  },
  confirmButton: {
    backgroundColor: "#059BF0",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "white",
  },
  //Reaction
  otherReactionButton: {
    marginTop: 4,
    alignSelf: "flex-end",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 2,
  },
  ownReactionButton: {
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 2,
  },
  reactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    position: "absolute",
    bottom: -5,
    right: 10,
  },
  ownReactionContainer: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    position: "absolute",
    bottom: -12,
    right: 5,
  },
  otherReactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    position: "absolute",
    bottom: -12,
    right: 5,
  },
  reactionCount: {
    marginLeft: 2,
    marginTop: 4,
    fontSize: 11,
    color: "#000000",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    paddingHorizontal: 5,
  },
  ownReactionCount: {
    marginLeft: 2,
    marginTop: 4,
    fontSize: 11,
    color: "#000000",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    paddingHorizontal: 5,
  },
  messageItem: {
    marginBottom: 10,
  },
  imageWrapper: {
    marginVertical: 10,
  },
  imageStyle: {
    width: 250,
    height: 250,
  },
});

export default MessageItem;
