import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HomeScreenNavigationProp } from "../navigation/types";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

type Props = {
  navigation: HomeScreenNavigationProp;
};

const UserProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("userName");
    await AsyncStorage.removeItem("userEmail");
    navigation.navigate("Login");
  };

  useEffect(() => {
    const loadUserData = async () => {
      const userName = await AsyncStorage.getItem("userName");
      const userEmail = await AsyncStorage.getItem("userEmail");
      setName(userName || "");
      setEmail(userEmail || "");
    };
    loadUserData();
    const timer = setTimeout(() => {
      navigation.navigate("Homepage");
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: "https://avatars.githubusercontent.com/u/118961250?s=400&u=1020279353fa12e3ec7ab4912fc4556e75c1cc3e&v=4",
          }}
          style={styles.profileImage}
        />
      </View>
      <Text style={styles.title}>User Profile</Text>
      <Text>Name: {name}</Text>
      <Text>Email: {email}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const HomePageScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Homepage!</Text>
    </View>
  );
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === "User") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Homepage") {
            iconName = focused ? "home" : "home-outline";
          } else {
            iconName = "log-out-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="User" component={UserProfileScreen} />
      <Tab.Screen name="Homepage" component={HomePageScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    width: 150,
    marginTop: 50,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HomeScreen;
