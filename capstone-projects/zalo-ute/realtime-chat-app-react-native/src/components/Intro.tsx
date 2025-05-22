import {
  View,
  Text,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useCallback, useState } from "react";
import Toast from "react-native-toast-message";
import { ChevronLeftIcon } from "lucide-react-native";

const Intro = ({
  color,
  header,
  subHeader,
  children,
  loading,
  dialog,
  topComponent,
  title,
  onBack,
  onRefresh,
}: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  }, [onRefresh]);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View className="flex-row px-3 pt-3" style={{ backgroundColor: color }}>
        {onBack && (
          <TouchableOpacity className="mr-1 pt-1" onPress={onBack}>
            <ChevronLeftIcon size={25} color="white" />
          </TouchableOpacity>
        )}
        {title && (
          <Text className="text-white text-start text-2xl font-bold">
            {title}
          </Text>
        )}
      </View>
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: color }}
      >
        <StatusBar barStyle="light-content" backgroundColor="black" />
        {topComponent}
        <View
          className={`bg-white rounded-t-3xl p-6 flex-1 w-full ${
            topComponent ? "" : "mt-20"
          }`}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              onRefresh && (
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[color]}
                  progressBackgroundColor={"#ffffff"}
                />
              )
            }
          >
            {header && (
              <Text className="text-3xl font-bold" style={{ color }}>
                {header}
              </Text>
            )}
            {subHeader && (
              <Text className="text-base mb-8 text-gray-600">{subHeader}</Text>
            )}
            {children}
          </ScrollView>
        </View>
        <Toast />
        {loading}
        {dialog}
      </View>
    </KeyboardAvoidingView>
  );
};

export default Intro;
