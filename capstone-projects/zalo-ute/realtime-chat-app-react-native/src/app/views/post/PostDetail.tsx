import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { PostModel } from "@/src/models/post/PostModel";
import { Ionicons } from "@expo/vector-icons";
import useFetch from "@/src/app/hooks/useFetch";
import ModalListImageComponent from "../../../components/post/ModalListImageComponent";
import HeaderLayout from "@/src/components/header/Header";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");
const imageWidth = width - 20;

const PostDetail = ({ navigation, route }: any) => {
  const { get, post, del, loading } = useFetch();
  const [postData, setPostData] = useState<PostModel | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const postId = route.params.postId;

  const fetchPostDetail = useCallback(async () => {
    try {
      const response = await get(`/v1/post/get/${postId}`);
      setPostData(response.data);
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  }, [get, postId]);

  useEffect(() => {
    fetchPostDetail();
  }, []);

  const handleLike = async () => {
    if (!postData) return;

    const liked = postData.isReacted === 1;
    const likeCount = postData.totalReactions;

    try {
      if (liked) {
        setPostData({
          ...postData,
          isReacted: 0,
          totalReactions: likeCount - 1,
        });
        const reactResponse = await del(`/v1/post-reaction/delete/${postId}`);
        if (!reactResponse.result) {
          throw new Error("Failed to unlike");
        }
      } else {
        setPostData({
          ...postData,
          isReacted: 1,
          totalReactions: likeCount + 1,
        });
        const reactResponse = await post("/v1/post-reaction/create", {
          post: postId,
        });
        if (!reactResponse.result) {
          throw new Error("Failed to like");
        }
      }
    } catch (error) {
      // Revert UI if something goes wrong
      setPostData(postData);
      console.error("Error updating like status:", error);
    }
  };

  const renderStatusIcon = () => {
    if (!postData) return null;

    if (postData.kind === 1) {
      return <Ionicons name="earth" size={14} color="#7f8c8d" />;
    } else if (postData.kind === 2) {
      return <Ionicons name="people" size={14} color="#7f8c8d" />;
    } else {
      return <Ionicons name="lock-closed" size={14} color="#7f8c8d" />;
    }
  };

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalVisible(true);
  };

  const renderImageItem = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => handleImagePress(index)}
    >
      <Image source={{ uri: item }} style={styles.postImage} />
      {postData && postData.imageUrls.length > 1 && (
        <Text style={styles.imageCounter}>{`${index + 1}/${
          postData.imageUrls.length
        }`}</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!postData) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy bài viết</Text>
      </View>
    );
  }

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <HeaderLayout
        title="Chi tiết bài viết"
        showBackButton={true}
        onBackPress={() => handleGoBack()}
      />
      <View style={styles.userInfo}>
        <Image
          source={{
            uri: postData.user.avatarUrl || "https://via.placeholder.com/40",
          }}
          style={styles.avatar}
        />
        <View style={styles.nameTimeContainer}>
          <Text style={styles.userName}>{postData.user.displayName}</Text>

          <View style={styles.statusTimeContainer}>
            {renderStatusIcon()}
            <Text style={styles.timeAgo}>{postData.createdAt}</Text>
            {postData.status === 2 ? (
              <View style={styles.statusContainer}>
                <Ionicons name="checkmark-circle" size={14} color="#2ecc71" />
                <Text style={[styles.statusText, { color: "#2ecc71" }]}>
                  Đã duyệt
                </Text>
              </View>
            ) : postData.status === 1 ? (
              <View style={styles.statusContainer}>
                <Ionicons name="time-outline" size={14} color="#7f8c8d" />
                <Text style={[styles.statusText, { color: "#7f8c8d" }]}>
                  Chưa duyệt
                </Text>
              </View>
            ) : (
              <View style={styles.statusContainer}>
                <Ionicons name="close-circle" size={14} color="#e74c3c" />
                <Text style={[styles.statusText, { color: "#e74c3c" }]}>
                  Từ chối
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <Text style={styles.content}>{postData.content}</Text>

      {postData.imageUrls.length > 0 && (
        <FlatList
          data={postData.imageUrls}
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
          {postData.totalReactions} Lượt thích • {postData.totalComments} Bình
          luận
        </Text>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Ionicons
            name={postData.isReacted === 1 ? "heart" : "heart-outline"}
            size={24}
            color={postData.isReacted === 1 ? "#e74c3c" : "#7f8c8d"}
          />
          <Text
            style={[
              styles.actionText,
              postData.isReacted === 1 && styles.likedText,
            ]}
          >
            Thích
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#7f8c8d" />
          <Text style={styles.actionText}>Bình luận</Text>
        </TouchableOpacity>
      </View>

      <ModalListImageComponent
        images={postData.imageUrls}
        isVisible={isModalVisible}
        initialIndex={selectedImageIndex}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
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
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginStart: 5,
  },
  statusText: {
    marginHorizontal: 5,
    fontSize: 12,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  imageList: {
    marginVertical: 10,
  },
  imageContainer: {
    width: imageWidth,
    height: 200,
    marginRight: 10,
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  postImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    objectFit: "scale-down",
    backgroundColor: "#f5f5f5",
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
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
    paddingVertical: 5,
  },
  actionText: {
    marginLeft: 5,
    color: "#7f8c8d",
    fontSize: 14,
  },
  likedText: {
    color: "#e74c3c",
  },
});

export default PostDetail;
