import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";

const InputField = ({
  title,
  isRequire = false,
  value,
  placeholder,
  onChangeText,
  onPress,
  secureTextEntry = false,
  keyboardType = "default",
  icon: Icon,
  showPassword,
  togglePassword,
  children,
  error,
  maxLength = 100,
  editable = true,
  multiline = false,
  numberOfLines = 1,
}: any) => {
  return (
    <View className="mb-4">
      <Text className="text-base font-semibold text-gray-800 mb-2">
        {title}
        {isRequire && <Text className="text-red-500">{" *"}</Text>}
      </Text>
      <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
        <View
          className={`flex-row items-center border rounded-md p-2 ${
            error ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        >
          {Icon && <Icon size={20} color={error ? "#EF4444" : "#6B7280"} />}
          <TextInput
            className={`flex-1 ml-2 text-base ${
              error ? "text-red-500" : "text-gray-700"
            }`}
            placeholder={placeholder}
            placeholderTextColor={error ? "#EF4460" : "#9CA3AF"}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            maxLength={maxLength}
            editable={editable && !onPress}
            multiline={multiline}
            numberOfLines={numberOfLines}
            textAlignVertical={multiline ? "top" : "center"}
          />
          {togglePassword && (
            <TouchableOpacity onPress={togglePassword} hitSlop={20}>
              {showPassword ? (
                <EyeOffIcon size={20} color={error ? "#EF4444" : "#6B7280"} />
              ) : (
                <EyeIcon size={20} color={error ? "#EF4444" : "#6B7280"} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
      {children}
    </View>
  );
};
export default InputField;
