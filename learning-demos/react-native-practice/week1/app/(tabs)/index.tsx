import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("http://localhost:8081/home");
    }, 10000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.profileImage}
          resizeMode="contain"
        />
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          Hi there! <HelloWave />, My name is Trọng
        </ThemedText>
      </ThemedView>
      <ThemedText style={styles.introText}>
        I'm a passionate software developer with a strong focus on Spring Boot.
      </ThemedText>
      <Collapsible title="About Me">
        <ThemedText>
          I have been working with Spring Boot for several years and have a lot
          of experience in building scalable and reliable applications using
          this framework. I have a deep understanding of Spring Boot's core
          concepts and best practices, and I'm always eager to learn and apply
          new technologies to improve my skills.
        </ThemedText>
      </Collapsible>
      <Collapsible title="My Skills">
        <ThemedText>
          - Spring Boot - Java - Spring Security - Spring Data JPA - Spring
        </ThemedText>
      </Collapsible>
      <Collapsible title="Education">
        <ThemedText>
          Ho Chi Chi Minh City University of Technology and Education
        </ThemedText>
      </Collapsible>
      <Collapsible title="Contact Me">
        <ThemedText>Email: kienductrong@gmail.com</ThemedText>
        <ExternalLink href="https://github.com/kaytervn">
          <ThemedText type="link">My Github Profile</ThemedText>
        </ExternalLink>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  introText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 30,
    overflow: "hidden",
  },
});
