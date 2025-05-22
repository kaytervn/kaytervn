import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import useFetch from "../../hooks/useFetch";
import { LoadingDialog } from "@/src/components/Dialog";
import Toast from "react-native-toast-message";
import { errorToast, successToast } from "@/src/types/toast";
import HeaderLayout from "@/src/components/header/Header";
import { avatarDefault } from "@/src/types/constant";
import { ConversationModel } from "@/src/models/chat/ConversationModel";
import { UserModel } from "@/src/models/user/UserModel";
import { MemberModel } from "@/src/models/chat/MemberModel";
import ModalConfirm from "@/src/components/post/ModalConfirm";
import { router } from "expo-router";

const WatchMember = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const item: ConversationModel = route.params.item;
  const user: UserModel = route.params.user;
  const [members, setMembers] = useState<MemberModel[]>([]);
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModel] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState("");
  const { get, del } = useFetch();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoadingDialog(true);
    try {
      const response = await get(
        `/v1/conversation-member/list?isPaged=0&conversation=${item._id}`
      );
      if (response.result) {
        setMembers(response.data.content);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      Toast.show(errorToast("Không thể tải danh sách thành viên"));
    }
    setLoadingDialog(false);
  };

  const handleDeleteConversation = async (id: string) => {
    setShowDeleteModel(false);
    setLoadingDialog(true);
    try {
      const response = await del(`/v1/conversation-member/remove/${id}`);
      if (response.result) {
        Toast.show(successToast("Xóa thành viên thành công"));
        fetchMembers();
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      Toast.show(errorToast("Không thể xóa thành viên"));
    }
    setLoadingDialog(false);
  };

  // Find if current user is owner
  const currentUserMember = members.find(
    (member) => member.user?._id === user._id
  );
  const isCurrentUserOwner = currentUserMember?.isOwner;

  const handleGoBack = () => {
    route.params.onRefresh();
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}

      <HeaderLayout
        title="Thành Viên Nhóm"
        showBackButton={true}
        onBackPress={() => handleGoBack()}
      />

      <ScrollView contentContainerStyle={styles.memberListContainer}>
        {members.map((item) => {
          const displayName = item.user?.displayName || "Tên không xác định";
          const isOwner = item.isOwner ? "Quản trị viên" : "Thành viên";

          return (
            <View key={item._id} style={styles.memberItem}>
              <Image
                source={
                  item.user?.avatarUrl
                    ? { uri: item.user.avatarUrl }
                    : avatarDefault
                }
                style={styles.memberAvatar}
              />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>
                  {displayName}
                  {item.user?._id === user._id && " (Bạn)"}
                </Text>
                <Text style={styles.memberRole}>{isOwner}</Text>
              </View>
              {isCurrentUserOwner &&
              !item.isOwner &&
              item.user?._id !== user._id &&
              members.length > 3 ? (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => {
                    setShowDeleteModel(true);
                    setCurrentMemberId(item._id);
                  }}
                >
                  <Text style={styles.removeButtonText}>Xóa</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          );
        })}
        <ModalConfirm
          isVisible={showDeleteModal}
          title="Xác cuộc trò chuyện này?"
          onClose={() => setShowDeleteModel(false)}
          onConfirm={() => {
            handleDeleteConversation(currentMemberId);
          }}
        />
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
  memberListContainer: {
    paddingHorizontal: 15,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "500",
  },
  memberRole: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  removeButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 10,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  adminBadge: {
    backgroundColor: "#059BF0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontSize: 16,
  },
});

export default WatchMember;
