import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Intro from "@/src/components/Intro";
import {
  CalendarIcon,
  IdCardIcon,
  InfoIcon,
  KeyRoundIcon,
  LogOutIcon,
  PencilIcon,
  PhoneIcon,
  ShieldCheckIcon,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserIcon from "@/src/assets/user_icon.png";
import Button from "@/src/components/Button";
import InfoItem from "@/src/components/InfoItem";
import { ConfimationDialog, LoadingDialog } from "@/src/components/Dialog";
import useDialog from "../../hooks/useDialog";
import useFetch from "../../hooks/useFetch";
import { getDate } from "@/src/types/utils";

const Profile = ({ navigation }: any) => {
  const { isDialogVisible, showDialog, hideDialog } = useDialog();
  const { get, loading } = useFetch();
  const [profile, setProfile] = useState({
    displayName: "Đang tải",
    email: "Đang tải",
    phone: "Đang tải",
    birthDate: "Đang tải",
    bio: "Đang tải",
    studentId: "Đang tải",
    avatarUrl: null,
    role: { name: "Đang tải" },
  });
  const fetchData = async () => {
    const res = await get("/v1/user/profile");
    setProfile({
      ...res.data,
      birthDate: res.data.birthDate ? getDate(res.data.birthDate) : null,
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    hideDialog();
    AsyncStorage.removeItem("accessToken");
    navigation.navigate("Home");
    navigation.navigate("Login");
  };

  const handleLogoutDialog = () => {
    showDialog();
  };

  return (
    <Intro
      loading={<LoadingDialog isVisible={loading} />}
      color="royalblue"
      title="TÀI KHOẢN"
      onRefresh={fetchData}
      topComponent={
        <View className="items-center my-5">
          <Image
            source={profile.avatarUrl ? { uri: profile.avatarUrl } : UserIcon}
            className="w-32 h-32 rounded-full"
          />
          <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
            <Text className="text-2xl font-bold text-white mt-2">
              {profile.displayName} <PencilIcon size={24} color={"white"} />
            </Text>
          </TouchableOpacity>
          <Text className="text-lg text-gray-200">{profile.email}</Text>
        </View>
      }
    >
      <View className="bg-white rounded-lg shadow-md">
        <InfoItem
          icon={<InfoIcon size={24} color="royalblue" />}
          label="Tiểu Sử"
          value={profile.bio}
        />
        <InfoItem
          icon={<PhoneIcon size={24} color="royalblue" />}
          label="Số Điện Thoại"
          value={profile.phone}
        />
        <InfoItem
          icon={<IdCardIcon size={24} color="royalblue" />}
          label="Mã sinh viên"
          value={profile.studentId}
        />
        <InfoItem
          icon={<CalendarIcon size={24} color="royalblue" />}
          label="Ngày Sinh"
          value={profile.birthDate}
        />
        <InfoItem
          icon={<ShieldCheckIcon size={24} color="royalblue" />}
          label="Vai trò"
          value={profile.role.name}
        />
      </View>

      <Button
        icon={KeyRoundIcon}
        title="CẬP NHẬT THÔNG TIN"
        color="royalblue"
        onPress={() => navigation.navigate("RequestKeyChange")}
      />
      <Button
        icon={LogOutIcon}
        title="ĐĂNG XUẤT"
        color="red"
        onPress={handleLogoutDialog}
      />
      <ConfimationDialog
        isVisible={isDialogVisible}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất?"
        onConfirm={handleLogout}
        confirmText="Đăng xuất"
        onCancel={hideDialog}
        color="red"
      />
    </Intro>
  );
};

export default Profile;
