import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { fetchItemsByCategory } from "../util/store";
import BackButton from "../components/UI/BackButton";
import CustomLoader from "../components/CustomLoader";
import { useGlobalContext } from "../util/GlobalContext";

const { width } = Dimensions.get("window");

const CategoriesItemScreen = ({ route }) => {
  const navigation = useNavigation();
  const { categoryName } = route.params; // Receive category name via route params
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDummyData, fetchRecentItemsByBinCategory } = useGlobalContext();

  const handleBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Categories", params: { screen: "CategoriesMain" } }],
    });
  };

  const handleCardPress = (id) => {
    isDummyData
      ? navigation.navigate("ItemDetail", {
          id: id,
          isViewingItem: true,
        })
      : navigation.navigate("ItemDetail", {
          itemId: id,
          isViewingItem: true,
        });
  };

  useEffect(() => {
    navigation.setOptions(
      {
        tabBar: null,
      },
      [navigation]
    );

    const loadItems = async () => {
      try {
        // Fetch items
        if (isDummyData) {
          const res = fetchRecentItemsByBinCategory(categoryName);
          setItems(res);
          setIsLoading(false);
          return;
        }
        const res = await fetchItemsByCategory(categoryName);
        setItems(res);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load items:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    loadItems();
  }, [navigation, categoryName]);

  const renderItem = ({ item }) => (
    <View style={styles.itemOuterContainer}>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleCardPress(item.id)}
      >
        <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
        <View style={styles.textContainer}>
          <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
            {item.descriptionTitle.split(" ").slice(0, 2).join(" ")}
          </Text>
          <MaterialIcons name="arrow-right-alt" size={24} color="#ccc" />
        </View>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return <CustomLoader loadingText="Loading..." />;
  }

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <BackButton onBackPress={handleBack} title={categoryName} />
        <View style={styles.noItemContainer}>
          <Text style={styles.noItem}>
            No items added yet. Start adding items to organize and manage them
            here!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton onBackPress={handleBack} title={categoryName} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={{ marginTop: 10, paddingHorizontal: 10 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: Math.max(8, width * 0.02), // Scaled horizontal padding
    paddingVertical: Math.max(10, width * 0.03), // Scaled vertical padding
  },
  noItemContainer: {
    flex: 1,
    backgroundColor: "black",
    alignContent: "center",
    justifyContent: "center",
  },
  itemOuterContainer: {
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: Math.max(8, width * 0.02), // Scaled margin
    padding: Math.max(8, width * 0.03), // Scaled padding
    borderRadius: 8,
    borderCurve: "continuous",
  },
  itemImage: {
    width: Math.max(80, width * 0.25), // Scaled width
    height: Math.max(64, width * 0.2), // Scaled height
    borderRadius: 10,
    marginRight: Math.max(8, width * 0.02), // Scaled margin
    objectFit: "cover",
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  noItem: {
    textAlign: "center",
    justifyContent: "center",
    color: "#fff",
    fontFamily: "NacelleBold",
    fontWeight: "700",
    fontSize: Math.max(14, width * 0.04), // Scaled font size
  },
  itemName: {
    left: Math.max(8, width * 0.02), // Scaled left margin
    fontSize: Math.max(14, width * 0.04), // Scaled font size
    fontFamily: "NacelleBold",
    fontWeight: "700",
    color: "#fff",
    overflow: "hidden",
  },
});

export default CategoriesItemScreen;
