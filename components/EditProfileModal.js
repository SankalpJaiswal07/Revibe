import React, { useState } from "react";
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
import { useGlobalContext } from "../util/GlobalContext";
import CustomLoader from "./CustomLoader";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

const EditProfileModal = ({
  visible,
  onClose,
  currentUser,
  setProfileLoading,
}) => {
  const { updatePassword, updateProfilePicture, updateUsername, getSyncApp } =
    useGlobalContext();

  const [name, setName] = useState(currentUser?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(
    currentUser?.profileImage || null
  );
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      // Request permissions
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
        quality: 0.5,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (name !== currentUser?.name) {
        const res = await updateUsername(name);
      }

      if (profileImage !== currentUser?.profileImage) {
        await updateProfilePicture(profileImage);
      }

      if (newPassword && currentPassword) {
        if (currentPassword === newPassword) {
          Alert.alert(
            "Invalid Password Change",
            "Your new password cannot be the same as your current password. Please choose a different password."
          );
        }

        if (newPassword !== confirmPassword) {
          Alert.alert("Error", "New passwords do not match");
          return;
        }
        await updatePassword(currentPassword, newPassword);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
      console.error(error);
    } finally {
      setIsLoading(false);
      getSyncApp();
    }
  };

  const LoadingOverlay = () => {
    return (
      <Modal transparent={true} animationType="fade" visible={isLoading}>
        <View style={styles.overlay}>
          <BlurView
            style={styles.blurView}
            intensity={20}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
          >
            <CustomLoader
              loadingText="Updating your profile..."
              containerStyle={{ backgroundColor: "" }}
            />
          </BlurView>
        </View>
      </Modal>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          {isLoading && <LoadingOverlay />}

          <ScrollView style={styles.scrollView}>
            <View style={styles.imageSection}>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.imageContainer}
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
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
              <Text style={styles.changePhotoText}>Change Profile Photo</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.passwordSection}>
              <Text style={styles.sectionTitle}>Change Password</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder="Enter current password"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>New Password</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="Enter new password"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm New Password</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="Confirm new password"
                  placeholderTextColor="#666"
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  blurView: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#000",
    marginTop: Math.max(40, width * 0.1), // Scaled margin top
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Math.max(16, width * 0.04), // Scaled padding
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: Math.max(18, width * 0.05), // Scaled font size
    fontFamily: "NacelleBold",
    fontWeight: "700",
    color: "#fff",
  },
  saveButton: {
    paddingHorizontal: Math.max(12, width * 0.03), // Scaled padding
    paddingVertical: Math.max(6, width * 0.015), // Scaled padding
    backgroundColor: "#4CAF50",
    borderRadius: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: Math.max(14, width * 0.04), // Scaled font size
    fontFamily: "NacelleMedium",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    alignItems: "center",
    paddingVertical: Math.max(24, width * 0.06), // Scaled padding
  },
  imageContainer: {
    width: Math.max(100, width * 0.25), // Scaled image size
    height: Math.max(100, width * 0.25), // Scaled image size
    borderRadius: Math.max(50, width * 0.125), // Scaled border radius
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  editImageBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    width: Math.max(24, width * 0.06), // Scaled badge size
    height: Math.max(24, width * 0.06), // Scaled badge size
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  changePhotoText: {
    color: "#4CAF50",
    fontSize: Math.max(14, width * 0.04), // Scaled font size
    marginTop: Math.max(12, width * 0.03), // Scaled margin top
    fontFamily: "NacelleRegular",
    fontWeight: "400",
  },
  inputContainer: {
    padding: Math.max(16, width * 0.04), // Scaled padding
  },
  inputLabel: {
    color: "#666",
    fontSize: Math.max(14, width * 0.04), // Scaled font size
    marginBottom: Math.max(8, width * 0.02), // Scaled margin bottom
  },
  input: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: Math.max(16, width * 0.04), // Scaled padding
    color: "#fff",
    fontSize: Math.max(16, width * 0.04), // Scaled font size
    fontFamily: "NacelleRegular",
    fontWeight: "400",
  },
  passwordSection: {
    marginTop: Math.max(16, width * 0.04), // Scaled margin top
  },
  sectionTitle: {
    color: "#fff",
    fontSize: Math.max(18, width * 0.05), // Scaled font size
    fontFamily: "NacelleBold",
    fontWeight: "700",
    paddingHorizontal: Math.max(16, width * 0.04), // Scaled padding
    marginBottom: Math.max(8, width * 0.02), // Scaled margin bottom
  },
});

export default EditProfileModal;
