import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";

const ModalForm = ({
  children,
  isVisible,
  onCancel,
  color,
  title,
  message,
}: any) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel}
    >
      <BlurView
        intensity={100}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />
      <View className="flex-1 justify-center items-center">
        <View
          className="bg-white rounded-lg p-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text className="text-xl font-bold mb-2" style={{ color }}>
            {title}
          </Text>
          <Text className="text-base text-gray-600 mb-6">{message}</Text>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const ConfimationDialog = ({
  isVisible,
  title,
  message,
  color = "green",
  onConfirm,
  confirmText = "Đồng ý",
  onCancel,
}: any) => {
  return (
    <ModalForm
      isVisible={isVisible}
      title={title}
      message={message}
      onCancel={onCancel}
      color={color}
    >
      <View className="flex-row space-x-2">
        <TouchableOpacity
          onPress={onCancel}
          className="p-3 rounded-md bg-gray-200 flex-1"
        >
          <Text className="text-gray-800 text-center text-lg font-semibold">
            Hủy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onConfirm}
          className="p-3 rounded-md flex-1"
          style={{ backgroundColor: color }}
        >
          <Text className="text-white text-center text-lg font-semibold">
            {confirmText}
          </Text>
        </TouchableOpacity>
      </View>
    </ModalForm>
  );
};

const AlertDialog = ({
  isVisible,
  title = "Thông báo",
  message,
  color = "green",
  onAccept,
}: any) => {
  return (
    <ModalForm
      isVisible={isVisible}
      title={title}
      message={message}
      onCancel={onAccept}
      color={color}
    >
      <View className="flex-row">
        <TouchableOpacity
          onPress={onAccept}
          className="p-3 rounded-md flex-1"
          style={{ backgroundColor: color }}
        >
          <Text className="text-white text-center text-lg font-semibold">
            OK
          </Text>
        </TouchableOpacity>
      </View>
    </ModalForm>
  );
};

const LoadingDialog = ({
  isVisible,
  title = "Đang xử lý",
  message = "Vui lòng chờ trong giây lát...",
  color = "royalblue",
}: any) => {
  return (
    <ModalForm
      isVisible={isVisible}
      onCancel={() => {}}
      color={color}
      title={title}
      message={message}
    >
      <View className="bg-white rounded-lg items-center">
        <ActivityIndicator size="large" color={color} />
      </View>
    </ModalForm>
  );
};

export { ConfimationDialog, AlertDialog, LoadingDialog };
