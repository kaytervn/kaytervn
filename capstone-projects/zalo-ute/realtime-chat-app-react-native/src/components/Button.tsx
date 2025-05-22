import { Text, TouchableOpacity } from "react-native";
import React from "react";

const Button = ({ onPress, title, color, icon: Icon }: any) => {
  return (
    <TouchableOpacity
      className="py-3 rounded-lg mt-3 flex-row justify-center items-center"
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

export default Button;
