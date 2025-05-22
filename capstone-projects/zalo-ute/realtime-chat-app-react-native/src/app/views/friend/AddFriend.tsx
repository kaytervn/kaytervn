import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import useFetch from '../../hooks/useFetch';
import userIcon from '../../../assets/user_icon.png';

interface User {
  _id: string;
  displayName: string;
  email: string;
  phone: string;
  avatarUrl?: string | null;
  bio?: string | null;
  status: number;
}

interface ApiResponse {
  result: boolean;
  data: {
    content: User[];
    totalPages: number;
    totalElements: number;
  };
}

interface AddFriendProps {
  visible: boolean;
  onClose: () => void;
}

const AddFriend: React.FC<AddFriendProps> = ({ visible, onClose }) => {
  const { get, post } = useFetch();
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhoneNumber = (phone: string) => {
    return /^\d{9,11}$/.test(phone);
  };

  const searchUser = async () => {
    if (!searchQuery.trim()) {
      setError('Vui lòng nhập email hoặc số điện thoại');
      return;
    }
  
    if (!isValidEmail(searchQuery) && !isValidPhoneNumber(searchQuery)) {
      setError('Vui lòng nhập email hoặc số điện thoại hợp lệ');
      return;
    }
  
    setError(null);
    setLoading(true);
    setHasSearched(true);
    
    try {
      // Gửi query tìm kiếm trực tiếp lên server
      const response = await get(`/v1/user/search?query=${searchQuery}`);
  
      if (response.result && response.data.content) {
        setMatchedUser(response.data.content[0] || null);
      } else {
        setMatchedUser(null);
      }
    } catch (error) {
      console.error('Error searching user:', error);
      setError('Đã có lỗi xảy ra khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };
  

  const handleAddFriend = async (userId: string) => {
    try {
      await post('/v1/friendship/request', { receiverId: userId });
      onClose();
    } catch (error) {
      console.error('Error sending friend request:', error);
      setError('Không thể gửi lời mời kết bạn');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View className="items-center justify-center py-8">
          <ActivityIndicator size="large" color="#0084ff" />
        </View>
      );
    }

    if (!hasSearched) {
      return (
        <View className="items-center justify-center py-8">
          <Ionicons name="search" size={48} color="#999" />
          <Text className="text-gray-500 mt-4 text-center">
            Nhập email hoặc số điện thoại{'\n'}để tìm kiếm bạn bè
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="items-center justify-center py-8">
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text className="text-red-500 mt-4 text-center">{error}</Text>
        </View>
      );
    }

    if (!matchedUser) {
      return (
        <View className="items-center justify-center py-8">
          <Ionicons name="person-outline" size={48} color="#999" />
          <Text className="text-gray-500 mt-4 text-center">
            Không tìm thấy người dùng
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-row justify-between items-center py-4">
        <View className="flex-row items-center flex-1 mr-3">
          <Image
            source={matchedUser.avatarUrl ? { uri: matchedUser.avatarUrl } : userIcon}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="font-medium text-base">{matchedUser.displayName}</Text>
            <Text className="text-gray-500">{matchedUser.email}</Text>
            <Text className="text-gray-500">{matchedUser.phone}</Text>
            {matchedUser.bio && (
              <Text className="text-gray-500 text-sm mt-1">{matchedUser.bio}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          className="bg-blue-500 py-2 px-4 rounded-lg"
          onPress={() => handleAddFriend(matchedUser._id)}
        >
          <Text className="text-white">Kết bạn</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <BlurView intensity={10} tint="dark" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="flex-1 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-t-3xl">
                <View className="p-4">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-bold">Thêm bạn</Text>
                    <TouchableOpacity onPress={onClose}>
                      <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row items-center bg-gray-100 rounded-lg px-3 mb-4">
                    <Ionicons name="search" size={20} color="#999" />
                    <TextInput
                      className="flex-1 h-12 ml-2 text-base"
                      placeholder="Nhập email hoặc số điện thoại"
                      value={searchQuery}
                      onChangeText={(text) => {
                        setSearchQuery(text);
                        setError(null);
                      }}
                      onSubmitEditing={searchUser}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <TouchableOpacity
                    onPress={searchUser}
                    className="bg-blue-500 py-3 rounded-lg mb-4"
                  >
                    <Text className="text-white text-center text-base font-medium">
                      Tìm kiếm
                    </Text>
                  </TouchableOpacity>

                  {renderContent()}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </BlurView>
    </Modal>
  );
};

export default AddFriend;