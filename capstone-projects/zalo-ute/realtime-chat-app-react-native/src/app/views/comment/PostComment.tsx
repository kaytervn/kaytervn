import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { BottomSheetModal, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import {
  Send,
  Heart,
  MessageCircle,
  ImageIcon,
  ChevronUp,
  ChevronDown,
  X,
  Bold,
} from "lucide-react-native";
import useFetch from "../../hooks/useFetch";
import { LoadingDialog } from "@/src/components/Dialog";
import EmptyComponent from "@/src/components/empty/EmptyComponent";
import { CommentModel } from "@/src/models/comment/CommentModel";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "@/src/types/utils";
import { Ionicons } from "@expo/vector-icons";

import Toast from "react-native-toast-message";
import { successToast } from "@/src/types/toast";
import PostCommentItem from "./PostCommentItem";
import MenuClick from "@/src/components/post/MenuClick";
import { avatarDefault } from "@/src/types/constant";
import ModalSingleImageComponent from "@/src/components/post/ModalSingleImageComponent";

const PostComment = ({
  navigation,
  postItem,
  onItemAdded,
  onItemDeleted,
  onItemReply,
  userAvatar,
}: any) => {
  const { get, post, del, loading } = useFetch();
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalComments, setTotalComments] = useState(postItem.totalComments);
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: CommentModel[];
  }>({});
  const [loadingChildren, setLoadingChildren] = useState<{
    [key: string]: boolean;
  }>({});
  const [replyingTo, setReplyingTo] = useState<CommentModel | null>(null);
  const inputRef = useRef<TextInput>(null);
  
  const commentSize = 10;

  const fetchComments = useCallback(
    async (pageNumber: number) => {
      setLoadingDialog(true);
      try {
        const res = await get(`/v1/comment/list`, {
          post: postItem._id,
          page: pageNumber,
          size: commentSize,
          ignoreChildren: 1,
        });
        const newComments = res.data.content;
        setComments((prev) =>
          pageNumber === 0 ? newComments : [...prev, ...newComments]
        );
        setHasMore(newComments.length === commentSize);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally{
        setLoadingDialog(false);
      }
    },
    [get, postItem._id]
  );

  const handleLoadMoreComments = () => {
    if (hasMore && !loading) {
      fetchComments(Math.ceil(comments.length / commentSize));
    }
  };

  const handleItemUpdate = async (updatedComment: CommentModel) => {
    if (updatedComment.isChildren) {
      setExpandedComments((prevExpandedComments) => {
        const updatedExpandedComments = { ...prevExpandedComments };
        for (const parentId in updatedExpandedComments) {
          updatedExpandedComments[parentId] = updatedExpandedComments[
            parentId
          ].map((c) => (c._id === updatedComment._id ? updatedComment : c));
        }
        return updatedExpandedComments;
      });
    } else {
      setComments((prevComments) => {
        const index = prevComments.findIndex(
          (comment) => comment._id === updatedComment._id
        );
        if (index !== -1) {
          const newComments = [...prevComments];
          newComments[index] = updatedComment;
          return newComments;
        }
        return prevComments;
      });
    }
  };

  const handleItemDelete = (itemId: string, isChildren: boolean) => {
    if (isChildren) {
      setExpandedComments((prevExpandedComments) => {
        const updatedExpandedComments = { ...prevExpandedComments };
        for (const parentId in updatedExpandedComments) {
          updatedExpandedComments[parentId] = updatedExpandedComments[
            parentId
          ].filter((comment) => comment._id !== itemId);
        }
        return updatedExpandedComments;
      });
    } else {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== itemId)
      );
    }
    setTotalComments(totalComments - 1);
    onItemDeleted();
  };

  const createComment = async () => {
    if (!newComment.trim() && !selectedImage) return;
    setLoadingDialog(true);
    try {
      let params = {
        post: postItem._id,
        content: newComment,
        parent: replyingTo ? replyingTo._id : null,
        imageUrl: "",
      };

      if (selectedImage) {
        params.imageUrl = await uploadImage(selectedImage, post);
      }
      await post(`/v1/comment/create`, params);
      if (replyingTo) {
        setComments((prevComments) => 
          prevComments.map((comment) => 
            comment._id === replyingTo._id
              ? { ...comment, totalChildren: (comment.totalChildren || 0) + 1 }
              : comment
          )
        );
        setLoadingDialog(false);
      } else {
        // Refresh top-level comments if not replying
        fetchComments(0);
      }
      setNewComment("");
      setSelectedImage(null);
      setReplyingTo(null);
      setTotalComments(totalComments + 1);
      onItemAdded();
    } catch (error) {
      console.error("Error posting comment:", error);
    } 
  };

  useEffect(() => {
    console.log("Comments state updated:", comments);
  }, [comments]);

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

  // Child comments
  const fetchChildComments = async (parentId: string, postId: string) => {
    setLoadingChildren((prev) => ({ ...prev, [parentId]: true }));
    try {
      const res = await get(`/v1/comment/list`, {
        parent: parentId,
        post: postId,
        isPaged: 0,
      });
      const childComments = res.data.content;
      setExpandedComments((prev) => ({ ...prev, [parentId]: childComments }));
    } catch (error) {
      console.error("Error fetching child comments:", error);
    } finally {
      setLoadingChildren((prev) => ({ ...prev, [parentId]: false }));
      setLoadingDialog(false);
    }
  };

  const toggleChildComments = (commentId: string, postId: string) => {
    console.log("post Id:", postId)
    if (expandedComments[commentId]) {
      // If already expanded, collapse
      setExpandedComments((prev) => {
        const newState = { ...prev };
        delete newState[commentId];
        return newState;
      });
    } else {
      // If not expanded, fetch child comments
      fetchChildComments(commentId, postId);
    }
  };

  // Reply to comment
  const handleReply = (comment: CommentModel) => {
    setReplyingTo(comment);
    console.log(comment)
    console.log(comment.post._id)
    toggleChildComments(comment._id, comment.post._id);
    inputRef.current?.focus();
    onItemReply()
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const renderComment = ({ item }: { item: CommentModel }) => (
    <PostCommentItem
      item={item}
      onItemUpdate={handleItemUpdate}
      onItemDelete={handleItemDelete}
      toggleChildComments={() => {toggleChildComments(item._id, item.post._id)}}
      handleReply={handleReply}
      expandedComments={expandedComments}
      loadingChildren={loadingChildren}
      navigation={navigation}
    />
  );

  return (
    <View style={styles.container}>
      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}
      <View style={styles.postDetailsContainer}>
        <Text style={styles.totalText}>
          {postItem.totalReactions} Lượt thích · {totalComments} Bình luận
        </Text>
      </View>
      <BottomSheetFlatList
        data={comments}
        keyExtractor={(item) => item._id}
        renderItem={renderComment}
        ListEmptyComponent={<EmptyComponent message="No comments yet" />}
        onEndReached={handleLoadMoreComments}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loading && hasMore ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : null
        }
      />
      {replyingTo && (
        <View style={styles.replyingToContainer}>
          <Text style={styles.replyingToText}>
            Phản hồi {replyingTo.user.displayName}
          </Text>
          <TouchableOpacity
            onPress={cancelReply}
            style={styles.cancelReplyButton}
          >
            <X size={20} color="#059BF0" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.inputContainer}>
        <Image
          source={userAvatar ? { uri: userAvatar } : avatarDefault}
          style={styles.avatar}
        />
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={newComment}
          onChangeText={setNewComment}
          placeholder={
            !replyingTo ? "Thêm bình luận..." : "Phản hồi bình luận..."
          }
          multiline
        />
        <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
          <ImageIcon size={20} color="#059BF0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={createComment}>
          <Send size={20} color="#059BF0" />
        </TouchableOpacity>
      </View>
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
      )}

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
  },

  authorName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
    marginBottom: 5,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
  },
  iconButton: {
    padding: 5,
    marginLeft: 5,
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
    alignSelf: "center",
    resizeMode: "contain"
  },
  commentList: {
    flexGrow: 1,
  },
  postDetailsContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  totalText: {
    fontSize: 14,
    color: "#666",
  },

  commentContainer: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  commentContent: {},
  imageWrapper: {
    marginTop: 10,
    alignItems: "flex-start", // Changed from 'center' to 'flex-start'
    justifyContent: "flex-start",
    width: "100%", // Ensure the wrapper takes full width
  },
  commentImage: {
    width: "100%",
    height: 200,
    alignSelf: "flex-start", // Added to ensure the image aligns to the start
  },

  //chilren comment
  childCommentsContainer: {
    marginLeft: 20,
    marginTop: 10,
  },
  childCommentItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  childAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  childCommentContent: {},
  childCommentImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginTop: 5,
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

  //Reply
  replyButtonText: {
    color: "#999999",
    fontSize: 14,
    fontWeight: "semibold",
  },
  replyingToContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  replyingToText: {
    fontSize: 14,
    color: "#555",
  },
  cancelReplyButton: {
    padding: 5,
  },
});

export default PostComment;
