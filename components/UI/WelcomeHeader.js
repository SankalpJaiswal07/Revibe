import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const { width } = Dimensions.get("window");

const WelcomeHeader = ({
  userName,
  onNotificationPress = () => {},
  profileUrl,
  onProfilePress = () => {},
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.welcomeTextContainer}>
        <Text style={styles.welcomeText}>Welcome to Revibe,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <View style={styles.iconsContainer}>
        {/* Notification Bell Icon Container */}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <MaterialIcons name="notifications" size={18} color="#ffffff" />

          {/* Notification Bell Icon */}
        </TouchableOpacity>

        {/* Profile Picture Container */}
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <Image source={{ uri: profileUrl }} style={styles.image} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#000000",
    paddingVertical: Math.max(12, width * 0.04), // Responsive padding
    paddingHorizontal: Math.max(8, width * 0.02), // Responsive padding
    width: "100%",
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeText: {
    color: "#9ca3af", // gray-300
    fontSize: Math.max(12, width * 0.035), // Scaled font size
    fontFamily: "NacelleLight",
  },
  userName: {
    color: "#ffffff",
    fontSize: Math.max(16, width * 0.045), // Scaled font size
    fontFamily: "Nacellebold",
    fontWeight: "bold",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Math.max(12, width * 0.04), // Responsive gap
  },
  iconContainer: {
    width: Math.max(36, width * 0.1), // Scaled width
    height: Math.max(36, width * 0.1), // Scaled height
    borderRadius: Math.max(18, width * 0.05), // Responsive border radius
    backgroundColor: "#27272a", // zinc-800
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    width: Math.max(36, width * 0.1), // Scaled size
    height: Math.max(36, width * 0.1), // Scaled size
    borderRadius: Math.max(18, width * 0.05), // Responsive border radius
    backgroundColor: "#27272a", // zinc-800
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
});

export default WelcomeHeader;
