import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import useFetch from "../../hooks/useFetch";
import { LoadingDialog } from "@/src/components/Dialog";

import EmptyComponent from "@/src/components/empty/EmptyComponent";
import FriendItem from "../friend/FriendItem";
import HeaderLayout from "@/src/components/header/Header";
import SearchBarWhite from "@/src/components/search/SearchBarWhite";
import { FriendRequestModel } from "@/src/models/friend/FriendRequestModel";
import FriendRequestItem from "./FriendRequestItem";
import Toast from "react-native-toast-message";
import { successToast } from "@/src/types/toast";


const FriendRequest = ({ navigation, route }: any) => {
  const { get, loading } = useFetch();
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [friends, setFriends] = useState<FriendRequestModel[]>([]);
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
        getListKind: 1 // For FriendRequest
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
      console.error("Error fetching friend requests:", error);
    } finally {
      setLoadingDialog(false);
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
    getFriends(0, "").then(() => setRefreshing(false));
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchData(page + 1);
    }
  };

  const handleItemAccept = (id: string) => {
    Toast.show(successToast("Đã chấp nhận lời mời kết bạn!"));
    setFriends((prevFriends) => prevFriends.filter((item) => item._id !== id));
  }
  const handleItemRemove = (id: string) => {
    Toast.show(successToast("Đã từ chối lời mời kết bạn!"));
    setFriends((prevFriends) => prevFriends.filter((item) => item._id !== id));
  }

  const renderFriendItem = ({ item }: { item: FriendRequestModel }) => (
    <FriendRequestItem
      item={item}
      navigation={navigation}
      onItemAccept={handleItemAccept}
      onItemReject={handleItemRemove}
    />
  );
  const handleGoBack = () => {
    route.params.onRefresh();
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      
      <Toast/>
      <HeaderLayout
        title="Lời mời kết bạn"
        showBackButton={true}
        onBackPress={() => handleGoBack()}
      />
      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}

      <SearchBarWhite
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        onSearch={handleSearch}
        placeholder="Tìm kiếm..."
        handleClear={clearSearch}
      />

      <FlatList
        data={friends}
        keyExtractor={(item) => item._id}
        renderItem={renderFriendItem}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<EmptyComponent message="Không có lời mời kết bạn" />}
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
});

export default FriendRequest;