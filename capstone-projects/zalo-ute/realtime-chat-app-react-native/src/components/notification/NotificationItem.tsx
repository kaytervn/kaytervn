import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NotificationModel } from "@/src/models/notification/NotificationModel";
import useFetch from "@/src/app/hooks/useFetch";
import { avatarDefault, imageInfo } from "@/src/types/constant";

const NotificationItem = ({ item, onItemClick }: any) => {
  const { put, loading } = useFetch();
  const [status, setStatus] = useState(item.status);
  const handlePress = async () => {
    console.log("touchable pressed");
    try {
      if (item.status !== 2) {
        // If notification is unread
        setStatus(2);
        onItemClick?.(item);
        const response = await put(`/v1/notification/read/${item._id}`);

        if (!response.result) {
          throw new Error("Failed to mark notification as read");
        }
        // Call the callback to update the parent state
      } else {
        onItemClick?.(item);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to mark notification as read. Please try again.",
        [{ text: "OK" }]
      );
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, status !== 2 ? styles.unreadItem : null]}
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>
        <Image
          source={
            item.data.user
              ? item.data.user.avatarUrl
                ? { uri: item.data.user.avatarUrl }
                : avatarDefault
              : imageInfo
          }
          style={styles.avatar}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.time}>{item.createdAt}</Text>
      </View>
      {status !== 2 && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  unreadItem: {
    backgroundColor: "#e6f3ff",
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
    alignSelf: "center",
    marginLeft: 8,
  },
});

export default NotificationItem;
