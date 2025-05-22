import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CommentModel } from "@/src/models/comment/CommentModel";
import useFetch from "../../hooks/useFetch";
import MenuClick from "@/src/components/post/MenuClick";
import Toast from "react-native-toast-message";
import { successToast } from "@/src/types/toast";
import { avatarDefault } from "@/src/types/constant";
import { LoadingDialog } from "@/src/components/Dialog";
import ModalSingleImageComponent from "@/src/components/post/ModalSingleImageComponent";
import ModalConfirm from "@/src/components/post/ModalConfirm";

const ChildCommentItem = ({
  item,
  navigation,
  onItemUpdate,
  onItemDelete,
}: any) => {
  const { post, del, loading } = useFetch();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [isModalImageVisible, setIsModalImageVisible] = useState(false);

  const handleImagePress = () => {
    setIsModalImageVisible(true);
  };
  const handleLikeComment = async (comment: CommentModel) => {
    let updatedComment = { ...comment };
    try {
      if (comment.isReacted) {
        updatedComment.isReacted = 0;
        updatedComment.totalReactions = comment.totalReactions - 1;
        onItemUpdate(updatedComment);
        const reactResponse = await del(
          `/v1/comment-reaction/delete/${comment._id}`
        );
        if (!reactResponse.result) {
          throw new Error("Failed to unlike comment");
        }
      } else {
        updatedComment.isReacted = 1;
        updatedComment.totalReactions = comment.totalReactions + 1;
        onItemUpdate(updatedComment);
        const reactResponse = await post("/v1/comment-reaction/create", {
          comment: comment._id,
        });
        if (!reactResponse.result) {
          throw new Error("Failed to like comment");
        }
      }
    } catch (error) {
      onItemUpdate(item);
      console.error("Error updating like status:", error);
    }
  };

  const handleMenuPress = () => {
    setShowMenu(!showMenu);
  };

  const handleUpdate = () => {
    setShowMenu(false);
    navigation.navigate("CommentUpdate", {
      item: item,
      onItemUpdate: (updatedItem: CommentModel | null) => {
        if (updatedItem) {
          handleItemUpdate(updatedItem);
        }
      },
    });
  };

  const handleItemUpdate = (updatedItem: CommentModel) => {
    onItemUpdate(updatedItem);
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
      console.log("item._id", item._id);
      const response = await del(`/v1/comment/delete/${item._id}`);
      if (response.result) {
        onItemDelete(item._id, true);
        Toast.show(successToast("Xóa bình luận thành công!"));
      } else {
        throw new Error("Lỗi xóa bình luận");
      }
    } catch (error) {
      console.error("Lỗi xóa bình luận:", error);
      Alert.alert("Lỗi xóa bình luận. Vui lòng thử lại.");
    } finally {
      setLoadingDialog(false);
    }
  };

  return (
    <View style={styles.childCommentItem}>
      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}
      <Image
        source={
          item.user.avatarUrl ? { uri: item.user.avatarUrl } : avatarDefault
        }
        style={styles.childAvatar}
      />
      <View style={styles.childCommentContent}>
        <Text style={styles.authorName}>{item.user.displayName}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
        {item.imageUrl && (
          <TouchableOpacity onPress={handleImagePress}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.childCommentImage}
              resizeMode="contain"
            />
        </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLikeComment(item)}
        >
          <Ionicons
            name={item.isReacted ? "heart" : "heart-outline"}
            size={24}
            color={item.isReacted ? "#e74c3c" : "#7f8c8d"}
          />
          <Text style={styles.actionText}>{item.totalReactions}</Text>
        </TouchableOpacity>
      </View>

      {item.isOwner == 1 && (
        <TouchableOpacity
          style={styles.menuIconContainer}
          onPress={handleMenuPress}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#7f8c8d" />
        </TouchableOpacity>
      )}

      <ModalSingleImageComponent
            imageUri={item.imageUrl}
            isVisible={isModalImageVisible}
            onClose={() => setIsModalImageVisible(false)}
          />

      <MenuClick
        titleUpdate={"Chỉnh sửa bình luận"}
        titleDelete={"Xóa bình luận"}
        isVisible={showMenu}
        onClose={() => setShowMenu(false)}
        onUpdate={handleUpdate}
        onDelete={handleDeletePress}
      />

      <ModalConfirm
        isVisible={showDeleteModal}
        title="Bạn sẽ xóa bình luận này chứ?"
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  childCommentItem: {
    flexDirection: "row",
  },
  childAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  childCommentContent: {
    flex: 1
  },
  authorName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
    marginBottom: 5,
  },
  childCommentImage: {
    width: "100%",
    height: 200,
    alignSelf: "flex-start",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#888",
  },

  //menu
  menuIconContainer: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});

export default ChildCommentItem;
