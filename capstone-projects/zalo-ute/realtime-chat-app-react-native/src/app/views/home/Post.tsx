import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useFetch from "../../hooks/useFetch";
import { LoadingDialog } from "@/src/components/Dialog";
import { PostModel } from "@/src/models/post/PostModel";
import PostItem from "@/src/app/views/post/PostItem";
import SearchBar from "@/src/components/search/SearchBar";
import { ChevronsLeftRightIcon, Send } from "lucide-react-native";
import EmptyComponent from "@/src/components/empty/EmptyComponent";
import { useFocusEffect } from "expo-router";
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import PostComment from "../comment/PostComment";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import defaultUserImg from "../../../assets/user_icon.png"

const PostContent = ({ navigation, route, setIsTabBarVisible  }: any) => {
  const { get, loading } = useFetch();
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const isInitialMount = useRef(true);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostModel | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const size = 4;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await get("/v1/user/profile");
        setUserAvatar(res.data.avatarUrl);
        // setUserName(profile.data.displayName);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
    fetchData(0);
  }, []);

  const tabs = [
    { title: "Cộng đồng", getListKind: 1 },
    { title: "Bạn bè", getListKind: 2 },
    { title: "Tôi", getListKind: 3 },
  ];

  const handleSearch = async () => {
    setLoadingDialog(true);
    Keyboard.dismiss();
    await getPosts(0, searchQuery)
    setLoadingDialog(false);
  };

  const clearSearch = async () => {
    setLoadingDialog(true);
    Keyboard.dismiss();
    setSearchQuery("");
    await getPosts(0, "");
  };

  async function getPosts(pageNumber: number, content: string) {
    try {
      const res = await get(`/v1/post/list`, {
        page: pageNumber,
        size,
        getListKind: tabs[activeTab].getListKind,
        content: content
      });
      const newPosts = res.data.content;
      if (pageNumber === 0) {
        setPosts(newPosts);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      }
      setHasMore(newPosts.length === size);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingDialog(false);
    }
  }

  const fetchData = useCallback(
    async (pageNumber: number) => {
      if (!hasMore && pageNumber !== 0) return;
      getPosts(pageNumber, searchQuery);
    },
    [get, size, activeTab]
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setSearchQuery("");
    setPage(0);
    getPosts(0, "").then(() => setRefreshing(false));
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchData(page + 1);
    }
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setPage(0);
    setSearchQuery("");
    setHasMore(true);
    setPosts([]);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      fetchData(0);
    }
  }, [activeTab]);

  const handlePostDelete = (deletedPostId: string) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post._id !== deletedPostId)
    );
  };

  const handlePostUpdate = (updatedPost: PostModel) => {
    setPosts((prevPosts) => {
      const index = prevPosts.findIndex((post) => post._id === updatedPost._id);
      if (index !== -1) {
        const newPosts = [...prevPosts];
        newPosts[index] = updatedPost;
        return newPosts;
      }
      return prevPosts;
    });
  };

  const handleCommentPress = useCallback((postItem: PostModel) => {
    setSelectedPost(postItem);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCommentAdded = useCallback(() => {
    if (selectedPost) {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === selectedPost._id 
            ? { ...post, totalComments: post.totalComments + 1 } 
            : post
        )
      );
    }
  }, [selectedPost]);

  const handleCommentDeleted = useCallback(() => {
    if (selectedPost) {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === selectedPost._id 
            ? { ...post, totalComments: post.totalComments - 1 } 
            : post
        )
      );
    }
  }, [selectedPost]);

  const renderItem = ({ item }: { item: PostModel }) => (
    <PostItem
      postItem={item}
      onPostUpdate={handlePostUpdate}
      onPostDelete={handlePostDelete}
      onRefresh={handleRefresh}
      navigation={navigation}
      onCommentPress={handleCommentPress}
      setIsTabBarVisible={setIsTabBarVisible}
    />
  );

  const renderHeader = () => (
    <TouchableOpacity
      style={styles.inputCreatePost}
      onPress={() => {
        handleAddNew();
      }}
      onLongPress={() => {}}
    >
      <Image source={userAvatar ? { uri: userAvatar } : defaultUserImg} style={styles.avatar} />
      <Text style={styles.inputPlaceholder}>Bạn đang nghĩ gì?</Text>
      <View style={styles.sendButton}>
        <Send size={24} color="#059BF0" />
      </View>
    </TouchableOpacity>
  );

  const handleAddNew = () => {
    navigation.navigate("PostCreateUpdate", {
      onRefresh: () => {
        handleRefresh();
      }
    });
  }

  //from update post
  useFocusEffect(
    useCallback(() => {
      if (route.params?.updatedPost) {
        const updatedPost = route.params.updatedPost;
        setPosts((currentPosts) => {
          const index = currentPosts.findIndex(
            (post) => post._id === updatedPost._id
          );
          if (index !== -1) {
            // Update existing post
            const newPosts = [...currentPosts];
            newPosts[index] = updatedPost;
            return newPosts;
          } else {
            // Add new post to the beginning of the list
            return [updatedPost, ...currentPosts];
          }
        });
        // Clear the params after handling
        navigation.setParams({ updatedPost: undefined });
      }
    }, [navigation, route.params?.updatedPost])
  );

  const handleReply = () => {
    bottomSheetModalRef.current?.snapToIndex(1);
  };

  return (
    <View style={styles.container}>
      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        onSearch={handleSearch}
        placeholder="Tìm kiếm bài đăng..."
        handleClear={clearSearch}
        additionalIcon="add"
        onAdditionalIconPress={() => handleAddNew()}
      />

      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => handleTabChange(index)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item, index) => `${item._id} - ${index}`}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<EmptyComponent message="Không có bài đăng nào" />}
        ListFooterComponent={() =>
          loading && hasMore ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : null
        }
      />

    <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={["50","92%"]}
        onChange={(index) => {
          if (index === -1) {
            setSelectedPost(null);
            setIsTabBarVisible(true);
          } else {
            setIsTabBarVisible(false);
          }
        }}
      >
        {selectedPost && (
          <PostComment
            navigation={navigation}
            userAvatar={userAvatar}
            postItem={selectedPost}
            onItemAdded={handleCommentAdded}
            onItemDeleted={handleCommentDeleted}
            onItemReply={handleReply}
          />
        )}
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  //search
  searchContainer: {
    flexDirection: "row",
    marginBottom: 16,
    marginHorizontal: 10,
    marginTop: 15,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(237, 247, 255, 0.15)",
    borderRadius: 25,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  searchIcon: {
    marginRight: 8,
    color: "#fff",
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#fff",
    tintColor: "#fff",
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    marginLeft: 12,
    backgroundColor: "#059BF0",
    borderRadius: 25,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  //emptyList
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
  },
  //Tab
  tabContainer: {
    flexDirection: "row",
    marginBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#059BF0",
  },
  tabText: {
    fontSize: 16,
    color: "#333",
  },
  activeTabText: {
    color: "#059BF0",
    fontWeight: "bold",
  },
  //Search
  inputCreatePost: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 7,
    paddingVertical: 5,
    marginVertical: 15,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 20,
  },
  inputPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: "#888",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  sendButton: {
    padding: 10,
  },
});

const Post = (props: any) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <PostContent {...props} />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Post;
