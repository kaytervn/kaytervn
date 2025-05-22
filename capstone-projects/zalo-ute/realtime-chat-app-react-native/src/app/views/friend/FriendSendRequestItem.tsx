import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FriendModel } from '@/src/models/friend/FriendModel';
import ModalUserDetail from '@/src/components/friend/ModalUserDetail';
import Toast from 'react-native-toast-message';
import { successToast } from '@/src/types/toast';
import useFetch from '../../hooks/useFetch';
import { avatarDefault } from '@/src/types/constant';
import ModalConfirm from '@/src/components/post/ModalConfirm';
import { LoadingDialog } from '@/src/components/Dialog';

const FriendSendRequestItem = ({ 
  item,
  onItemDelete
}: any) => {
  const { del, loading } = useFetch();
  const [showMenuDetail, setShowMenuDetail] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDialog, setLoadingDialog] = useState(false);

  const handleDelete = async () => {
    setShowDeleteModal(false);
    setLoadingDialog(true);
    try {
      const response = await del(`/v1/friendship/delete/${item._id}`);
      if (response.result) {
        onItemDelete(item._id);
        
      } else {
        throw new Error("Failed to delete friend request");
      }
    } catch (error) {
      console.error("Lỗi xóa yêu cầu kết bạn:", error);
      Alert.alert("Lỗi xóa yêu cầu kết bạn. Vui lòng thử lại.");
    } finally {
      setLoadingDialog(false);
    }
  };

  return (
    <View style={styles.friendItem}>
      {loadingDialog && <LoadingDialog isVisible={loadingDialog} />}
      <TouchableOpacity onPress={() => setShowMenuDetail(true)} style={styles.infoContainer}>
        <Image
          source={item.receiver.avatarUrl ? { uri: item.receiver.avatarUrl } : avatarDefault}
          style={styles.avatar}
        />
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{item.receiver.displayName}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => setShowDeleteModal(true)}>
        <Text style={styles.deleteButtonText}>Xóa</Text>
      </TouchableOpacity>
      </TouchableOpacity>

      <ModalUserDetail
        isVisible={showMenuDetail}
        user={item.receiver}
        onClose={() => setShowMenuDetail(false)}
      />

      <ModalConfirm
        isVisible={showDeleteModal}
        title="Xác nhận xóa yêu cầu kết bạn này?"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  friendItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  friendLastLogin: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FriendSendRequestItem;