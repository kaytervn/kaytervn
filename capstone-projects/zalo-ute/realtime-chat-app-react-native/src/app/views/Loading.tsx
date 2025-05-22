import React, { useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, Animated, Image } from "react-native";

const Loading = () => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: "royalblue" }}
    >
      <View className="items-center mb-5">
        <Image
          source={require("../../assets/cookiedu_logo.png")}
          style={{ width: 150, height: 150 }}
        />
        <Text className="text-3xl font-bold text-white mt-3">Zalo UTE</Text>
      </View>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

export default Loading;
