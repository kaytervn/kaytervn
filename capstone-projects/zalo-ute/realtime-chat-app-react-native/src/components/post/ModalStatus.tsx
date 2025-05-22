import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const ModalStatus= ({ isVisible, onClose, onSelectStatus, slideAnim } : any) => {
  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.dismissArea}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.menuContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.handle} />
          <TouchableOpacity style={styles.menuItem} onPress={() => onSelectStatus(1)}>
            <Ionicons name="globe-outline" size={24} color="#3498db" />
            <Text style={styles.menuItemText}>Công khai</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => onSelectStatus(2)}>
            <Ionicons name="people-outline" size={24} color="#2ecc71" />
            <Text style={styles.menuItemText}>Bạn bè</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => onSelectStatus(3)}>
            <Ionicons name="lock-closed-outline" size={24} color="#e74c3c" />
            <Text style={styles.menuItemText}>Chỉ mình tôi</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: height * 0.5,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#bdc3c7',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#34495e',
  },
});

export default ModalStatus;