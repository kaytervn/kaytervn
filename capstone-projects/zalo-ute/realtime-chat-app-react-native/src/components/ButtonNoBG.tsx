import { Text, TouchableOpacity } from "react-native";
import React from "react";

const ButtonNoBG = ({ onPress, title, color, icon: Icon }: any) => {
  return (
    <TouchableOpacity
        
      style={{ backgroundColor: color }}
      onPress={onPress}
    >
      {Icon && <Icon className="mr-2" size={20} color="#fff" />}
      <Text className="text-center text-white font-semibold text-lg">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonNoBG;
