import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ToastAndroid,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import useFetch from "../../hooks/useFetch";
import { uploadImage } from "@/src/types/utils";
import { LoadingDialog } from "@/src/components/Dialog";
import Toast from "react-native-toast-message";
import { errorToast, successToast } from "@/src/types/toast";
import HeaderLayout from "@/src/components/header/Header";
import { avatarDefault } from "@/src/types/constant";
import { UserModel } from "@/src/models/user/UserModel";
import { FriendModel } from "@/src/models/friend/FriendModel";

const { height, width } = Dimensions.get("window");

const CreateGroup = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { get, post, loading } = useFetch();
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [friends, setFriends] = useState<FriendModel[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    setLoadingDialog(true);
    try {
      const response = await get("/v1/friendship/list");
      if (response.result) {
        setFriends(response.data.content);
        console.log("friendship:", response.data.content);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      errorToast("Failed to fetch friends");
    }
    setLoadingDialog(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setGroupImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setGroupImage(null);
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleCreateGroup = async () => {
    // Validate input
    if (groupName.trim() === "") {
      ToastAndroid.show("Tên nhóm không được để trống", ToastAndroid.SHORT);
      return;
    }

    if (selectedFriends.length === 0) {
      ToastAndroid.show("Vui lòng chọn thành viên nhóm", ToastAndroid.SHORT);
      return;
    }

    try {
      // Prepare group data
      const groupData: {
        name: string;
        avatarUrl?: string;
        conversationMembers: string[];
      } = {
        name: groupName,
        conversationMembers: selectedFriends,
      };

      // Upload group image if exists
      if (groupImage && !groupImage.startsWith("http")) {
        const uploadResult = await uploadImage(groupImage, post);
        groupData.avatarUrl = uploadResult;
      }

      if (groupData.conversationMembers.length <= 1) {
        ToastAndroid.show(
          "Vui lòng thêm ít nhất 2 thành viên",
          ToastAndroid.SHORT
        );
        return;
      }

      // Create group
      setLoadingDialog(true);
      const response = await post("/v1/conversation/create", groupData);
      if (!response.result) {
        throw new Error("Failed to create group");
      }
      Toast.show(successToast("Nhóm đã được tạo"));
      route.params.onRefresh();
      navigation.goBack();
    } catch (error) {
      console.error("Error creating group:", error);
      Toast.show(errorToast("Không thể tạo nhóm"));
    }
    setLoadingDialog(false);
  };

  const RightButton = () => (
    <TouchableOpacity onPress={handleCreateGroup}>
      <Text style={styles.postButtonText}>Tạo</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}

      <HeaderLayout
        title="Tạo Nhóm Mới"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        RightIcon={RightButton}
      />

      {/* Group Name Input */}
      <View style={styles.groupNameContainer}>
        <TextInput
          style={styles.groupNameInput}
          placeholder="Nhập tên nhóm"
          value={groupName}
          onChangeText={setGroupName}
        />
      </View>

      {/* Group Image Selection */}
      <View style={styles.imageSelectionContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
          {groupImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: groupImage }} style={styles.groupImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={removeImage}
              >
                <Ionicons name="close-circle" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={32} color="#059BF0" />
              <Text style={styles.imagePickerText}>Thêm ảnh nhóm</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Friend Selection */}
      <Text style={styles.friendSelectionTitle}>Chọn thành viên</Text>
      <ScrollView contentContainerStyle={styles.friendListContainer}>
        {friends &&
          friends.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={[
                styles.friendItem,
                selectedFriends.includes(item._id) && styles.selectedFriendItem,
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
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  groupNameContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  groupNameInput: {
    fontSize: 16,
    paddingVertical: 10,
  },
  imageSelectionContainer: {
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  imagePickerButton: {
    width: 150,
    height: 150,
    borderRadius: 10,
    backgroundColor: "#F0F2F5",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 10,
    position: "relative",
  },
  groupImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerText: {
    color: "#059BF0",
    marginTop: 10,
  },
  friendSelectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 15,
  },
  friendListContainer: {
    paddingHorizontal: 15,
  },
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
  },
  friendName: {
    flex: 1,
    fontSize: 16,
  },
  selectedIcon: {
    marginLeft: 10,
  },
});

export default CreateGroup;
