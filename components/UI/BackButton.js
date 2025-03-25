import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
const { width } = Dimensions.get("window");

const BackButton = ({ onBackPress, title }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <AntDesign name="left" size={20} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.header}>{title}</Text>
    </View>
  );
};

const styles = {
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Math.max(16, width * 0.04), // Scaled padding
    paddingVertical: Math.max(22, width * 0.06), // Scaled padding
    top: Math.max(15, width * 0.04), // Scaled top position
  },
  backButton: {
    marginRight: Math.max(15, width * 0.04), // Scaled margin
    borderWidth: 3,
    padding: Math.max(10, width * 0.03), // Scaled padding
    borderColor: "#333333",
    borderRadius: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: Math.max(18, width * 0.05), // Scaled font size
    fontWeight: "bold",
    color: "#FFFFFF", // White text
  },
};

export default BackButton;
