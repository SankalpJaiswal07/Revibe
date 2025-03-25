import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { Video } from "expo-av";
const { width } = Dimensions.get("window");

const AnimatedBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  const content = [
    {
      text: '"One Earth, endless possibilities—preserve it for the generations to come."',
      video: require("../../assets/video/banner1.mp4"),
    },
    {
      text: '"Waste isn’t waste until we waste it—sort, recycle, and thrive."',
      video: require("../../assets/video/banner2.mp4"),
    },
    {
      text: '"Paper bags carry the future; plastic bags carry the problem."',
      video: require("../../assets/video/banner3.mp4"),
    },
    {
      text: '"A cleaner world begins with a simple toss in the bin—make the right move."',
      video: require("../../assets/video/banner4.mp4"),
    },
    {
      text: '"Plant trees today for a greener tomorrow—nature’s gift to future generations."',
      video: require("../../assets/video/banner5.mp4"),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      fadeOut(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length);
        fadeIn();
      });
    }, 10000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const fadeOut = (callback) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(callback);
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.quoteAndVideoCard}>
        {/* Left Side - Animated Quote */}
        <Animated.View style={[styles.quoteSection, { opacity: fadeAnim }]}>
          <Text style={styles.quoteText}>{content[currentIndex].text}</Text>
        </Animated.View>

        {/* Right Side - Static Video Player */}
        <View style={styles.videoSection}>
          <Video
            source={content[currentIndex].video}
            style={styles.videoPlayer}
            resizeMode="contain"
            shouldPlay
            isLooping
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    paddingHorizontal: Math.max(8, width * 0.025), // Responsive horizontal padding
    paddingVertical: Math.max(4, width * 0.01), // Responsive vertical padding
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  quoteAndVideoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: Math.max(180, width * 0.5), // Responsive height
  },
  quoteSection: {
    flex: 1,
    marginRight: Math.max(8, width * 0.02), // Responsive margin
  },
  quoteText: {
    fontSize: Math.max(12, width * 0.035), // Scaled font size
    fontWeight: "600",
    fontFamily: "NacelleSemiBold",
    fontStyle: "italic",
    color: "#333",
    textAlign: "left",
    lineHeight: Math.max(20, width * 0.055), // Responsive line height
  },
  videoSection: {
    width: "45%", // 40% of the screen width for the video
    height: "100%",
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
});

export default AnimatedBanner;
