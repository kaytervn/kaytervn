import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronLeft } from "lucide-react-native";

const HeaderLayout2 = ({
  title,
  subtitle,
  onTitlePress,
  RightIcon1,
  RightIcon2,
  onRightIcon1Press,
  onRightIcon2Press,
  showBackButton,
  onBackPress,
  titleLeft = false,
  rightIcon1Color = "#fff",
  rightIcon2Color = "#fff",
}: any) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.leftContainer,
          titleLeft && styles.leftContainerWithTitle,
        ]}
      >
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <ChevronLeft color="#fff" size={24} />
          </TouchableOpacity>
        )}
        {titleLeft && (
          <TouchableOpacity
            onPress={onTitlePress}
            style={styles.titleWrapper}
            disabled={!onTitlePress}
          >
            <Text
              style={[
                styles.title,
                styles.leftTitle,
                showBackButton && styles.titleWithBack,
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </TouchableOpacity>
        )}
      </View>
      {!titleLeft && (
        <View style={styles.titleContainer}>
          <TouchableOpacity
            onPress={onTitlePress}
            style={styles.titleWrapper}
            disabled={!onTitlePress}
          >
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.rightContainer}>
        {RightIcon2 && (
          <TouchableOpacity
            onPress={onRightIcon2Press}
            style={styles.iconButton}
          >
            <RightIcon2 color={rightIcon2Color} size={24} />
          </TouchableOpacity>
        )}
        {RightIcon1 && (
          <TouchableOpacity
            onPress={onRightIcon1Press}
            style={styles.iconButton}
          >
            <RightIcon1 color={rightIcon1Color} size={24} />
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
    height: 70, // Increased height to accommodate subtitle
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
  titleWrapper: {
    alignItems: "flex-start",
  },
  rightContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.8,
    marginTop: 2,
    marginLeft: 8,
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
    paddingHorizontal: 8,
  },
});

export default HeaderLayout2;
