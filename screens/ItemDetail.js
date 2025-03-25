import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useGlobalContext } from "../util/GlobalContext";
import { Image } from "expo-image";
import { addItem, deleteItem } from "../util/store";
import OutlineButton from "../components/UI/OutlineButton";
import { fetchItemById } from "../util/store";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/Loading";
import { BlurView } from "expo-blur";
import BackButton from "../components/UI/BackButton";
import CustomLoader from "../components/CustomLoader";

const { width } = Dimensions.get("window");

const ItemDetailScreen = ({ route }) => {
  const { params } = route;
  const result = params.result || null;
  const imageUri = params.imageUri || null;
  const isViewingItem = params.isViewingItem || false;
  const itemId = params.itemId || null;
  const id = params.id || null;

  const [items, setItems] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false); // Add state for save loading
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { fetchRecentItemById, isDummyData } = useGlobalContext();

  const handleBack = () => {
    if (navigation.canGoBack) navigation.goBack();
  };

  useEffect(() => {
    const loadItems = async () => {
      if (!isViewingItem) {
        setItems(result); // Set directly if viewing item from props
        setIsLoading(false);
        return;
      }

      if (id) {
        const res = fetchRecentItemById(id);
        setItems(res);
        setIsLoading(false);
        return;
      }

      if (itemId) {
        try {
          const res = await fetchItemById(itemId);
          if (res) {
            setItems(res);
          } else {
            setError("Item not found");
          }
        } catch (err) {
          console.error("Failed to load items:", err);
          setError(err.message || "An error occurred while fetching the item.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadItems();
  }, [isViewingItem, itemId, result]);

  if (isLoading) {
    return <CustomLoader loadingText="Loading..." />;
  }

  if (error || !items) {
    return (
      <View style={styles.container}>
        <BackButton onBackPress={handleBack} title={"Item"} />
        <Text style={styles.errorText}>
          {error || "Item data is unavailable."}
        </Text>
      </View>
    );
  }

  // Define bin category colors
  const binCategoryColors = {
    plastic: "#FFA500",
    organic: "#228B22",
    paper: "#1E90FF",
    glass: "#FFFF00",
    metal: "#808080",
    electronics: "#FF0000",
    others: "#FFDAB9",
  };

  // Function to get background color based on category
  const getCategoryColor = (category) => {
    return binCategoryColors[category.toLowerCase()] || "#f0f2f4"; // default color if category not found
  };

  const handleSaveItem = async () => {
    setSaveLoading(true); // Show loading

    // Get the current date and time if not provided
    const currentDate = new Date().toISOString().split("T")[0]; // Format: 'YYYY-MM-DD'
    const currentTime = new Date().toTimeString().split(" ")[0];

    try {
      const itemToSave = {
        binCategory: items.binCategory,
        descriptionTitle: items.descriptionTitle,
        description: items.description,
        recycleIdeaOrReuseIdea: items.recycleIdeaOrReuseIdea
          .map((idea) => ` ${idea.title}: ${idea.description}`)
          .join("; "),
        imageUri: imageUri,
        createdDate: currentDate,
        createdTime: currentTime,
      };

      await addItem(itemToSave);

      setTimeout(() => {
        setSaveLoading(false);
        navigation.navigate("MainTabs"); // Navigate to home
      }, 6000); // Simulate save duration
    } catch (error) {
      setSaveLoading(false);
      Alert.alert(
        "Save Failed",
        "There was an error saving the item. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  async function handleDeleteItem() {
    setIsLoading(true);
    try {
      if (itemId) await deleteItem(itemId);
      setTimeout(() => {
        setSaveLoading(false);
        navigation.navigate("MainTabs");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  }

  const LoadingOverlay = ({ visible, children }) => (
    <SafeAreaView style={styles.overlay}>
      <Modal transparent={true} animationType="fade" visible={visible}>
        <View style={styles.overlay}>
          <BlurView
            style={styles.blurView}
            intensity={75}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
          >
            {children}
          </BlurView>
        </View>
      </Modal>
    </SafeAreaView>
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <BackButton
          onBackPress={handleBack}
          title={
            items.descriptionTitle.charAt(0).toUpperCase() +
            items.descriptionTitle.slice(1)
          }
        />
        <ScrollView style={styles.scrollViewContainer}>
          {/* Item Image */}
          <LoadingOverlay visible={saveLoading}>
            <Loading source={"saving"} text={"Saving..."} />
          </LoadingOverlay>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri ? imageUri : items.imageUri }}
              style={styles.image}
              contentFit="cover"
            />
          </View>
          {/* Item Name */}
          <Text style={styles.itemName}>
            {items.descriptionTitle.charAt(0).toUpperCase() +
              items.descriptionTitle.slice(1)}
          </Text>
          <View style={styles.categories}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(items.binCategory) },
              ]}
            >
              <Text style={styles.categoryText}>{items.binCategory}</Text>
            </View>
          </View>
          {/* Description */}
          <Text style={styles.description}>{items.description}</Text>
          {/* Reuse Ideas */}
          <Text style={styles.subtitle}>Reuse Ideas</Text>
          {items.recycleIdeaOrReuseIdea.map((idea, index) => (
            <View key={index} style={styles.ideaCard}>
              <Text style={styles.ideaTitle}>{idea.title}</Text>
              <Text style={styles.ideaDescription}>{idea.description}</Text>
            </View>
          ))}
          {/* Save Button */}
          {!isViewingItem && (
            <View style={styles.saveButton}>
              <OutlineButton
                onPress={handleSaveItem}
                icon={"save-alt"}
                bgcolor={"#064E3B"}
                color={"#fff"}
              >
                Save
              </OutlineButton>
            </View>
          )}
          {!isDummyData && isViewingItem && (
            <View style={styles.saveButton}>
              <OutlineButton
                onPress={handleDeleteItem}
                icon={"delete"}
                bgcolor={"#D32F2F"}
                color={"#fff"}
              >
                Delete
              </OutlineButton>
            </View>
          )}
          <View style={styles.bottomspace} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ItemDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollViewContainer: {
    paddingTop: Math.max(10, width * 0.03), // Scaled padding top
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Cover the entire screen
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  blurView: {
    ...StyleSheet.absoluteFillObject, // Ensures blur covers the screen
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: Math.max(50, width * 0.1), // Scaled margin top
    fontSize: Math.max(18, width * 0.05), // Scaled font size
    fontFamily: "NacelleRegular",
    fontWeight: "400",
  },
  imageContainer: {
    paddingHorizontal: Math.max(15, width * 0.04), // Scaled horizontal padding
  },
  image: {
    width: "100%",
    height: Math.max(230, width * 0.55), // Scaled image height
    borderRadius: 12,
  },
  itemName: {
    fontSize: Math.max(22, width * 0.06), // Scaled font size
    fontFamily: "NacelleBold",
    fontWeight: "700",
    color: "#fff",
    paddingHorizontal: Math.max(16, width * 0.04), // Scaled padding
    paddingTop: Math.max(16, width * 0.04), // Scaled padding
    paddingBottom: Math.max(8, width * 0.02), // Scaled padding
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Math.max(8, width * 0.02), // Scaled gap
    paddingHorizontal: Math.max(16, width * 0.04), // Scaled padding
    paddingVertical: Math.max(8, width * 0.02), // Scaled padding
  },
  categoryBadge: {
    backgroundColor: "#f0f2f4",
    borderRadius: 20,
    paddingVertical: Math.max(4, width * 0.01), // Scaled padding
    paddingHorizontal: Math.max(12, width * 0.03), // Scaled padding
  },
  categoryText: {
    fontSize: Math.max(14, width * 0.04), // Scaled font size
    fontFamily: "NacelleSemiBold",
    fontWeight: "600",
    color: "#111418",
  },
  description: {
    fontSize: Math.max(16, width * 0.045), // Scaled font size
    fontFamily: "NacelleRegular",
    fontWeight: "400",
    color: "#fff",
    paddingHorizontal: Math.max(16, width * 0.04), // Scaled padding
    paddingVertical: Math.max(8, width * 0.02), // Scaled padding
  },
  subtitle: {
    fontSize: Math.max(22, width * 0.06), // Scaled font size
    fontFamily: "NacelleBold",
    fontWeight: "700",
    color: "#fff",
    paddingHorizontal: Math.max(16, width * 0.04), // Scaled padding
    paddingVertical: Math.max(8, width * 0.02), // Scaled padding
  },
  ideaCard: {
    borderWidth: 1,
    borderColor: "#ffffff",
    padding: Math.max(16, width * 0.04), // Scaled padding
    marginHorizontal: Math.max(16, width * 0.04), // Scaled margin
    marginVertical: Math.max(8, width * 0.02), // Scaled margin
    borderRadius: 12,
    elevation: 2,
  },
  ideaTitle: {
    fontSize: Math.max(16, width * 0.045), // Scaled font size
    fontFamily: "NacelleSemiBold",
    fontWeight: "600",
    color: "#fff",
    marginBottom: Math.max(4, width * 0.01), // Scaled margin bottom
  },
  ideaDescription: {
    fontSize: Math.max(14, width * 0.04), // Scaled font size
    fontFamily: "NacelleRegular",
    fontWeight: "400",
    color: "#fff",
  },
  saveButton: {
    marginBottom: Math.max(50, width * 0.1), // Scaled margin bottom
  },
  bottomspace: {
    marginBottom: Math.max(50, width * 0.1),
  },
});
