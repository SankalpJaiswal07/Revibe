import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { logout } from "../services/supabase";
import EditProfileModal from "../components/EditProfileModal";
import { useGlobalContext } from "../util/GlobalContext";
import { getCombinedUserData } from "../services/supabase";
import CustomLoader from "../components/CustomLoader";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState("");
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");

  const { notificationsEnabled, toggleNotifications } = useGlobalContext();

  useEffect(() => {
    const fetchUserDetails = async () => {
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
  }, [isEditModalVisible]);

  if (loading) {
    return <CustomLoader loadingText="Loading..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: photoUrl }} style={styles.avatar} />
        </View>
        <Text style={styles.username}>{displayName}</Text>

        <EditProfileModal
          visible={isEditModalVisible}
          onClose={() => {
            setIsEditModalVisible(false);
          }}
          currentUser={{
            name: displayName,
            profileImage: photoUrl,
          }}
          setProfileLoading={setLoading}
        />
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditModalVisible(true)}
        >
          <Text style={styles.editButtonText}>Edit profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Feather name="bell" size={20} color="#fff" />
            <Text style={styles.menuItemText}>Push notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#767577", true: "#34C759" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: Math.max(16, width * 0.04), // Scaled horizontal padding
    paddingVertical: Math.max(24, width * 0.06), // Scaled vertical padding
  },
  profileSection: {
    alignItems: "center",
    marginTop: Math.max(24, width * 0.06), // Scaled margin top
    marginBottom: Math.max(24, width * 0.06), // Scaled margin bottom
  },
  avatarContainer: {
    width: Math.max(100, width * 0.25), // Scaled avatar size
    height: Math.max(100, width * 0.25), // Scaled avatar size
    borderRadius: Math.max(50, width * 0.125), // Scaled border radius
    borderColor: "#4CAF50",
    borderWidth: 2,
    padding: Math.max(2, width * 0.005), // Scaled padding
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  username: {
    fontSize: Math.max(24, width * 0.06), // Scaled font size
    fontFamily: "NacelleBold",
    fontWeight: "700",
    color: "#fff",
    marginTop: Math.max(12, width * 0.03), // Scaled margin top
  },

  editButton: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: Math.max(20, width * 0.05), // Scaled padding
    paddingVertical: Math.max(8, width * 0.02), // Scaled padding
    borderRadius: 20,
    marginTop: Math.max(16, width * 0.04), // Scaled margin top
  },
  editButtonText: {
    color: "#fff",
    fontSize: Math.max(14, width * 0.04), // Scaled font size
    fontFamily: "NacelleSemiBold",
    fontWeight: "500",
  },
  section: {
    marginBottom: Math.max(24, width * 0.06), // Scaled margin bottom
  },
  sectionTitle: {
    fontSize: Math.max(14, width * 0.04), // Scaled font size
    fontFamily: "NacelleRegular",
    fontWeight: "400",
    color: "#666",
    marginBottom: Math.max(8, width * 0.02), // Scaled margin bottom
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1A1A1A",
    padding: Math.max(16, width * 0.04), // Scaled padding
    borderRadius: 12,
    marginBottom: Math.max(8, width * 0.02), // Scaled margin bottom
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    color: "#fff",
    fontSize: Math.max(16, width * 0.04), // Scaled font size
    fontFamily: "NacelleRegular",
    fontWeight: "400",
    marginLeft: Math.max(12, width * 0.03), // Scaled margin left
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: Math.max(8, width * 0.02), // Scaled margin right
  },
  badgeText: {
    color: "#fff",
    fontSize: Math.max(12, width * 0.03), // Scaled font size
    fontFamily: "NacelleBold",
    fontWeight: "700",
  },
  logoutButton: {
    padding: Math.max(16, width * 0.04), // Scaled padding
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
  },
  logoutText: {
    color: "#FF3B30",
    fontSize: Math.max(16, width * 0.04), // Scaled font size
    fontFamily: "NacelleRegular",
    fontWeight: "400",
    textAlign: "center",
  },
});

export default ProfileScreen;
