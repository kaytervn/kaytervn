import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useFetch from "../../hooks/useFetch";
import { LoadingDialog } from "@/src/components/Dialog";
import Toast from "react-native-toast-message";
import { errorToast, successToast } from "@/src/types/toast";
import HeaderLayout from "@/src/components/header/Header";
import { avatarDefault } from "@/src/types/constant";
import { FriendModel } from "@/src/models/friend/FriendModel";
import { ConversationModel } from "@/src/models/chat/ConversationModel";
import { UserModel } from "@/src/models/user/UserModel";
import { MemberModel } from "@/src/models/chat/MemberModel";

const AddMember = ({ navigation, route }: { navigation: any; route: any }) => {
  const item: ConversationModel = route.params.item;
  const user: UserModel = route.params.user;
  const [existingMembers, setExistingMembers] = useState<MemberModel[]>([]);
  const { get, post } = useFetch();
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [friends, setFriends] = useState<FriendModel[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    setLoadingDialog(true);
    try {
      const resMember = await get(
        `/v1/conversation-member/list?conversation=${item._id}`
      );
      setExistingMembers(resMember.data.content);
      const response = await get("/v1/friendship/list");
      if (response.result) {
        // Filter out friends who are already members
        const availableFriends = response.data.content.filter(
          (friend: FriendModel) =>
            !resMember.data.content.some(
              (member: MemberModel) => member.user._id === friend.friend._id
            )
        );
        console.log("availableFriends", availableFriends);
        setFriends(availableFriends);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      Toast.show(errorToast("Không thể tải danh sách bạn bè"));
    }
    setLoadingDialog(false);
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleAddMembers = async () => {
    if (selectedFriends.length === 0) {
      ToastAndroid.show("Vui lòng chọn thành viên để thêm", ToastAndroid.SHORT);
      return;
    }

    setLoadingDialog(true);
    try {
      const response = await post("/v1/conversation-member/add", {
        conversation: item._id,
        users: selectedFriends,
      });
      console.log("response:", response);
      if (response.result) {
        Toast.show(successToast("Đã thêm thành viên mới"));
        route.params.onRefresh?.();
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error adding members:", error);
      Toast.show(errorToast("Không thể thêm thành viên"));
    }
    setLoadingDialog(false);
  };

  const RightButton = () => (
    <TouchableOpacity onPress={handleAddMembers}>
      <Text style={styles.addButtonText}>Thêm</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}

      <HeaderLayout
        title="Thêm Thành Viên"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        RightIcon={RightButton}
      />

      <ScrollView contentContainerStyle={styles.friendListContainer}>
        {friends.length === 0 ? (
          <Text style={styles.emptyText}>Không có bạn bè để thêm vào nhóm</Text>
        ) : (
          friends.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={[
                styles.friendItem,
                selectedFriends.includes(item.friend._id) &&
                  styles.selectedFriendItem,
              ]}
              onPress={() => toggleFriendSelection(item.friend._id)}
            >
              <Image
                source={
                  item.friend.avatarUrl
                    ? { uri: item.friend.avatarUrl }
                    : avatarDefault
                }
                style={styles.friendAvatar}
              />
              <Text style={styles.friendName}>{item.friend.displayName}</Text>
              {selectedFriends.includes(item.friend._id) && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#059BF0"
                  style={styles.selectedIcon}
                />
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  friendListContainer: {},
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  selectedFriendItem: {
    backgroundColor: "#F0F2F5",
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    marginStart: 15,
  },
  friendName: {
    flex: 1,
    fontSize: 16,
  },
  selectedIcon: {
    marginLeft: 10,
    marginEnd: 15,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontSize: 16,
  },
});

export default AddMember;
