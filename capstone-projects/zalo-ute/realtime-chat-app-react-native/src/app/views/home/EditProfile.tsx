import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Intro from "../../../components/Intro";
import useForm from "../../hooks/useForm";
import {
  dateToString,
  getDate,
  stringToDate,
  uploadImage,
} from "@/src/types/utils";
import Button from "@/src/components/Button";
import InputField from "@/src/components/InputField";
import {
  CalendarIcon,
  CameraIcon,
  CircleUserRoundIcon,
  InfoIcon,
  LockIcon,
  ShieldCheckIcon,
} from "lucide-react-native";
import DefaultUser from "../../../assets/user_icon.png";
import { LoadingDialog } from "@/src/components/Dialog";
import useFetch from "../../hooks/useFetch";
import Toast from "react-native-toast-message";
import { errorToast } from "@/src/types/toast";
import { EmailPattern, PhonePattern } from "@/src/types/constant";

const EditProfile = ({ navigation }: any) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState(null);
  const [changePassword, setChangePassword] = useState(false);
  const { get, put, post, loading } = useFetch();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.displayName)
      newErrors.displayName = "Tên hiển thị không được bỏ trống";
    if (changePassword) {
      if (!form.currentPassword.trim())
        newErrors.currentPassword = "Mật khẩu hiện tại không được bỏ trống";
      if (!form.newPassword || form.newPassword.length < 6)
        newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
      if (form.confirmPassword !== form.newPassword)
        newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
    }
    return newErrors;
  };

  const { form, setForm, errors, handleChange, isValidForm } = useForm(
    {
      displayName: "",
      bio: "",
      birthDate: "",
      avatarUrl: null,
      roleId: null,
      newPassword: "",
      currentPassword: "",
    },
    {},
    validate
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await get("/v1/user/profile");
      setForm({
        ...res.data,
        birthDate: res.data.birthDate ? getDate(res.data.birthDate) : null,
        roleId: res.data.role._id,      
        newPassword: "",
        currentPassword: "",
        password: null,
      });
    };
    fetchData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri as any);
    }
  };

  const onDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange("birthDate", dateToString(selectedDate));
    }
  };

  const handleSubmit = async () => {
    if (isValidForm()) {
      try {
        let updatedForm = {
          ...form,
          newPassword: changePassword ? form.newPassword : null,
          currentPassword: changePassword ? form.currentPassword : null,
        };
        if (form.birthDate) {
          updatedForm.birthDate = form.birthDate + " 07:00:00";
        }
        if (image) {
          updatedForm.avatarUrl = await uploadImage(image, post);
        }
        const res = await put("/v1/user/update-profile", updatedForm);
        if (res.result) {
          navigation.goBack();
        } else {
          Toast.show(errorToast(res.message));
        }
      } catch (error: any) {
        Toast.show(errorToast(error.message));
      }
    } else {
      Toast.show(errorToast("Vui lòng kiểm tra lại thông tin"));
    }
  };

  return (
    <Intro
      onBack={() => navigation.goBack()}
      loading={<LoadingDialog isVisible={loading} />}
      color="royalblue"
      title="CHỈNH SỬA HỒ SƠ"
      topComponent={
        <View className="items-center my-5">
          <View className="relative">
            <Image
              source={
                image
                  ? { uri: image }
                  : form.avatarUrl
                  ? { uri: form.avatarUrl }
                  : DefaultUser
              }
              className="w-32 h-32 rounded-full"
            />
            <TouchableOpacity
              onPress={pickImage}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 border-2 border-gray-300"
            >
              <CameraIcon size={30} color="royalblue" />
            </TouchableOpacity>
          </View>
        </View>
      }
    >
      <InputField
        title="Tên hiển thị"
        isRequire={true}
        placeholder="Nhập tên hiển thị"
        onChangeText={(value: any) => handleChange("displayName", value)}
        value={form.displayName}
        icon={CircleUserRoundIcon}
        error={errors.displayName}
      />

      <InputField
        title="Tiểu sử"
        isRequire={false}
        placeholder="Đôi nét về bạn"
        onChangeText={(value: any) => handleChange("bio", value)}
        value={form.bio}
        icon={InfoIcon}
      />

      <InputField
        title="Ngày sinh"
        isRequire={false}
        placeholder="Chọn ngày sinh của bạn"
        onChangeText={(value: any) => handleChange("birthDate", value)}
        value={form.birthDate}
        icon={CalendarIcon}
        editable={false}
        onPress={() => {
          setShowDatePicker(true);
        }}
      />
      {showDatePicker && (
        <DateTimePicker
          value={stringToDate(form.birthDate) || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
      <View className="space-y-4 items-end">
        <View className="flex items-center justify-end">
          <TouchableOpacity
            className="flex items-center space-x-2 flex-row"
            onPress={() => {
              setChangePassword(!changePassword);
            }}
          >
            <View
              className={`w-10 h-4 flex rounded-full p-0.5 duration-300 ease-in-out mt-1 ${
                changePassword ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <View
                className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${
                  changePassword ? "translate-x-6" : ""
                }`}
              />
            </View>
            <Text className={`text-base font-semibold`}>Đổi mật khẩu</Text>
          </TouchableOpacity>
        </View>
      </View>

      {changePassword && (
        <View className="border border-gray-200 rounded-lg p-4 space-y-4 mt-4">
          <InputField
            title="Mật khẩu hiện tại"
            isRequire={true}
            placeholder="Nhập mật khẩu hiện tại"
            onChangeText={(value: any) =>
              handleChange("currentPassword", value)
            }
            value={form.currentPassword}
            icon={LockIcon}
            secureTextEntry={true}
            error={errors.currentPassword}
          />
          <InputField
            title="Mật khẩu mới"
            isRequire={true}
            placeholder="Nhập mật khẩu mới"
            onChangeText={(value: any) => handleChange("newPassword", value)}
            value={form.newPassword}
            icon={LockIcon}
            secureTextEntry={true}
            error={errors.newPassword}
          />
          <InputField
            title="Xác nhận mật khẩu"
            isRequire={true}
            placeholder="Nhập mật khẩu xác nhận"
            onChangeText={(value: any) =>
              handleChange("confirmPassword", value)
            }
            value={form.confirmPassword}
            icon={ShieldCheckIcon}
            secureTextEntry={true}
            error={errors.confirmPassword}
          />
        </View>
      )}

      <Button title="LƯU" color="royalblue" onPress={handleSubmit} />
    </Intro>
  );
};

export default EditProfile;
