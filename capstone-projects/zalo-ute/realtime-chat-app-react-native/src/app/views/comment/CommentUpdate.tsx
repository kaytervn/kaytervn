import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
} from "react-native";
import { X, ImageIcon, Save } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "@/src/types/utils";
import useFetch from "../../hooks/useFetch";
import { CommentModel } from "@/src/models/comment/CommentModel";
import Toast, { ErrorToast } from "react-native-toast-message";
import HeaderLayout from "@/src/components/header/Header";
import { LoadingDialog } from "@/src/components/Dialog";
import { LogBox } from 'react-native';
import { errorToast } from "@/src/types/toast";
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
const CommentUpdate = ({ navigation, route }: any) => {
  const { post, put } = useFetch();
  const [loadingDialog, setLoadingDialog] = useState(false);
  let item : CommentModel = route?.params.item;
  const onItemUpdate = route?.params.onItemUpdate;
  const [content, setContent] = useState(item.content);
  const [updateImage, setUpdatedImage] = useState(item.imageUrl);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setUpdatedImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    setLoadingDialog(true);
    try {
      if (!content) {
        Toast.show(errorToast("Nội dung không được để trống"));
        setLoadingDialog(false);
        return;
      } else {
        item.content = content;
      }
      if (updateImage && updateImage !== item.imageUrl) {
        item.imageUrl = await uploadImage(updateImage, post);
      }
      const params = {
        id : item._id,
        content: content,
        imageUrl: updateImage,
      };
      await put(`/v1/comment/update/`, params);
      setLoadingDialog(false);
      onItemUpdate(item)
      navigation.goBack();
    } catch {
      setLoadingDialog(false);
      Toast.show(errorToast("Lỗi cập nhật bình luận"));
    }
    
  };

  const handleGoBack = () => {
    Keyboard.dismiss();
    navigation.goBack();
  };

  return (
    <View>
      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}
      <HeaderLayout 
        title="Chỉnh sửa bình luận"
        showBackButton={true}
        onBackPress={handleGoBack}
        onRightIconPress={()=>{}}
      />
      <View style={styles.container}>
      
      <TextInput
        style={styles.input}
        value={content || ""}
        onChangeText={setContent}
        multiline
        placeholder="Edit your comment..."
      />
      {updateImage && (
        <Image source={{ uri: updateImage }} style={styles.commentImage} />
      )}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
          <ImageIcon size={20} color="#059BF0" />
          <Text style={styles.buttonText}>Đổi hình</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleUpdate}>
          <Save size={20} color="#059BF0" />
          <Text style={styles.buttonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>
    </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  commentImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 10,
    resizeMode: "contain"
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  buttonText: {
    marginLeft: 5,
    color: "#059BF0",
    fontWeight: "bold",
  },
});

export default CommentUpdate;
