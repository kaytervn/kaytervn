import { View, Text } from "react-native";

const InfoItem = ({ icon, label, value }: any) => (
  <View className="flex-row items-center mb-4">
    {icon}
    <View className="ml-4">
      <Text className="text-gray-500 text-sm">{label}</Text>
      <Text
        className={`text-lg ${value ? "text-black" : "text-gray-400 italic"}`}
      >
        {value || "Chưa cập nhật"}
      </Text>
    </View>
  </View>
);

export default InfoItem;
