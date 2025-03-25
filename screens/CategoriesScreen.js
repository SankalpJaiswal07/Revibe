import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { useAssets } from "expo-asset";
import IconButton from "../components/UI/IconButton";

import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const CategoriesScreen = () => {
  // Load images using the correct relative paths
  const navigation = useNavigation();

  const [assets] = useAssets([
    require("../assets/bin/Organic.png"),
    require("../assets/bin/Plastic.png"),
    require("../assets/bin/Paper.png"),
    require("../assets/bin/Glass.png"),
    require("../assets/bin/Metal.png"),
    require("../assets/bin/Electronics.png"),
    require("../assets/bin/others.png"),
  ]);

  const handleNavigation = (categoryName) => {
    navigation.navigate("Categories", {
      screen: "CategoriesItemScreen",
      params: { categoryName },
    });
  };

  if (!assets) {
    return <Text>Loading assets...</Text>;
  }

  const categories = [
    { id: 1, name: "Organic", icon: assets[0] },
    { id: 2, name: "Plastic", icon: assets[1] },
    { id: 3, name: "Paper", icon: assets[2] },
    { id: 4, name: "Glass", icon: assets[3] },
    { id: 5, name: "Metal", icon: assets[4] },
    { id: 6, name: "Electronics", icon: assets[5] },
    { id: 7, name: "Others", icon: assets[6] },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recycling Categories</Text>
      </View>
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.categoryList}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              activeOpacity={0.8}
              onPress={() => {
                handleNavigation(category.name);
              }}
            >
              <View style={styles.iconContainer}>
                <Image source={category.icon} style={styles.icon} />
              </View>

              <Text style={styles.categoryName}>{category.name}</Text>

              <View style={styles.navigationIcon}>
                <IconButton icon={"arrow-right-alt"} color={"#fff"} size={20} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: Math.max(12, width * 0.04), // Responsive horizontal padding
    paddingTop: Math.max(40, width * 0.1), // Scaled padding
    display: "flex",
    flexDirection: "column",
  },
  scrollViewContainer: {
    marginBottom: Math.max(80, width * 0.3),
  },
  header: {
    marginBottom: Math.max(8, width * 0.02), // Responsive margin
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: Math.max(20, width * 0.06), // Responsive font size
    fontFamily: "NacelleBold",
    fontWeight: "bold",
    color: "#ECFDF5",
    textAlign: "center",
  },
  categoryList: {
    flexDirection: "column",
    gap: Math.max(12, width * 0.04), // Scaled gap
    marginBottom: 10,
  },
  categoryItem: {
    borderWidth: 1,
    borderColor: "#ECFDF5",
    borderRadius: 16,
    padding: Math.max(12, width * 0.04), // Scaled padding
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: "#D1FAE5",
    borderRadius: 50,
    width: Math.max(40, width * 0.12), // Scaled width
    height: Math.max(40, width * 0.12), // Scaled height
    justifyContent: "center",
    alignItems: "center",
    marginRight: Math.max(12, width * 0.03), // Scaled margin
  },
  icon: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
  categoryName: {
    flex: 1,
    fontSize: Math.max(16, width * 0.045), // Scaled font size
    fontFamily: "NacelleSemiBold",
    fontWeight: "500",
    color: "#fff",
  },
  navigationIcon: {
    borderWidth: 1,
    borderColor: "#ECFDF5",
    borderRadius: 50,
    width: Math.max(36, width * 0.1), // Scaled width
    height: Math.max(36, width * 0.1), // Scaled height
    justifyContent: "center",
    alignItems: "center",
  },
});
