import { View, Text, StyleSheet } from "react-native";
import React from "react";

const TabIcon = ({ focused, color, size, icon: Icon, label, badge }: any) => {
  if (focused) {
    return (
      <View style={[styles.focusedContainer, { borderColor: color }]}>
        <View style={styles.iconContainer}>
          <Icon color={color} size={size} />
          {badge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {badge > 99 ? "99+" : badge}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.label, { color }]}>
          {label}
        </Text>
      </View>
    );
  } else {
    return (
      <View style={styles.iconContainer}>
        <Icon color={color} size={size - 3} />
        {badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {badge > 99 ? "99+" : badge}
            </Text>
          </View>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  focusedContainer: {
    alignItems: 'center',
    borderTopWidth: 2,
    paddingTop: 4,
  },
  iconContainer: {
    position: 'relative',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 16,
    height: 16,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default TabIcon;