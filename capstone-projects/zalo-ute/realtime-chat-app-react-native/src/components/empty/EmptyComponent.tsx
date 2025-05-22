import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { AlertCircle, Box } from 'lucide-react-native';
import { emptyBox } from '@/src/types/constant';

const EmptyComponent = ({
  message = "Không có dữ liệu",
  iconSize = 48,
}) => {
  return (
    <View style={styles.container}>
      <Image source={emptyBox} style={[styles.icon, { width: iconSize, height: iconSize}]} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  icon: {
    marginBottom: 16,
  },
  message: {
    marginBottom: 16,
    fontSize: 15,
    fontWeight: '600',
    color: '#898989EB',
    textAlign: 'center',
  },
  actionButtonContainer: {
    marginTop: 16,
  },
});

export default EmptyComponent;