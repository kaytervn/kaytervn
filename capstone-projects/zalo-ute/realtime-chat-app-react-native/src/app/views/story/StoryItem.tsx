// StoryItem.tsx
import { avatarDefault } from "@/src/types/constant";
import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";

export const StoryItem = ({ item, onPress }: any) => (
  <TouchableOpacity style={styles.storyContainer} onPress={() => onPress(item)}>
    <View
      style={[
        styles.storyRing,
        { borderColor: item.isViewed ? "#8e8e8e" : "#059BF0" },
      ]}
    >
      <Image
        source={
          item.user.avatarUrl ? { uri: item.user.avatarUrl } : avatarDefault
        }
        style={styles.storyAvatar}
      />
    </View>
    <Text numberOfLines={1} style={styles.storyUsername}>
      {item.isOwner ? "Tin của bạn" : item.user.displayName}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  storyContainer: {
    alignItems: "center",
    marginHorizontal: 4,
    width: 80,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    padding: 2,
    marginBottom: 4,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  storyUsername: {
    fontSize: 12,
    textAlign: "center",
    color: "#262626",
    maxWidth: 64,
  },
  addStoryButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  plusIcon: {
    fontSize: 32,
    color: "#059BF0",
  },
});
