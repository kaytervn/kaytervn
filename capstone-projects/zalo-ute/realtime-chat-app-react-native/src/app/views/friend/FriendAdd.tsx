import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useFetch from "../../hooks/useFetch";
import { LoadingDialog } from "@/src/components/Dialog";
import EmptyComponent from "@/src/components/empty/EmptyComponent";
import HeaderLayout from "@/src/components/header/Header";
import SearchBarWhite from "@/src/components/search/SearchBarWhite";
import { FriendModel } from "@/src/models/friend/FriendModel";
import Toast from 'react-native-toast-message';
import { errorToast, successToast } from '@/src/types/toast';
import { avatarDefault } from '@/src/types/constant';
import ModalUserDetail from '@/src/components/friend/ModalUserDetail';
import ModalConfirm from '@/src/components/post/ModalConfirm';
import { UserModel } from '@/src/models/user/UserModel';

const FriendAdd = ({ navigation, route }: any) => {
  const { get, post, loading } = useFetch();
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchResults, setSearchResults] = useState<UserModel[]>([]);
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
      const res = await get('/v1/user/list', {
        page: pageNumber,
        size,
        displayName: query,
        ignoreFriendship: 1,
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

  const handleAddFriend = async (userId: string) => {
    setLoadingDialog(true);
    try {
      const response = await post('/v1/friendship/send', { user: userId });
      if (response.result) {
        Toast.show(successToast("Đã gửi lời mời kết bạn!"));
        // Update the UI to reflect the sent request
        setSearchResults((prevResults) =>
          prevResults.filter((result) => result._id !== userId)
        );
      } else {
        Toast.show(errorToast(response.message));
      }
    } catch (error) {
      console.error("Lỗi gửi lời mời kết bạn:", error);
      Alert.alert("Lỗi gửi lời mời kết bạn. Vui lòng thử lại.");
    } finally {
      setLoadingDialog(false);
    }
  };

  const AddFriendItem = ({ item }: { item: UserModel }) => {
    const [showMenuDetail, setShowMenuDetail] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    return (
      <View style={styles.friendItem}>
        <TouchableOpacity onPress={() => setShowMenuDetail(true)} style={styles.infoContainer}>
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
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
     
        >
          <Text style={styles.addButtonText}>
            Thêm bạn
          </Text>
        </TouchableOpacity>

        <ModalUserDetail
          isVisible={showMenuDetail}
          user={item}
          onClose={() => setShowMenuDetail(false)}
        />

        <ModalConfirm
          isVisible={showAddModal}
          title="Gửi lời mời kết bạn?"
          onClose={() => setShowAddModal(false)}
          onConfirm={() => {
            setShowAddModal(false);
            handleAddFriend(item._id);
          }}
          textConfirm="Gửi"
          colorConfirm="#2ecc71"
        />
        <Toast />
      </View>
    );
  };

  const handleBack = () => {
    route.params.onRefresh();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <HeaderLayout
        title="Thêm bạn mới"
        showBackButton={true}
        onBackPress={() => handleBack()}
      />
      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}

      <SearchBarWhite
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        onSearch={handleSearch}
        placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
        handleClear={clearSearch}
      />

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <AddFriendItem item={item} />}
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
      <Toast/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: 'bold',
  },
  friendPhone: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#0084ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FriendAdd;