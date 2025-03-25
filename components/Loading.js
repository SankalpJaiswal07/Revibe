import React, { useEffect, useState } from "react";
import { StyleSheet, View, Animated, Dimensions } from "react-native";
import Lottie from "lottie-react-native";
const { width, height } = Dimensions.get("window");

const Loading = ({ source, text }) => {
  const [animationSource, setAnimationSource] = useState(null); // State to hold the animation source
  const fadeAnim = new Animated.Value(0); // For text animation

  useEffect(() => {
    // Dynamically require the animation file based on the source prop
    let animation;
    if (source === "loading") {
      animation = require("../assets/loading.json");
    } else if (source === "saving") {
      animation = require("../assets/saving.json");
    }

    setAnimationSource(animation); // Set the animation source

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
  }, [source, fadeAnim]); // Re-run when source changes

  if (!animationSource) {
    return null; // Prevent rendering if source is not loaded yet
  }

  return (
    <View style={styles.container}>
      <Lottie
        style={styles.lottieAnimation}
        source={animationSource} // Dynamically set animation source
        autoPlay
        loop
      />
      <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
        {text}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lottieAnimation: {
    width: width * 0.7, // Adjust width to 70% of screen width for responsiveness
    height: width * 0.7, // Adjust height proportionally to width
  },
  text: {
    fontSize: width * 0.06, // Dynamic font size (6% of screen width)
    fontFamily: "NacelleSemiBold",
    fontWeight: "600",
    color: "#ffffff",
    textShadowColor: "#666", // Subtle shadow for contrast
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginTop: 20, // Space between animation and text
  },
});

export default Loading;
