import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Animated,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { StoryModel } from "@/src/models/story/StoryModel";
import defaultUserImg from "../../../assets/user_icon.png";
import useFetch from "../../hooks/useFetch";
import { avatarDefault } from "@/src/types/constant";
import { LoadingDialog } from "@/src/components/Dialog";
import { UserModel } from "@/src/models/user/UserModel";
import { Columns } from "lucide-react-native";

const { width, height } = Dimensions.get("window");
const STORY_DURATION = 5000; // 5 seconds per story

const StoryDetail = ({ route, navigation }: any) => {
  const { get, loading } = useFetch();
  const { itemId } = route.params;
  const [item, setItem] = useState<StoryModel>();
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [paused, setPaused] = useState(false);
  let itemLive = useRef<StoryModel>();
  const progressAnims = useRef<Animated.Value[]>([]);
  const [currentUser, setCurrentUser] = useState<UserModel>();

  // Initialize progress animations when total stories changes
  useEffect(() => {
    progressAnims.current = Array(item?.totalStories || 0)
      .fill(0)
      .map(() => new Animated.Value(0));
  }, [item?.totalStories]);

  useEffect(() => {
    getOneStory(itemId);
  }, []);

  const getOneStory = async (itemId: string) => {
    setLoadingDialog(true);
    try {
      const res = await get(`/v1/story/get/${itemId}`);
      setItem(res.data);
      itemLive.current = res.data;
      startProgress(res.data.position);
      // Fetch user data if needed to change
      if (res.data.user && !currentUser) {
        setCurrentUser(res.data.user);
      } else if (
        res.data.user &&
        currentUser &&
        currentUser._id !== res.data.user._id
      ) {
        setCurrentUser(res.data.user);
      }

      setLoadingDialog(false);
    } catch (error) {
      console.log(error);
    }
    setLoadingDialog(false);
  };

  const startProgress = (currentIndex: number) => {
    setLoadingDialog(true);
    // Reset current progress
    progressAnims.current[currentIndex].setValue(0);

    // Start animation for current story
    Animated.timing(progressAnims.current[currentIndex], {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !paused) {
        handleNext();
      }
    });
    setLoadingDialog(false);
  };

  const handleNext = () => {
    if (
      item &&
      item.position < item.totalStories - 1 &&
      itemLive.current?.nextStory
    ) {
      // Move to next story in the same user's stories
      startProgress(item.position + 1);
      getOneStory(itemLive.current.nextStory);
    } else if (itemLive.current?.nextStory) {
      // Move to next story in the same user's stories
      getOneStory(itemLive.current.nextStory);
    } else {
      route.params?.onRefresh();
      navigation.goBack();
    }
  };

  const handlePrevious = () => {
    if (item && item?.position > 0) {
      // Move to previous story in the same user's stories
      if (itemLive.current?.previousStory) {
        startProgress(item.position - 1);
        getOneStory(itemLive.current.previousStory);
      }
    } else if (itemLive.current?.previousStory) {
      // Move to previous story in the same user's stories
      getOneStory(itemLive.current.previousStory);
    } else {
      route.params?.onRefresh();
      navigation.goBack();
    }
  };

  const handlePress = (evt: any) => {
    const x = evt.nativeEvent.locationX;
    if (x < width / 3) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  const handleLongPress = () => {
    setPaused(true);
    if (item?.position !== undefined) {
      progressAnims.current[item.position].stopAnimation();
    }
  };

  const handlePressOut = () => {
    setPaused(false);
    if (item?.position !== undefined) {
      startProgress(item.position);
    }
  };

  const handleGoBack = () => {
    route.params?.onRefresh();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Multiple Progress Bars */}
      <View style={styles.progressContainer}>
        {Array(item?.totalStories)
          .fill(0)
          .map((_, index) => (
            <View key={index} style={styles.progressWrapper}>
              <Animated.View
                style={[
                  styles.progress,
                  {
                    width:
                      index < (item?.position ?? 0)
                        ? "100%"
                        : index === (item?.position ?? 0)
                        ? progressAnims.current[index]?.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0%", "100%"],
                          })
                        : "0%",
                  },
                ]}
              />
            </View>
          ))}
      </View>

      {/* User Info Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={
              item && item.user ? { uri: item.user.avatarUrl } : defaultUserImg
            }
            style={styles.avatar}
          />
          <View>
            <Text style={styles.username}>
              {item && item.user && item.user.displayName}
            </Text>
            <Text style={styles.createdAt}>{item && item.createdAt}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleGoBack()}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
      </View>

      {/* Story Content */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handlePress}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
        style={styles.storyContainer}
      >
        {loadingDialog ? (
          // <ActivityIndicator size="large" color="#ffffff" />
          <></>
        ) : (
          <Image
            source={
              item && item.imageUrl ? { uri: item.imageUrl } : avatarDefault
            }
            style={styles.storyImage}
            onLoadEnd={() => setLoadingDialog(false)}
          />
        )}
      </TouchableOpacity>

      {/* Views Counter */}
      {item && item.isOwner === 1 && (
        <View style={styles.viewsContainer}>
          <Text style={styles.viewsText}>
            {item.totalViews} {item.totalViews === 1 ? "view" : "views"}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  progressContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingTop: 10,
    gap: 5,
  },
  progressWrapper: {
    flex: 1,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
  },
  progress: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  username: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  createdAt: {
    color: "#fff",
    fontSize: 12,
    fontStyle: "italic",
  },
  closeButton: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "200",
    padding: 5,
  },
  storyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  storyImage: {
    width,
    height: height * 0.8,
    resizeMode: "contain",
  },
  viewsContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 20,
  },
  viewsText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default StoryDetail;
