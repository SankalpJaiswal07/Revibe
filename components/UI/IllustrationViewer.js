import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { useAssets } from "expo-asset";

const { width } = Dimensions.get("window");

const IllustrationViewer = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [assets] = useAssets([
    require("../../assets/illustration/illustration1.png"),
    require("../../assets/illustration/illustration2.png"),
    require("../../assets/illustration/illustration3.png"),
    require("../../assets/illustration/illustration4.png"),
  ]);

  useEffect(() => {
    if (!assets) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % assets.length);
    }, 4000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [assets]);

  if (!assets) {
    return null; // Render nothing until assets are loaded
  }

  return (
    <View style={styles.container}>
      <Image
        source={assets[currentImageIndex]}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: Math.min(width * 1, 300), // 80% of screen width, max 300px
    height: (Math.min(width * 1, 300) / 3) * 2, // Maintain 3:2 aspect ratio
    overflow: "hidden",
  },
});

export default IllustrationViewer;
