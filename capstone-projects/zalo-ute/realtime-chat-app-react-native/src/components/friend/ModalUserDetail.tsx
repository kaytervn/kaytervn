import React from 'react';
import { View, Text, Image, Modal, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { avatarDefault } from '@/src/types/constant';

const { width } = Dimensions.get('window');

const ModalUserDetail = ({ isVisible, user, onClose } : any) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#333" size={24} />
          </TouchableOpacity>
          
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Image 
              source={ user.avatarUrl ? { uri: user.avatarUrl } : avatarDefault} 
              style={styles.avatar}
            />
            <Text style={styles.displayName}>{user.displayName}</Text>
            
            <View style={styles.infoContainer}>
              <InfoItem icon="🕒" label="Online gần nhất" value={user.lastLogin || 'Không rõ'} />
              <InfoItem icon="🎂" label="Ngày sinh" value={user.birthDate || 'Chưa cập nhật'} />
            </View>

            <View style={styles.bioContainer}>
              <Text style={styles.bioLabel}>Giới thiệu</Text>
              <ScrollView style={styles.bioScroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.bioText}>{user.bio || 'Không có giới thiệu'}</Text>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const InfoItem = ({ icon, label, value } : any) => (
  <View style={styles.infoItem}>
    <View style={styles.infoLabelContainer}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '90%'
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 20
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16
  },
  displayName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333'
  },
  infoContainer: {
    width: '100%',
    marginBottom: 24
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 8
  },
  infoLabel: {
    fontWeight: '600',
    fontSize: 16,
    color: '#666'
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  bioContainer: {
    width: '100%',
    marginBottom: 16
  },
  bioLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666'
  },
  bioScroll: {
    maxHeight: 120,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333'
  }
});

export default ModalUserDetail;
