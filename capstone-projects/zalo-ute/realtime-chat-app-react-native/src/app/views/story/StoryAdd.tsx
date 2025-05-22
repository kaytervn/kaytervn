import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { Camera, Trash } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '@/src/types/utils';
import { LoadingDialog } from '@/src/components/Dialog';
import Toast from 'react-native-toast-message';
import { errorToast, successToast } from '@/src/types/toast';
import HeaderLayout from '@/src/components/header/Header';
import useFetch from '../../hooks/useFetch';

const StoryAdd = ({ navigation, route }: any) => {
  const { post, loading } = useFetch();
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = async () => {
    setLoadingDialog(true);

    if (!image) {
      setLoadingDialog(false);
      Toast.show(errorToast('Vui lòng chọn ảnh trước khi đăng'));
      return;
    }
   
    try {
      const uploadResult = await uploadImage(image, post);
      const response = await post('/v1/story/create', { imageUrl: uploadResult });
      if (response.result) {
        setLoadingDialog(true);
        route.params?.onRefresh();
        Toast.show(successToast('Tạo tin thành công!'));
        setLoadingDialog(false);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error submitting story:', error);
      errorToast('Failed to create story');
    }
    setLoadingDialog(false);
  };

  const RightButton = () => (
    <TouchableOpacity onPress={handleSubmit}>
      <Text style={styles.buttonRight}>{"Đăng"}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}
      <HeaderLayout
        title={"Tạo tin"}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        onRightPress={handleSubmit}
        RightIcon={RightButton}
      />
      <Toast/>
      <View style={styles.content}>
        <TouchableOpacity onPress={handlePickImage} style={styles.imageContainer}>
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.postImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={handleRemoveImage}
              >
                <Trash color="white" size={20} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Camera color="#059BF0" size={40} />
              <Text style={styles.imagePlaceholderText}>Add Image</Text>
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
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 9 / 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 8,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#059BF0',
    fontSize: 16,
  },
  buttonRight: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    borderColor: "#ffffff",
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 6,
    borderRadius: 20,
  },
});

export default StoryAdd;