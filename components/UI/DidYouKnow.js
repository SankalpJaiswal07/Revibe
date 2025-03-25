import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const DidYouKnow = () => {
  const data = [
    {
      image:
        "https://images.pexels.com/photos/1267333/pexels-photo-1267333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description:
        "Recycling one aluminum can saves enough energy to run your TV for three hours. Start with your soda cans!",
    },
    {
      image:
        "https://images.pexels.com/photos/7512924/pexels-photo-7512924.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description:
        "An average household throws away over 40 plastic bottles a month. Recycle them to help reduce plastic waste.",
    },
    {
      image:
        "https://images.pexels.com/photos/167538/pexels-photo-167538.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description:
        "By recycling newspapers for a month, you can save 4 trees. Every page counts!",
    },
    {
      image:
        "https://images.pexels.com/photos/5740584/pexels-photo-5740584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description:
        "Food scraps don’t belong in the trash. Composting them can create nutrient-rich soil for gardening.",
    },
    {
      image:
        "https://images.pexels.com/photos/6990599/pexels-photo-6990599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description:
        "Teaching kids to recycle today ensures a cleaner tomorrow. Start by sorting waste at home!",
    },
    {
      image:
        "https://images.unsplash.com/photo-1706612203675-622379c4f117?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description:
        "Every minute, a truckload of plastic ends up in the ocean. Recycle to keep our seas clean.",
    },
    {
      image:
        "https://images.pexels.com/photos/16388464/pexels-photo-16388464/free-photo-of-stack-of-obsolete-phones.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description:
        "Old phones and laptops contain valuable metals. Recycle e-waste to give them a second life!",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 20000); // Change every 20 seconds
    return () => clearInterval(interval);
  }, [data.length]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: data[currentIndex].image }} style={styles.image} />
      <Text style={styles.title}>Did you know?</Text>
      <Text style={styles.description}>{data[currentIndex].description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    paddingVertical: height * 0.01, // 1% of screen height
    paddingHorizontal: width * 0.03, // 3% of screen width
    borderRadius: 12,
    alignItems: "center",
    marginTop: height * 0.02, // 2% of screen height
    marginBottom: height * 0.07, // 7% of screen height
  },
  image: {
    width: "100%",
    height: height * 0.28,
    borderRadius: 12,
    marginBottom: height * 0.02, // 2% of screen height
    overflow: "hidden",
  },
  title: {
    fontSize: width * 0.045,
    color: "#fff",
    fontFamily: "NacelleBold", // Updated font
    fontWeight: "bold", // Corresponding font weight
    marginBottom: height * 0.01,
  },
  description: {
    fontSize: width * 0.04,
    color: "#ccc",
    fontFamily: "NacelleLight", // Updated font
    fontWeight: "300", // Corresponding font weight
    textAlign: "center",
    letterSpacing: 0.5,
  },
});

export default DidYouKnow;
