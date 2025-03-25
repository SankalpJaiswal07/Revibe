import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { fetchRecentItems } from "../../util/store";
import { useNavigation } from "@react-navigation/native";
import { useGlobalContext } from "../../util/GlobalContext";

// Reusable Touchable Card Component
const Card = ({ imageUri, itemName, timeAdded, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: imageUri }} style={styles.image} />
    <Text style={styles.itemName}>{itemName}</Text>
    <Text style={styles.timeAdded}>{timeAdded}</Text>
  </TouchableOpacity>
);

const RecentlyAddedItems = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]); // State to store fetched items
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to store any errors
  const { dummyData, isDummyData, setIsDummyData } = useGlobalContext();

  useEffect(() => {
    const loadRecentItems = async () => {
      try {
        const recentItems = await fetchRecentItems(5);
        if (recentItems.length) {
          setItems(recentItems);
          setIsDummyData(false);
        } else {
          setItems(dummyData);
          setIsDummyData(true);
        }
      } catch (error) {
        console.error("Failed to load recent items:", error);
        setError(error.message);
        setItems(dummyData); // Fallback to dummy data in case of an error
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentItems();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

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

  function getTimeAdded(createdDate, createdTime) {
    // Combine the date and time into a single Date object
    const createdDateTime = new Date(`${createdDate}T${createdTime}`);

    // Check if the date is invalid
    if (isNaN(createdDateTime.getTime())) {
      return "Invalid date";
    }

    const now = new Date();
    const diffInMs = now - createdDateTime;

    // Calculate differences in minutes, hours, and days
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    // If created within the last 60 minutes, return minutes ago
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    // If created within the last 24 hours, return hours ago
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);

    // If created more than a day ago, return days ago
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recently Added Items</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {items.map((item, index) =>
          isDummyData ? (
            <Card
              key={index}
              imageUri={item.imageUri}
              itemName={item.descriptionTitle}
              timeAdded={item.timeAdded}
              onPress={() => handleCardPress(item.id)} // Handle press event
            />
          ) : (
            <Card
              key={index}
              imageUri={item.imageUri}
              itemName={item.descriptionTitle}
              timeAdded={getTimeAdded(item.createdDate, item.createdTime)}
              onPress={() => handleCardPress(item.id)} // Handle press event
            />
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "NacelleBold",
    marginBottom: 10,
    color: "#fff",
  },
  scrollView: {
    flexDirection: "row",
  },
  card: {
    width: 200,
    left: 15,
    marginRight: 30,
    padding: 5,
    alignItems: "center",
  },
  image: {
    width: 220,
    height: 180,
    objectFit: "cover",
    borderRadius: 20,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    fontFamily: "NacelleSemiBold",
    marginBottom: 5,
  },
  timeAdded: {
    fontSize: 12,
    color: "#888",
    fontFamily: "Nacelle-Light",
    fontWeight: "300",
  },
});

export default RecentlyAddedItems;
