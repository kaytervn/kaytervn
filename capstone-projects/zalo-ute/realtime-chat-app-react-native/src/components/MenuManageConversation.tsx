import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"; // Sử dụng Checkbox từ expo-checkbox

const { width, height } = Dimensions.get("window");

interface MenuProps {
  titleUpdate: string;
  titleDelete: string;
  isVisible: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onAddMemberToggle?: (value: boolean) => void;
  onMessageToggle?: (value: boolean) => void;
  onUpdateGroupToggle?: (value: boolean) => void;
  initialAddMember?: boolean;
  initialMessage?: boolean;
  initialUpdateGroup?: boolean;
}

const MenuManageConversation = ({
  titleUpdate,
  titleDelete,
  isVisible,
  onClose,
  onUpdate,
  onDelete,
  onAddMemberToggle,
  onMessageToggle,
  onUpdateGroupToggle,
  initialAddMember = false,
  initialMessage = false,
  initialUpdateGroup = false,
}: MenuProps) => {
  const [slideAnim] = useState(new Animated.Value(height));
  const [addMemberEnabled, setAddMemberEnabled] = useState(initialAddMember);
  const [messageEnabled, setMessageEnabled] = useState(initialMessage);
  const [updateGroupEnabled, setUpdateGroupEnabled] =
    useState(initialUpdateGroup);

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
  }, [isVisible]);

  const handleAddMemberToggle = (value: boolean) => {
    setAddMemberEnabled(value);
    onAddMemberToggle && onAddMemberToggle(value);
  };

  const handleMessageToggle = (value: boolean) => {
    setMessageEnabled(value);
    onMessageToggle && onMessageToggle(value);
  };

  const handleUpdateGroupToggle = (value: boolean) => {
    setUpdateGroupEnabled(value);
    onUpdateGroupToggle && onUpdateGroupToggle(value);
  };

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

          {/* Checkbox for Adding Group Members */}
          <TouchableWithoutFeedback>
            <View style={styles.menuItem}>
              <Ionicons name="person-add-outline" size={24} color="#3498db" />
              <Text style={styles.menuItemText}>
                Có thể thêm thành viên nhóm
              </Text>
              <Checkbox
                value={addMemberEnabled}
                onValueChange={handleAddMemberToggle}
                color={addMemberEnabled ? "#3498db" : undefined}
              />
            </View>
          </TouchableWithoutFeedback>

          {/* Checkbox for Messaging */}
          <TouchableWithoutFeedback>
            <View style={styles.menuItem}>
              <Ionicons name="chatbubble-outline" size={24} color="#2ecc71" />
              <Text style={styles.menuItemText}>Có thể nhắn tin</Text>
              <Checkbox
                value={messageEnabled}
                onValueChange={handleMessageToggle}
                color={messageEnabled ? "#2ecc71" : undefined}
              />
            </View>
          </TouchableWithoutFeedback>

          {/* Checkbox for Updating Group Info */}
          <TouchableWithoutFeedback>
            <View style={styles.menuItem}>
              <Ionicons name="image-outline" size={24} color="#9b59b6" />
              <Text style={styles.menuItemText}>
                Có thể cập nhật ảnh và tên nhóm
              </Text>
              <Checkbox
                value={updateGroupEnabled}
                onValueChange={handleUpdateGroupToggle}
                color={updateGroupEnabled ? "#9b59b6" : undefined}
              />
            </View>
          </TouchableWithoutFeedback>

          {/* Existing Update and Delete Options */}
          <TouchableOpacity style={styles.menuItem} onPress={onUpdate}>
            <Ionicons name="create-outline" size={24} color="#3498db" />
            <Text style={styles.menuItemText}>{titleUpdate}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={onDelete}>
            <Ionicons name="trash-outline" size={24} color="#e74c3c" />
            <Text style={styles.menuItemText}>{titleDelete}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  dismissArea: {
    flex: 1,
  },
  menuContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: "100%",
    maxHeight: height * 0.5,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#bdc3c7",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#34495e",
    flex: 1,
  },
});

export default MenuManageConversation;
