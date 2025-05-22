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

const FriendRequestItem = ({
  item,
  onItemAccept,
  onItemReject
}: any) => {
  const { put, loading } = useFetch();
  const [showMenuDetail, setShowMenuDetail] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loadingDialog, setLoadingDialog] = useState(false);

  const handleAccept = async () => {
    setShowAcceptModal(false);
    setLoadingDialog(true);
    try {
      const response = await put(`/v1/friendship/accept/`, {friendship: item._id});
      if (response.result) {
       
        onItemAccept(item._id);
      } else {
        throw new Error("Failed to accept friend request");
      }
    } catch (error) {
      console.error("Lỗi chấp nhận lời mời kết bạn:", error);
      Alert.alert("Lỗi chấp nhận lời mời kết bạn. Vui lòng thử lại.");
    } finally {
      setLoadingDialog(false);
    }
  };

  const handleReject = async () => {
    setShowRejectModal(false);
    setLoadingDialog(true);
    try {
      const response = await put(`/v1/friendship/reject/`, {friendship: item._id});
      if (response.result) {
        
        onItemReject(item._id);
      } else {
        throw new Error("Failed to reject friend request");
      }
    } catch (error) {
      console.error("Lỗi từ chối lời mời kết bạn:", error);
      Alert.alert("Lỗi từ chối lời mời kết bạn. Vui lòng thử lại.");
    } finally {
      setLoadingDialog(false);
    }
  };

 

  return (
    <View style={styles.friendItem}>
      <TouchableOpacity onPress={() => setShowMenuDetail(true)} style={styles.infoContainer}>
        <Image
          source={item.sender.avatarUrl ? { uri: item.sender.avatarUrl } : avatarDefault}
          style={styles.avatar}
        />
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{item.sender.displayName}</Text>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={() => setShowAcceptModal(true)}>
            <Ionicons name="checkmark" size={20} color="#2ecc71" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={() => setShowRejectModal(true)}>
            <Ionicons name="close" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <ModalUserDetail
        isVisible={showMenuDetail}
        user={item.sender}
        onClose={() => setShowMenuDetail(false)}
      />

      <ModalConfirm
        isVisible={showAcceptModal}
        title="Chấp nhận lời mời kết bạn?"
        onClose={() => setShowAcceptModal(false)}
        onConfirm={handleAccept}
        textConfirm="Chấp nhận"
        colorConfirm="#2ecc71"
      />

      <ModalConfirm
        isVisible={showRejectModal}
        title="Xác nhận từ chối lời mời kết bạn?"
        onClose={() => setShowRejectModal(false)}
        textConfirm="Từ chối"
        onConfirm={handleReject}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    borderColor: '#2ecc71',
    borderWidth: 2,
  },
  rejectButton: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
});

export default FriendRequestItem;