import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAssets } from "expo-asset";
import RecentlyAddedItems from "../components/UI/RecentlyAddedItems";
import WelcomeHeader from "../components/UI/WelcomeHeader";
import AnimatedBanner from "../components/UI/AnimatedBanner ";
import { getCombinedUserData } from "../services/supabase";
import CustomLoader from "../components/CustomLoader";
import { useGlobalContext } from "../util/GlobalContext";

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();
  const [photoUrl, setPhotoUrl] = useState("");
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { syncApp, getNotificationsFromAsyncStorage } = useGlobalContext();

  // Load assets using useAssets
  const [assets] = useAssets([
    require("../assets/bin/Plastic.png"),
    require("../assets/bin/Electronics.png"),
    require("../assets/bin/Glass.png"),
  ]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const userDetails = await getCombinedUserData();
        setUser(userDetails);
        setDisplayName(userDetails.username);
        setPhotoUrl(userDetails.profile_picture_url);
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [syncApp]);

  // Handle asset loading state
  if (!assets) {
    return <Text>Loading...</Text>; // Display loading while assets are being fetched
  }

  if (loading) {
    return <CustomLoader />;
  }

  const handleCategoryNavigation = (categoryName) => {
    navigation.navigate("Categories", {
      screen: "CategoriesItemScreen",
      params: { categoryName },
    });
  };

  const handleProfileNavigation = () => {
    navigation.navigate("Profile");
  };

  // Categories data with image paths
  const categories = [
    { id: 1, name: "Plastic", icon: assets[0] },
    { id: 6, name: "Electronics", icon: assets[1] },
    { id: 3, name: "Glass", icon: assets[2] },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <WelcomeHeader
          userName={displayName}
          profileUrl={photoUrl}
          onNotificationPress={handleProfileNavigation}
          onProfilePress={handleProfileNavigation}
        />
        <View style={styles.bottomLine} />

        {/* New Quote and Video Card Section */}
        <AnimatedBanner />

        {/* Category Section */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categorySectionTitle}>Categories</Text>
            {/* View More Button */}
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() =>
                navigation.navigate("Categories", { screen: "CategoriesMain" })
              }
            >
              <Text style={styles.viewMoreText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoryGridContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryItem}
                  onPress={() => handleCategoryNavigation(category.name)}
                >
                  <Image source={category.icon} style={styles.categoryIcon} />
                  <Text style={styles.categoryLabel}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <RecentlyAddedItems />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black", // Set background to black
    paddingHorizontal: width * 0.04, // 5% horizontal padding
    paddingTop: height * 0.03, // 3% top padding
    paddingBottom: height * 0.15, // 10% bottom padding
  },
  bottomLine: {
    height: 1,
    backgroundColor: "#27272a", // zinc-800
    width: "100%",
  },
  categorySection: {
    paddingHorizontal: width * 0.01,
    paddingVertical: height * 0.02,
    marginBottom: height * 0.01,
  },
  categorySectionTitle: {
    fontSize: width * 0.045,
    alignItems: "center",
    fontFamily: "NacelleBold",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: height * 0.02,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scrollContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryItem: {
    height: height * 0.18, // Adjust height dynamically
    width: width * 0.3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.01,
    marginHorizontal: width * 0.02,
    // iOS Shadow
    shadowColor: "#808080",
    shadowOffset: {
      width: 6, // Horizontal offset for right-side shadow
      height: 6, // Vertical offset for bottom-side shadow
    },
    shadowOpacity: 0.5, // Increase shadow opacity
    shadowRadius: 12, // Make the shadow softer
    // Android Shadow
    elevation: 10, // Adjust elevation for stronger shadow on Android
    overflow: "visible", // Ensure shadows aren't clipped
  },

  categoryIcon: {
    width: width * 0.15, // Dynamic width
    height: width * 0.15,
    resizeMode: "contain",
  },
  categoryLabel: {
    fontSize: width * 0.035,
    fontFamily: "NacelleSemiBold",
    fontWeight: "600",
    color: "#fff",
    marginTop: height * 0.01,
    textAlign: "center", // Center-align text for consistency
  },
  viewMoreButton: {
    flexDirection: "row",
  },
  viewMoreText: {
    fontSize: width * 0.035,
    fontFamily: "NacelleSemiBold",
    fontWeight: "600",
    color: "#FFFFFF",
    right: 4,
  },
});

export default HomeScreen;
