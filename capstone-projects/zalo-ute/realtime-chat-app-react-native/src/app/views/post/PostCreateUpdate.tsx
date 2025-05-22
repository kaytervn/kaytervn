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
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import useFetch from "../../hooks/useFetch";
import { getStatusIcon, uploadImage } from "@/src/types/utils";
import { LoadingDialog } from "@/src/components/Dialog";
import Toast from "react-native-toast-message";
import { errorToast, successToast } from "@/src/types/toast";
import ModalStatus from "@/src/components/post/ModalStatus";
import PostItem from "@/src/app/views/post/PostItem";
import { PostModel } from "@/src/models/post/PostModel";
import { avatarDefault } from "@/src/types/constant";
import { LogBox } from 'react-native';
import HeaderLayout from "@/src/components/header/Header";
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const { height } = Dimensions.get("window");

const PostCreateUpdate = ({
  navigation, 
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { get, post, put, loading } = useFetch();
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(height));
  const [postItem, setPostItem] = useState<PostModel | null>(null);

  useEffect(() => {
    fetchUserData();
    if (route.params) {
      const { post_id } = route.params;
      if (post_id) {
        setIsUpdating(true);
        setPostId(post_id);
        fetchPostDetails(post_id);
      }
    }
  }, [route.params]);

  const fetchUserData = async () => {
    try {
      const res = await get("/v1/user/profile");
      console.log(res);
      setUserAvatar(res.data.avatarUrl);
      setUserName(res.data.displayName);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchPostDetails = async (id: string) => {
    setLoadingDialog(true);
    try {
      const response = await get(`/v1/post/get/${id}`);
      if (response.result) {
        const postData = response.data;
        setPostItem(postData);
        setContent(postData.content);
        setImages(postData.imageUrls || []);
        setStatus(postData.kind);
      }
    } catch (error) {
      console.error("Error fetching post details:", error);
      errorToast("Failed to fetch post details");
    }
    setLoadingDialog(false);
  };

  // Function to pick image from library
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoadingDialog(true);
    let postBody: {
      id: any;
      content: string;
      imageUrls: string[];
      kind: number;
    } = {
      id: postId || null,
      content: content,
      imageUrls: [],
      kind: status,
    };

    if (content.trim() === "" || content.trim().length <= 0) {
      setLoadingDialog(false);
      ToastAndroid.show("Nội dung không được để trống", ToastAndroid.SHORT);
      return;
    }

    if (images.length > 0) {
      for (const image of images) {
        if (!image.startsWith("http")) {
          // Only upload new images
          const uploadResult = await uploadImage(image, post);
          postBody.imageUrls.push(uploadResult);
        } else {
          postBody.imageUrls.push(image); // Keep existing image URLs
        }
      }
    }

    try {
      let res;
      if (isUpdating) {
        res = await put(`/v1/post/update/`, postBody);
      } else {
        res = await post("/v1/post/create", postBody);
      }


      if (res.result) {
        if (postItem && isUpdating) {
          // Chỉ cập nhật postItem nếu nó tồn tại (trong trường hợp cập nhật)
          postItem.content = postBody.content;
          if (postBody.imageUrls.length > 0) {
            postItem.imageUrls = postBody.imageUrls;
          }
          postItem.kind = postBody.kind;
          setLoadingDialog(false)
          route.params?.onPostUpdate(postItem);
          Toast.show(successToast("Cập nhật bài đăng thành công!"))
          
        } else {
          setLoadingDialog(true)
          route.params?.onRefresh();
          Toast.show(successToast("Tạo bài đăng thành công!"));
          setLoadingDialog(false)
        }
        navigation.goBack();
      
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      errorToast(
        isUpdating ? "Failed to update post" : "Failed to create post"
      );
    }
    setLoadingDialog(false);
  };

  const openStatusModal = () => {
    setIsStatusModalVisible(true);
  };

  const closeStatusModal = () => {
    setIsStatusModalVisible(false);
  };

  const selectStatus = (value: number) => {
    setStatus(value);
    closeStatusModal();
  };

  const getStatusText = (value: number) => {
    switch (value) {
      case 1:
        return "Công khai";
      case 2:
        return "Bạn bè";
      case 3:
        return "Chỉ mình tôi";
      default:
        return "Chọn trạng thái";
    }
  };
  const RightButton = () => (
    <TouchableOpacity onPress={handleSubmit}>
      <Text style={styles.postButtonText}>
        {isUpdating ? "Cập nhật" : "Đăng"}
      </Text>
    </TouchableOpacity> 
  );
  return (
    <View style={styles.container}>
      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}
      <HeaderLayout
        title={isUpdating ? "Cập nhật bài đăng" : "Tạo bài đăng"}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        RightIcon={RightButton}
      />

      <View style={styles.userContainer}>
        <Image
          source={userAvatar ? { uri: userAvatar } : avatarDefault}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.userName}>{userName || "User Name"}</Text>
          <View style={styles.statusButtonContainer}>
            <TouchableOpacity
              style={styles.statusButton}
              onPress={openStatusModal}
            >
              <Ionicons
                name={getStatusIcon(status)}
                size={18}
                color="#059BF0"
                style={styles.statusIcon}
              />
              <Text style={styles.statusButtonText}>
                {getStatusText(status)}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color="#059BF0"
                style={styles.statusIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView>
        <TextInput
          style={styles.input}
          placeholder="Bạn đang nghĩ gì?"
          value={content}
          onChangeText={setContent}
          multiline
        />

        {/* Display selected images */}
        <ScrollView
          horizontal
          contentContainerStyle={{ paddingRight: 15 }}
          style={styles.imageScrollView}
        >
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <Ionicons name="close-circle" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Button to add an image */}
        <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color="#059BF0" />
          <Text style={styles.addImageText}>Thêm ảnh</Text>
        </TouchableOpacity>
      </ScrollView>

      <ModalStatus
        isVisible={isStatusModalVisible}
        onClose={closeStatusModal}
        onSelectStatus={selectStatus}
        slideAnim={slideAnim}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postButton: {
    backgroundColor: "#059BF0",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    borderColor: "#ffffff",
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    fontSize: 16,
    minHeight: 100,
  },
  imageScrollView: {
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  imageContainer: {
    marginRight: 10,
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImageButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
  },
  addImageButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  addImageText: {
    marginLeft: 10,
    color: "#059BF0",
    fontSize: 16,
  },

  //User information
  userContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 15,
    fontWeight: "bold",
    paddingHorizontal: 5,
  },

  //status
  statusButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F2F5",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  statusButtonText: {
    fontSize: 14,
    color: "#059BF0",
    marginHorizontal: 5,
  },
  statusIcon: {
    marginHorizontal: 2,
  },
  selectedStatusButton: {
    backgroundColor: "#059BF0",
  },

  selectedStatusButtonText: {
    color: "#fff",
  },
});

export default PostCreateUpdate;
