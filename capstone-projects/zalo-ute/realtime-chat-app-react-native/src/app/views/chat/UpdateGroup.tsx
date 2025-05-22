import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
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
import { ConversationModel } from "@/src/models/chat/ConversationModel";

const { height, width } = Dimensions.get("window");

const UpdateGroup = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const item: ConversationModel = route.params.item;
  const { post, put, loading } = useFetch();
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [conversationName, setConversationName] = useState(item.name);
  const [conversationImage, setConversationImage] = useState<string | null>(
    item.avatarUrl
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setConversationImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setConversationImage(null);
  };

  const handleUpdateGroup = async () => {
    if (conversationName.trim() === "") {
      ToastAndroid.show("Tên nhóm không được để trống", ToastAndroid.SHORT);
      return;
    }

    setLoadingDialog(true);

    try {
      const updateData: {
        id: string;
        name: string;
        avatarUrl?: string;
      } = {
        id: item._id,
        name: conversationName,
      };

      if (conversationImage && !conversationImage.startsWith("http")) {
        const uploadResult = await uploadImage(conversationImage, post);
        updateData.avatarUrl = uploadResult;
      }
      const response = await put("/v1/conversation/update", updateData);
      if (response.result) {
        Toast.show(successToast("Cập nhật thành công"));
        route.params.onRefresh?.();
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating group:", error);
      Toast.show(errorToast("Không thể cập nhật nhóm"));
    }
    setLoadingDialog(false);
  };

  const RightButton = () => (
    <TouchableOpacity onPress={handleUpdateGroup}>
      <Text style={styles.updateButtonText}>Cập nhật</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}

      <HeaderLayout
        title="Cập Nhật Nhóm"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        RightIcon={RightButton}
      />

      {/* Group Name Input */}
      <View style={styles.groupNameContainer}>
        <TextInput
          style={styles.groupNameInput}
          placeholder="Nhập tên nhóm"
          value={conversationName}
          onChangeText={setConversationName}
        />
      </View>

      {/* Group Image Selection */}
      <View style={styles.imageSelectionContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
          {conversationImage ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: conversationImage }}
                style={styles.groupImage}
              />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  updateButtonText: {
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
});

export default UpdateGroup;
