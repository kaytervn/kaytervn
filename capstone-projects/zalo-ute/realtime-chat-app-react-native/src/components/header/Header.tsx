import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronLeft } from "lucide-react-native";

const HeaderLayout = ({
  title,
  RightIcon,
  onRightIconPress,
  showBackButton,
  onBackPress,
  titleLeft = false
}: any) => {
  return (
    <View style={styles.container}>
      <View style={[
        styles.leftContainer,
        titleLeft && styles.leftContainerWithTitle
      ]}>
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <ChevronLeft color="#fff" size={24} />
          </TouchableOpacity>
        )}
        {titleLeft && (
          <Text 
            style={[
              styles.title,
              styles.leftTitle,
              showBackButton && styles.titleWithBack
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
      </View>
      {!titleLeft && (
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
      )}
      <View style={styles.rightContainer}>
        {RightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.iconButton}
          >
            <RightIcon color="#fff" size={24} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 60,
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "#059BF0",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  leftContainer: {
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "row",
  },
  leftContainerWithTitle: {
    flex: 2,
    alignItems: "center",
  },
  titleContainer: {
    flex: 2,
    alignItems: "center",
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  leftTitle: {
    textAlign: "left",
    marginLeft: 4,
  },
  titleWithBack: {
    marginLeft: 8,
  },
  backButton: {
    padding: 8,
  },
  iconButton: {
    paddingVertical: 10,
    paddingStart: 15,
  },
});

export default HeaderLayout;