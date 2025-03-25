import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const layers = [
    {
      title: "Welcome to Revibe",
      idea: "Discover sustainable recycling and creative reuse ideas.",
      illustration: require("../assets/illustration/illustration1.png"),
    },
    {
      title: "Scan. Analyze. Recycle.",
      idea: "Upload a photo, and get instant recycling tips and creative reuse ideas with AI.",
      illustration: require("../assets/illustration/onboard2.jpg"),
    },
    {
      title: "Recycle Right, Every Time.",
      idea: "Identify the correct bin for paper, plastic, glass, and more to keep recycling simple.",
      illustration: require("../assets/illustration/onboard3.png"),
    },
    {
      title: "Transform Waste into Wonders.",
      idea: "Discover DIY ideas to turn everyday waste into something beautiful and useful.",
      illustration: require("../assets/illustration/onboard4.png"),
    },
  ];

  const handleNext = () => {
    if (currentIndex < layers.length - 1) {
      scrollViewRef.current.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      });
    } else {
      navigation.navigate("Signup");
    }
  };

  const handleSkip = () => {
    navigation.navigate("Login");
  };

  const handleScroll = (event) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / Dimensions.get("window").width);
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Onboarding Layers */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      >
        {layers.map((layer, index) => (
          <View key={index} style={styles.layer}>
            <View style={styles.illustrationContainer}>
              <Image source={layer.illustration} style={styles.illustration} />
            </View>
            <View style={styles.contentStyle}>
              <Text style={styles.title}>{layer.title}</Text>
              <Text style={styles.idea}>{layer.idea}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Navigation Controls */}
      <View style={styles.controls}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {layers.map((_, i) => {
            const dotStyle = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.8, 1.5, 0.8],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    transform: [{ scale: currentIndex === i ? 1.5 : 1 }],
                    backgroundColor: currentIndex === i ? "white" : "#666",
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Navigation Buttons */}
        {currentIndex < layers.length - 1 ? (
          // "Next" Button
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Feather name="arrow-right-circle" size={60} color="white" />
          </TouchableOpacity>
        ) : (
          // "Get Started" Button
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleNext}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  layer: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
    padding: width * 0.05,
    top: 10,
  },
  illustrationContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
  illustration: {
    width: width * 0.95, // 80% of screen width
    height: height * 0.5,
    resizeMode: "contain",
    backgroundColor: "#fff",
  },
  contentStyle: {
    flex: 1,
    top: -40,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    color: "white",
    fontFamily: "NacelleBold",
    fontWeight: "700",
  },
  idea: {
    fontSize: 15,
    color: "lightgray",
    marginVertical: 10,
    fontFamily: "NacelleRegular",
    fontWeight: "400",
  },
  controls: {
    position: "absolute",
    bottom: 15,
    left: 10,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 30,
    paddingHorizontal: 25,
    zIndex: 1,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#666",
    marginHorizontal: 4,
  },
  nextButton: {
    // justifyContent: "center",
    // alignItems: "center",
  },
  getStartedButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#064E3B",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  getStartedButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "NacelleBold",
    fontWeight: "700",
  },
  skipButton: {
    position: "absolute",
    top: 30,
    right: 25,
    zIndex: 1,
  },
  skipText: {
    color: "white",
    fontSize: 16,
    fontFamily: "NacelleRegular",
    fontWeight: "400",
  },
});

export default OnboardingScreen;
