import React, { useState, useRef } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, Dimensions, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const imageWidth = width - 20; // Subtracting 20 to account for container padding

// New ModalListImageComponent component
const ModalListImageComponent = ({ images, isVisible, initialIndex, onClose }: any) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef(null);

  const renderFullScreenImageItem = ({ item, index }: any) => (
    <View style={styles.fullScreenImageContainer}>
      <Image 
        source={{ uri: item }} 
        style={styles.fullScreenImage} 
        resizeMode="contain"
      />
      {images.length > 1 && (
        <Text style={styles.fullScreenCounter}>
          {`${index + 1}/${images.length}`}
        </Text>
      )}
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenContainer}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
        >
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={renderFullScreenImageItem}
          keyExtractor={(item, index) => `fullscreen-${index}`}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(newIndex);
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImageContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: width,
    height: height,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullScreenCounter: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    padding: 10,
    borderRadius: 20,
    fontSize: 16,
  },
});

export default ModalListImageComponent;