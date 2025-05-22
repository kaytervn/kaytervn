import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import useFetch from "../../hooks/useFetch";
import { LoadingDialog } from "@/src/components/Dialog";
import { NotificationModel } from "@/src/models/notification/NotificationModel";
import NotificationItem from "@/src/components/notification/NotificationItem";
import HeaderLayout from "@/src/components/header/Header";
import { Bell, Menu } from "lucide-react-native";
import MenuClick from "@/src/components/post/MenuClick";
import ModalConfirm from "@/src/components/post/ModalConfirm";
import Toast from "react-native-toast-message";
import { successToast } from "@/src/types/toast";
import EmptyComponent from "@/src/components/empty/EmptyComponent";
import { useRefresh } from "./RefreshContext";

const Notification = ({ navigation }: any) => {
  const { get, del, put, loading } = useFetch();
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [page, setPage] = useState(0);
  const { refreshTrigger } = useRefresh();

  const size = 10;

  const fetchNotifications = useCallback(
    async (pageNumber: number) => {
      if (!hasMore) return;
      try {
        const params = {
          page: pageNumber,
          size,
        };

        const res = await get(`/v1/notification/list`, params);

        const newNotifications = res.data.content;
        if (pageNumber === 0) {
          setNotifications(newNotifications);
        } else {
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            ...newNotifications,
          ]);
        }
        setHasMore(newNotifications.length === size);
        setPage(pageNumber);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoadingDialog(false);
      }
    },
    [get, hasMore, size]
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(0);
    fetchNotifications(0).then(() => setRefreshing(false));
  }, [fetchNotifications]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchNotifications(page + 1);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchNotifications(0);
  }, [refreshTrigger]);

  const renderEmptyComponent = () => (
    <EmptyComponent message="Không có thông báo nào" />
  );

  const handleItemClick = (item: NotificationModel) => {
    if (item.data.post) {
      navigation.navigate("PostDetail", {
        postId: item.data.post._id
      });
    }
  };

  const handleReadAll = async () => {
    setShowMenu(false);
    setLoadingDialog(true);
    try {
      const response = await put(`/v1/notification/read-all`);
      if (response.result) {
        Toast.show(successToast("Toàn bộ thông báo đánh dấu đã đọc!"));
        setNotifications([]);
        fetchNotifications(0);
      } else {
        throw new Error("Failed to read all notification");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("Error", "Lỗi đọc toàn bộ thông báo!.");
    } finally {
      setLoadingDialog(false);
    }
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
      const response = await del(`/v1/notification/delete-all`);
      if (response.result) {
        Toast.show(successToast("Xóa toàn bộ thông báo thành công!"));
        fetchNotifications(0);
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("Error", "Lỗi xóa toàn bộ thông báo!.");
    } finally {
      setLoadingDialog(false);
    }
  };

  const renderItem = ({ item }: { item: NotificationModel }) => (
    <View style={{ marginVertical: 0 }}>
      <NotificationItem item={item} onItemClick={handleItemClick} />
    </View>
  );

  return (
    <View className="flex-1">
      <HeaderLayout
        title="Thông báo"
        showBackButton={false}
        onBackPress={() => {}}
        RightIcon={Menu}
        onRightIconPress={() => setShowMenu(true)}
      />
      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        style={styles.listContainer}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={() =>
          loading && hasMore ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : null
        }
      />
      <MenuClick
        titleUpdate={"Đánh dấu tất cả đã đọc"}
        titleDelete={"Xóa toàn bộ thông báo"}
        isVisible={showMenu}
        onClose={() => setShowMenu(false)}
        onUpdate={handleReadAll}
        onDelete={handleDeletePress}
      />

      <ModalConfirm
        isVisible={showDeleteModal}
        title="Bạn sẽ xóa toàn bộ thông báo?"
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  notificationItem: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  unreadItem: {
    backgroundColor: "#e6f3ff",
  },
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
});

export default Notification;
