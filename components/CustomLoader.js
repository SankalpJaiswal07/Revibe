import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import Lottie from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const CustomLoader = ({
  loadingText = "Loading...",
  textStyle,
  containerStyle,
}) => {
  const animationSource = require("../assets/customLoader.json");
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]); // Re-run when source changes

  return (
    <View style={[styles.container, containerStyle]}>
      <Lottie
        style={styles.lottieAnimation}
        source={animationSource}
        autoPlay
        loop
      />
      <Animated.Text style={[styles.loadingText, { opacity: fadeAnim }]}>
        {loadingText}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: height,
    zIndex: 999,
  },
  lottieAnimation: {
    width: width * 0.5, // Adjust width to 50% of screen width for responsiveness
    height: width * 0.5, // Adjust height to match width proportionally
  },
  loadingText: {
    marginTop: 20,
    color: "#19ff04",
    fontSize: width * 0.05,
    fontWeight: "600",
    fontFamily: "Lora_500Medium",
    textShadowColor: "#666", // Subtle shadow for contrast
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default CustomLoader;
