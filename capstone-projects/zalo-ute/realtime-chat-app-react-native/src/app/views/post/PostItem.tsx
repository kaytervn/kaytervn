import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import { PostModel } from "@/src/models/post/PostModel";
import { Ionicons } from "@expo/vector-icons";
import useFetch from "@/src/app/hooks/useFetch";
import ModalListImageComponent from "../../../components/post/ModalListImageComponent";
import MenuClick from "../../../components/post/MenuClick";
import { LoadingDialog } from "../../../components/Dialog";
import Toast from "react-native-toast-message";
import { successToast } from "@/src/types/toast";
import BottomSheet from "@gorhom/bottom-sheet";
import ModalConfirm from "@/src/components/post/ModalConfirm";
const { width, height } = Dimensions.get("window");
const imageWidth = width - 20;

const PostItem = ({
  postItem,
  onPostUpdate,
  onPostDelete,
  onRefresh,
  navigation,
  onCommentPress,
  setIsTabBarVisible,
}: {
  postItem: PostModel;
  onPostUpdate: (post: PostModel) => void;
  onPostDelete: (postId: string) => void;
  onRefresh: () => void;
  navigation: any;
  onCommentPress: (post: PostModel) => void;
  setIsTabBarVisible: (visible: boolean) => void;
}) => {
  const { post, del, loading } = useFetch();
  const liked = postItem.isReacted == 1;
  const likeCount = postItem.totalReactions;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDialog, setLoadingDialog] = useState(false);

  const handleLike = async () => {
    let updatedPost = { ...postItem };
    try {
      if (liked) {
        updatedPost.isReacted = 0;
        updatedPost.totalReactions = likeCount - 1;
        onPostUpdate(updatedPost);
        const reactResponse = await del(
          `/v1/post-reaction/delete/${postItem._id}`
        );
        if (!reactResponse.result) {
          throw new Error("Failed to unlike");
        }
      } else {
        updatedPost.isReacted = 1;
        updatedPost.totalReactions = likeCount + 1;
        onPostUpdate(updatedPost);
        const reactResponse = await post("/v1/post-reaction/create", {
          post: postItem._id,
        });
        if (!reactResponse.result) {
          throw new Error("Failed to like");
        }
      }
    } catch (error) {
      // Revert UI if something goes wrong
      onPostUpdate(postItem);
      console.error("Error updating like status:", error);
    }
  };

  const handleCommentPress = () => {
    setIsTabBarVisible(false);
    onCommentPress(postItem);
  };

  const renderStatusIcon = () => {
    if (postItem.kind === 1) {
      return <Ionicons name="earth" size={14} color="#7f8c8d" />;
    } else if (postItem.kind === 2) {
      return <Ionicons name="people" size={14} color="#7f8c8d" />;
    } else {
      return <Ionicons name="lock-closed" size={14} color="#7f8c8d" />;
    }
  };

  const handleImagePress = (index: any) => {
    console.log("Image pressed:", index); // Debugging log
    setSelectedImageIndex(index);
    setIsModalVisible(true);
  };

  const renderImageItem = ({ item, index }: any) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => handleImagePress(index)}
    >
      <Image source={{ uri: item }} style={styles.postImage} />
      {postItem.imageUrls.length > 1 && (
        <Text style={styles.imageCounter}>{`${index + 1}/${
          postItem.imageUrls.length
        }`}</Text>
      )}
    </TouchableOpacity>
  );

  const handleMenuPress = () => {
    setShowMenu(!showMenu);
  };

  const handleUpdate = () => {
    setShowMenu(false);
    navigation.navigate("PostCreateUpdate", {
      post_id: postItem._id,
      onPostUpdate: (updatedPost: PostModel | null) => {
        if (updatedPost) {
          handlePostUpdate(updatedPost);
        }
      },
    });
  };

  const handlePostUpdate = (updatedPost: PostModel) => {
    onPostUpdate(updatedPost);
  };

  const handleDeletePress = () => {
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    setLoadingDialog(true);
    try {
      const response = await del(`/v1/post/delete/${postItem._id}`);
      if (response.result) {
        onPostDelete(postItem._id);
        Toast.show(successToast("Xóa bài đăng thành công!"));
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("Error", "Failed to delete the post. Please try again.");
    } finally {
      setLoadingDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}
        <Image
          source={{
            uri: postItem.user.avatarUrl || "https://via.placeholder.com/40",
          }}
          style={styles.avatar}
        />
        <View style={styles.nameTimeContainer}>
          <Text style={styles.userName}>{postItem.user.displayName}</Text>

          <View style={styles.statusTimeContainer}>
            {renderStatusIcon()}
            <Text style={styles.timeAgo}>{postItem.createdAt}</Text>
            {postItem.status === 2 ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginStart: 5,
                }}
              >
                <Ionicons name="checkmark-circle" size={14} color="#2ecc71" />
                <Text
                  style={{
                    marginHorizontal: 5,
                    color: "#2ecc71",
                    fontSize: 12,
                  }}
                >
                  Đã duyệt
                </Text>
              </View>
            ) : postItem.status === 1 ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginStart: 5,
                }}
              >
                <Ionicons name="time-outline" size={14} color="#7f8c8d" />
                <Text
                  style={{
                    marginHorizontal: 5,
                    color: "#7f8c8d",
                    fontSize: 12,
                  }}
                >
                  Chưa duyệt
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginStart: 5,
                }}
              >
                <Ionicons name="close-circle" size={14} color="#e74c3c" />
                <Text
                  style={{
                    marginHorizontal: 5,
                    color: "#e74c3c",
                    fontSize: 12,
                  }}
                >
                  Từ chối
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <Text style={styles.content}>{postItem.content}</Text>

      {postItem.imageUrls.length > 0 && (
        <FlatList
          data={postItem.imageUrls}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => `thumbnail-${index}`}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          snapToInterval={imageWidth}
          decelerationRate="fast"
          style={styles.imageList}
        />
      )}

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {likeCount} Lượt thích • {postItem.totalComments} Bình luận
        </Text>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={24}
            color={liked ? "#e74c3c" : "#7f8c8d"}
          />
          <Text style={[styles.actionText, liked ? styles.likedText : null]}>
            Thích
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCommentPress}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#7f8c8d" />
          <Text style={styles.actionText}>Bình luận</Text>
        </TouchableOpacity>
      </View>

      {postItem.isOwner == 1 && (
        <TouchableOpacity style={styles.menuIcon} onPress={handleMenuPress}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#7f8c8d" />
        </TouchableOpacity>
      )}

      <ModalListImageComponent
        images={postItem.imageUrls}
        isVisible={isModalVisible}
        initialIndex={selectedImageIndex}
        onClose={() => setIsModalVisible(false)}
      />

      <MenuClick
        titleUpdate={"Chỉnh sửa bài viết"}
        titleDelete={"Xóa bài viết"}
        isVisible={showMenu}
        onClose={() => setShowMenu(false)}
        onUpdate={handleUpdate}
        onDelete={handleDeletePress}
      />

      <ModalConfirm
        isVisible={showDeleteModal}
        title="Bạn sẽ xóa bài viết này chứ?"
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 10,
    marginBottom: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nameTimeContainer: {
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  statusTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeAgo: {
    color: "#7f8c8d",
    fontSize: 12,
    marginLeft: 5,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    marginBottom: 10,
    objectFit: "scale-down",
    backgroundColor: "#f5f5f5",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statsText: {
    color: "#7f8c8d",
    fontSize: 12,
  },
  actionContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
    paddingTop: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 5,
    color: "#7f8c8d",
    fontSize: 14,
  },
  likedText: {
    color: "#e74c3c",
  },
  menuIcon: {
    position: "absolute",
    top: 10,
    right: 0,
    zIndex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  //List Image
  imageList: {
    marginVertical: 10,
  },
  imageContainer: {
    width: imageWidth,
    height: 200,
    marginRight: 10,
    borderRadius: 8,
    overflow: "hidden",
  },

  imageCounter: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "white",
    padding: 5,
    borderRadius: 10,
    fontSize: 12,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImageContainer: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: width,
    height: height,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullScreenCounter: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "white",
    padding: 10,
    borderRadius: 20,
    fontSize: 16,
  },
});

export default PostItem;
