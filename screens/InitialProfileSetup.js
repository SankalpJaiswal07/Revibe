import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { supabase, getUserAuthDetails } from "../services/supabase";
import { Asset } from "expo-asset";
import CustomLoader from "../components/CustomLoader";
import { useGlobalContext } from "../util/GlobalContext";

const { width } = Dimensions.get("window");

const InitialProfileSetup = () => {
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { profileSetupRequired, updateProfileSetupRequired } =
    useGlobalContext();

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user]);

  useEffect(() => {
    preloadAvatars().then(() => setAvatarsLoaded(true));
  }, []);

  const getUser = async () => {
    try {
      const user = await getUserAuthDetails();
      setUser(user);
    } catch (error) {
      console.log("Error Fetching user", error);
    }
  };

  const preloadAvatars = async () => {
    const promises = avatarOptions.map((avatar) => Image.prefetch(avatar.url));
    await Promise.all(promises);
  };

  const avatarOptions = [
    { id: 1, url: "https://i.ibb.co/1b94kty/profile1.png" },
    { id: 2, url: "https://i.ibb.co/pPZ7jvp/profile3.png" },
    { id: 3, url: "https://i.ibb.co/jzTKRt1/profile4.png" },
    { id: 4, url: "https://i.ibb.co/7RsJ0QV/profile2.png" },
  ];

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to access your photos"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setSelectedAvatar(null); // Clear selected avatar when image is picked
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleAvatarSelect = async (avatar) => {
    const asset = Asset.fromModule(avatar);
    await asset.downloadAsync();

    const avatarUrl = asset.localUri;
    setSelectedAvatar(avatarUrl);
    setSelectedImage(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Profile name required", "Please enter your name");
      return;
    }

    if (!selectedImage && !selectedAvatar) {
      Alert.alert(
        "Profile picture required",
        "Please select an avatar or choose from gallery"
      );
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const imageUri = selectedImage || selectedAvatar;

      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: "base64",
      });

      const filePath = `${user.id}/${new Date().getTime()}.${
        imageUri.type === "image" ? "png" : "jpg"
      }`;

      const contentType =
        imageUri.type === "image" ? "image/png" : "image/jpeg";
      await supabase.storage
        .from("avatars")
        .upload(filePath, decode(base64), { contentType });

      // Construct the public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const profilePictureUrl = publicUrlData.publicUrl;

      // Insert user data into the `users` table
      const { error: insertError } = await supabase.from("users").insert({
        id: user.id, // Foreign key relation
        username: name.trim(),
        profile_picture_url: profilePictureUrl,
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error("Error inserting user data:", insertError.message);
        Alert.alert("Error", "Unable to save user data. Please try again.");
        return;
      }
      updateProfileSetupRequired(false);
      navigation.navigate("MainTabs");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <CustomLoader loadingText="All done! Preparing your dashboard..." />;
  }

  return (
    <Modal
      visible={profileSetupRequired}
      animationType="slide"
      transparent={false}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>Set Up Your Profile</Text>

            <View style={styles.imageSection}>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.imageContainer}
              >
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.profileImage}
                  />
                ) : selectedAvatar ? (
                  <Image
                    source={{ uri: selectedAvatar }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Feather name="camera" size={32} color="#666" />
                  </View>
                )}
                <View style={styles.editImageBadge}>
                  <Feather name="edit-2" size={12} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={styles.uploadText}>Upload Profile Photo</Text>
            </View>

            <View style={styles.avatarSection}>
              <Text style={styles.sectionTitle}>Or Choose an Avatar</Text>
              <View style={styles.avatarOptions}>
                {avatarOptions.map((avatar) => (
                  <TouchableOpacity
                    key={avatar.id}
                    style={[
                      styles.avatarOption,
                      selectedAvatar?.id === avatar.id &&
                        styles.selectedAvatarOption,
                    ]}
                    onPress={() => handleAvatarSelect(avatar.url)}
                  >
                    <Image
                      source={{ uri: avatar.url }}
                      style={styles.avatarImage}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Your Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#666"
                autoCapitalize="words"
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  title: {
    fontSize: width * 0.065, // Responsive font size
    fontFamily: "NacelleBlack",
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 32,
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  imageContainer: {
    width: width * 0.3, // Responsive width based on screen size
    height: width * 0.3, // Make it a circle
    borderRadius: width * 0.15, // Half of the width/height to make it circular
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: width * 0.15, // Make it circular
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: width * 0.15,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  editImageBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
  },
  uploadText: {
    color: "#4CAF50",
    fontSize: width * 0.035, // Responsive font size
    marginTop: 12,
    fontFamily: "NacelleRegular",
    fontWeight: "400",
  },
  avatarSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: width * 0.045, // Responsive font size
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "NacelleRegular",
    fontWeight: "400",
  },
  avatarOptions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  avatarOption: {
    width: width * 0.2, // Responsive width
    height: width * 0.2, // Responsive height
    borderRadius: width * 0.1, // Circular shape
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedAvatarOption: {
    borderColor: "#4CAF50",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: width * 0.1, // Circular shape
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    color: "#666",
    fontSize: width * 0.04, // Responsive font size
    marginBottom: 8,
    fontFamily: "NacelleRegular",
    fontWeight: "400",
  },
  input: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: width * 0.045, // Responsive font size
    fontFamily: "NacelleRegular",
    fontWeight: "400",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: width * 0.045, // Responsive font size
    fontFamily: "NacelleBold",
    fontWeight: "700",
  },
});

export default InitialProfileSetup;
