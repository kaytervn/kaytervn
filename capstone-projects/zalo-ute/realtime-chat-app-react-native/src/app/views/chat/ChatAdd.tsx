import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import useFetch from "../../hooks/useFetch";
import { LoadingDialog } from "@/src/components/Dialog";
import EmptyComponent from "@/src/components/empty/EmptyComponent";
import HeaderLayout from "@/src/components/header/Header";
import SearchBarWhite from "@/src/components/search/SearchBarWhite";
import Toast from "react-native-toast-message";
import { successToast } from "@/src/types/toast";
import { avatarDefault } from "@/src/types/constant";
import ModalUserDetail from "@/src/components/friend/ModalUserDetail";
import { UserModel } from "@/src/models/user/UserModel";

const ChatAdd = ({ navigation, route }: any) => {
  const { groupId } = route.params;
  const { get, post, loading } = useFetch();
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchResults, setSearchResults] = useState<UserModel[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);

  const size = 10;

  useEffect(() => {
    fetchData(0);
  }, []);

  const handleSearch = async () => {
    setLoadingDialog(true);
    Keyboard.dismiss();
    await searchFriends(0, searchQuery);
    setLoadingDialog(false);
  };

  const clearSearch = async () => {
    setLoadingDialog(true);
    Keyboard.dismiss();
    setSearchQuery("");
    await searchFriends(0, "");
  };

  async function searchFriends(pageNumber: number, query: string) {
    try {
      const res = await get("/v1/user/friends", {
        page: pageNumber,
        size,
        displayName: query,
        excludeGroupMembers: groupId, // Add this parameter to exclude existing group members
      });
      const newResults = res.data.content;
      if (pageNumber === 0) {
        setSearchResults(newResults);
      } else {
        setSearchResults((prevResults) => [...prevResults, ...newResults]);
      }
      setHasMore(newResults.length === size);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error searching for friends:", error);
    } finally {
      setLoadingDialog(false);
    }
  }

  const fetchData = useCallback(
    async (pageNumber: number) => {
      if (!hasMore && pageNumber !== 0) return;
      searchFriends(pageNumber, searchQuery);
    },
    [get, size]
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setSearchQuery("");
    setPage(0);
    searchFriends(0, "").then(() => setRefreshing(false));
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchData(page + 1);
    }
  };

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleAddMembers = async () => {
    if (selectedUsers.size === 0) {
      Toast.show({
        type: "info",
        text1: "Vui lòng chọn ít nhất một thành viên",
      });
      return;
    }

    setLoadingDialog(true);
    try {
      const response = await post("/v1/chat/group/members/add", {
        groupId,
        members: Array.from(selectedUsers),
      });

      if (response.result) {
        Toast.show(successToast("Đã thêm thành viên vào nhóm!"));
        navigation.goBack();
      }
    } catch (error) {
      console.error("Lỗi thêm thành viên:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi thêm thành viên. Vui lòng thử lại.",
      });
    } finally {
      setLoadingDialog(false);
    }
  };

  const MemberItem = ({ item }: { item: UserModel }) => {
    const [showMenuDetail, setShowMenuDetail] = useState(false);
    const isSelected = selectedUsers.has(item._id);

    return (
      <View style={styles.friendItem}>
        <TouchableOpacity
          onPress={() => setShowMenuDetail(true)}
          style={styles.infoContainer}
        >
          <Image
            source={item.avatarUrl ? { uri: item.avatarUrl } : avatarDefault}
            style={styles.avatar}
          />
          <View style={styles.friendInfo}>
            <Text style={styles.friendName}>{item.displayName}</Text>
            <Text style={styles.friendPhone}>{item.phone}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.selectButton, isSelected && styles.selectedButton]}
          onPress={() => toggleUserSelection(item._id)}
        >
          <Text
            style={[
              styles.selectButtonText,
              isSelected && styles.selectedButtonText,
            ]}
          >
            {isSelected ? "Đã chọn" : "Chọn"}
          </Text>
        </TouchableOpacity>

        <ModalUserDetail
          isVisible={showMenuDetail}
          user={item}
          onClose={() => setShowMenuDetail(false)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderLayout
        title="Thêm thành viên"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity
            onPress={handleAddMembers}
            style={styles.addMembersButton}
            disabled={selectedUsers.size === 0}
          >
            <Text
              style={[
                styles.addMembersText,
                selectedUsers.size === 0 && styles.addMembersTextDisabled,
              ]}
            >
              Thêm ({selectedUsers.size})
            </Text>
          </TouchableOpacity>
        }
      />

      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}

      <SearchBarWhite
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        onSearch={handleSearch}
        placeholder="Tìm kiếm bạn bè..."
        handleClear={clearSearch}
      />

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <MemberItem item={item} />}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<EmptyComponent message="Không tìm thấy kết quả" />}
        ListFooterComponent={() =>
          loading && hasMore ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : null
        }
      />
      <Toast />
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
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  friendPhone: {
    fontSize: 14,
    color: "#666",
  },
  selectButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#0084ff",
  },
  selectedButton: {
    backgroundColor: "#0084ff",
  },
  selectButtonText: {
    color: "#0084ff",
    fontWeight: "bold",
  },
  selectedButtonText: {
    color: "#fff",
  },
  addMembersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addMembersText: {
    color: "#0084ff",
    fontWeight: "bold",
    fontSize: 16,
  },
  addMembersTextDisabled: {
    color: "#999",
  },
});

export default ChatAdd;
