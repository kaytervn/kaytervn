import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, BackHandler } from "react-native";
import { MailIcon, LockIcon, User } from "lucide-react-native";
import InputField from "@/src/components/InputField";
import Button from "@/src/components/Button";
import useDialog from "../hooks/useDialog";
import useBackHandler from "../hooks/useBackHandler";
import Intro from "@/src/components/Intro";
import useForm from "../hooks/useForm";
import { ConfimationDialog, LoadingDialog } from "@/src/components/Dialog";
import { useLoading } from "../hooks/useLoading";
import { CommonActions } from "@react-navigation/native";
import { remoteUrl } from "@/src/types/constant";
import Toast from "react-native-toast-message";
import { errorToast } from "@/src/types/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useFetch from "../hooks/useFetch";

const Login = ({ navigation }: any) => {
  const { get, loading } = useFetch();
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, showLoading, hideLoading } = useLoading();
  const { isDialogVisible, showDialog, hideDialog } = useDialog();
  useBackHandler(showDialog);

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.username.trim()) {
      newErrors.username = "Tên đăng nhập không được bỏ trống";
    }
    if (!form.password) {
      newErrors.password = "Mật khẩu không được bỏ trống";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    { username: "", password: "" },
    {},
    validate
  );

  useEffect(() => {
    const checkToken = async () => {
      if (await AsyncStorage.getItem("accessToken")) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
          })
        );
      }
    };
    checkToken();
  }, []);

  const handleSubmit = async () => {
    if (isValidForm()) {
      showLoading();
      try {
        const response = await fetch(`${remoteUrl}/v1/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          await AsyncStorage.setItem("accessToken", data.data.accessToken);

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Home" }],
            })
          );
        } else {
          Toast.show(errorToast(data.message));
        }
      } catch (error: any) {
        Toast.show(errorToast(error.message));
      } finally {
        hideLoading();
      }
    }
  };

  return (
    <Intro
      loading={<LoadingDialog isVisible={isLoading} />}
      color="royalblue"
      header="Xin chào!"
      subHeader="Đăng nhập để tiếp tục"
      dialog={
        <ConfimationDialog
          isVisible={isDialogVisible}
          title="Thoát ứng dụng"
          confirmText="Thoát"
          color="red"
          message="Bạn có muốn thoát ứng dụng không?"
          onConfirm={() => BackHandler.exitApp()}
          onCancel={hideDialog}
        />
      }
    >
      <InputField
        title="Tài khoản đăng nhập"
        isRequire={true}
        placeholder="Nhập email, SĐT hoặc MSSV"
        onChangeText={(value: any) => handleChange("username", value)}
        value={form.username}
        icon={MailIcon}
        error={errors.username}
      />
      <InputField
        title="Mật khẩu"
        isRequire={true}
        placeholder="Nhập mật khẩu"
        onChangeText={(value: any) => handleChange("password", value)}
        value={form.password}
        icon={LockIcon}
        secureTextEntry={!showPassword}
        togglePassword={() => setShowPassword(!showPassword)}
        showPassword={showPassword}
        error={errors.password}
      >
        <View className="items-end">
          <TouchableOpacity
            className="mt-2"
            hitSlop={20}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text className="text-sm text-gray-600">Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>
      </InputField>
      <Button title="ĐĂNG NHẬP" color="royalblue" onPress={handleSubmit} />
      <View className="mt-4 flex-row justify-center">
        <Text className="text-base text-center text-bold text-gray-600">
          Chưa có tài khoản?{" "}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text className="text-base text-center font-bold text-blue-600">
            Đăng ký
          </Text>
        </TouchableOpacity>
      </View>
    </Intro>
  );
};

export default Login;
