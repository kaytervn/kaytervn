import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ChevronUp, ChevronDown } from "lucide-react-native";
import { CommentModel } from "@/src/models/comment/CommentModel";
import { ActivityIndicator } from "react-native";
import ChildCommentItem from "./PostChildCommentItem";
import MenuClick from "@/src/components/post/MenuClick";
import useFetch from "../../hooks/useFetch";
import { successToast } from "@/src/types/toast";
import Toast from "react-native-toast-message";
import { avatarDefault } from "@/src/types/constant";

import ModalSingleImageComponent from "@/src/components/post/ModalSingleImageComponent";
import { LoadingDialog } from "@/src/components/Dialog";
import ModalConfirm from "@/src/components/post/ModalConfirm";



const PostCommentItem = ({
  item,
  toggleChildComments,
  handleReply,
  expandedComments,
  loadingChildren,
  navigation,
  onItemUpdate,
  onItemDelete,

}: {
  item: CommentModel,
  toggleChildComments: any,
  handleReply: any,
  expandedComments: any,
  loadingChildren: any,
  navigation: any,
  onItemUpdate: any,
  onItemDelete: any,

} ) => {
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
      const response = await del(`/v1/comment/delete/${item._id}`);
      if (response.result) {
        onItemDelete(item._id);
        Toast.show(successToast("Xóa bình luận thành công!"));
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Lỗi xóa bình luận:", error);
      Alert.alert("Lỗi xóa bình luận. Vui lòng thử lại.");
    } finally {
      setLoadingDialog(false);
    }
  };

  const renderChildComments = (parentId: string) => {
    const children = expandedComments[parentId];
    if (!children) return null;
    return (
      <View style={styles.childCommentsContainer}>
        {children.map((child: { _id: any }) => (
          <ChildCommentItem
            key={child._id}
            item={child}
            onItemUpdate={handleChildUpdate}
            onItemDelete={handleChildDelete}
            navigation={navigation}
          />
        ))}
      </View>
    );
  };

  const handleChildUpdate = (updatedItem: CommentModel) => {
    onItemUpdate(updatedItem);
  };

  const handleChildDelete = (childId: string) => {
    item.totalChildren--;
    onItemDelete(childId, true);
  };

  return (
    <View style={styles.commentContainer}>
      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}
      <Image
        source={
          item.user.avatarUrl ? { uri: item.user.avatarUrl } : avatarDefault
        }
        style={styles.avatar}
      />
      <View style={styles.commentContent}>
        <Text style={styles.authorName}>{item.user.displayName}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
        {item.imageUrl && (
            <TouchableOpacity onPress={handleImagePress} style={styles.imageWrapper}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.commentImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        <View style={styles.commentActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLikeComment(item)}
          >
            <Ionicons
              name={item.isReacted ? "heart" : "heart-outline"}
              size={22}
              color={item.isReacted ? "#e74c3c" : "#7f8c8d"}
            />
            <Text style={styles.actionText}>{item.totalReactions}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleChildComments(item._id)}
          >
            <Ionicons name="chatbubble-outline" size={18} color="#7f8c8d" />
            <Text style={styles.actionText}>{item.totalChildren}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleReply(item)}>
            <Text style={styles.replyButtonText}>Phản hồi</Text>
          </TouchableOpacity>
        </View>

        {item.totalChildren > 0 && (
          <TouchableOpacity
            onPress={() => toggleChildComments(item._id)}
            style={styles.viewRepliesButton}
          >
            {loadingChildren[item._id] ? (
              <ActivityIndicator size="small" color="#059BF0" />
            ) : (
              <>
                <Text style={styles.viewRepliesText}>
                  {expandedComments[item._id]
                    ? "Ẩn phản hồi"
                    : `Xem ${item.totalChildren} phản hồi`}
                </Text>
                {expandedComments[item._id] ? (
                  <ChevronUp size={16} color="#059BF0" />
                ) : (
                  <ChevronDown size={16} color="#059BF0" />
                )}
              </>
            )}
          </TouchableOpacity>
        )}

        {renderChildComments(item._id)}
      </View>
      
      {item.isOwner == 1 && (
        <TouchableOpacity style={styles.menuIcon} onPress={handleMenuPress}>
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
  commentContainer: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
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
  imageWrapper: {
    marginTop: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
  commentImage: {
    width: "100%",
    height: 200,
    alignSelf: "flex-start",
  },
  commentActions: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#888",
  },
  replyButtonText: {
    color: "#999999",
    fontSize: 14,
    fontWeight: "semibold",
  },
  viewRepliesButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  viewRepliesText: {
    color: "#059BF0",
    marginRight: 5,
  },
  childCommentsContainer: {
    marginLeft: 20,
    marginTop: 10,
  },

  //menu
  menuIcon: {
    position: "absolute",
    top: 10,
    right: 0,
    zIndex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
});

export default PostCommentItem;
