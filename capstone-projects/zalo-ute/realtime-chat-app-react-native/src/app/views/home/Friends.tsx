import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useFetch from "../../hooks/useFetch";
import { LoadingDialog } from "@/src/components/Dialog";
import SearchBar from "@/src/components/search/SearchBar";
import EmptyComponent from "@/src/components/empty/EmptyComponent";
import defaultUserImg from "../../../assets/user_icon.png";
import { FriendModel } from "@/src/models/friend/FriendModel";

import FriendItem from "../friend/FriendItem";
import AddFriendModal from "../friend/FriendAdd";
import FriendAdd from "../friend/FriendAdd";
import { UserModel } from "@/src/models/user/UserModel";

const Friends = ({ navigation }: any) => {
  const { get, loading } = useFetch();
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [friends, setFriends] = useState<FriendModel[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);
  const [user, setUser] = useState<UserModel>();
  const size = 10;

  useEffect(() => {
    fetchUserData();
    fetchData(0);
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await get("/v1/user/profile");
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSearch = async () => {
    setLoadingDialog(true);
    Keyboard.dismiss();
    await getFriends(0, searchQuery);
    setLoadingDialog(false);
  };

  const clearSearch = async () => {
    setLoadingDialog(true);
    Keyboard.dismiss();
    setSearchQuery("");
    await getFriends(0, "");
  };

  async function getFriends(pageNumber: number, displayName: string) {
    try {
      const res = await get(`/v1/friendship/list`, {
        page: pageNumber,
        size,
        displayName: displayName,
      });

      const newFriends = res.data.content;
      if (pageNumber === 0) {
        setFriends(newFriends);
      } else {
        setFriends((prevFriends) => [...prevFriends, ...newFriends]);
      }
      setHasMore(newFriends.length === size);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoadingDialog(false);
      return;
    }
  }

  const fetchData = useCallback(
    async (pageNumber: number) => {
      if (!hasMore && pageNumber !== 0) return;
      getFriends(pageNumber, searchQuery);
    },
    [get, size]
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setSearchQuery("");
    setPage(0);
    fetchUserData();
    getFriends(0, "").then(() => setRefreshing(false));
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchData(page + 1);
    }
  };

  const renderFriendItem = ({ item }: { item: FriendModel }) => (
    <FriendItem
      item={item}
      navigation={navigation}
      onItemDelete={handleItemDelete}
      onItemFollow={handleItemFollow}
    />
  );

  const handleItemFollow = (itemId: string) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend._id === itemId ? { ...friend, isFollowed: 1 } : friend
      )
    );
  };

  const handleItemDelete = (itemId: string) => {
    setFriends((prevFriends) =>
      prevFriends.filter((friend) => friend._id !== itemId)
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => handleFriendRequest()}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="person-add-outline" size={24} color="#0084ff" />
          <Text style={styles.headerButtonText}>Lời mời kết bạn</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {user?.totalFriendRequestsReceived}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => handleFriendSendRequest()}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="people-outline" size={24} color="#0084ff" />
          <Text style={styles.headerButtonText}>Yêu cầu kết bạn</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {user?.totalFriendRequestsSent}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.totalFriendsContainer}>
        <Text style={styles.totalFriendsText}>Bạn bè ({friends.length})</Text>
      </View>
    </View>
  );

  const handleAddFriend = () => {
    navigation.navigate("FriendAdd", {
      onRefresh: () => {
        handleRefresh();
      },
    });
  };

  const handleFriendRequest = () => {
    navigation.navigate("FriendRequest", {
      onRefresh: () => {
        handleRefresh();
      },
    });
  };

  const handleFriendSendRequest = () => {
    navigation.navigate("FriendSendRequest", {
      onRefresh: () => {
        handleRefresh();
      },
    });
  };

  return (
    <View style={styles.container}>
      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        onSearch={handleSearch}
        placeholder="Tìm kiếm bạn bè..."
        handleClear={clearSearch}
        additionalIcon="add"
        onAdditionalIconPress={() => handleAddFriend()}
      />

      <FlatList
        data={friends}
        keyExtractor={(item) => item._id}
        renderItem={renderFriendItem}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<EmptyComponent message="Không tìm thấy bạn bè" />}
        ListFooterComponent={() =>
          loading && hasMore ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  friendLastLogin: {
    fontSize: 12,
    color: "#666",
  },
  headerContainer: {
    backgroundColor: "#fff",
    paddingTop: 5,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f3f2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  headerButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#1c1e21",
    flex: 1,
  },

  //Badges
  totalFriendsContainer: {
    backgroundColor: "#fff",
    paddingStart: 0,
    paddingVertical: 10,
  },
  totalFriendsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1c1e21",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Add this
    width: "100%",
  },

  badge: {
    backgroundColor: "#f56e58",
    borderRadius: 12.5,
    minWidth: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Friends;
