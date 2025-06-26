import React, { useState } from "react";
import {
  View,
  Alert,
  StyleSheet,
  ScrollView,
  Text,
  Modal,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import {
  analyzeImageWithVision,
  analyzeImageWithAI21,
} from "../services/gptAPI";
import IllustrationViewer from "../components/UI/IllustrationViewer";
import OutlineButton from "../components/UI/OutlineButton";
import DidYouKnow from "../components/UI/DidYouKnow";
import { BlurView } from "expo-blur";
import Loading from "../components/Loading";
const { width, height } = Dimensions.get("window");

const RecycleItemScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const prompt = `
  Analyze the following vision result data and provide:
  
  1. A single-word title describing the item (descriptionTitle). 
  2. A detailed description of the item (description).
  3. Creative reuse or recycling ideas for this item (recycleIdeaOrReuseIdea).
  4. The recycling bin category this item belongs to (binCategory).
  
  Important rules:
  - The descriptionTitle must be a **single word**.
  - The binCategory must be one of the following: "Organic", "Plastic", "Paper", "Glass", "Metal", or "Electronics". 
    - If the category doesn't match any of these, assign it as "Others".
  
  Please return only the instructions, reuse ideas, and bin category in your response, without any extra information.
  
  Format the response as a proper JSON object like this:
  {
    "descriptionTitle": "single-word title",
    "description": "detailed description of the item",
    "recycleIdeaOrReuseIdea": [
      {
        "title": "creative reuse or recycling idea title", 
        "description": "detailed description of the reuse or recycling idea"
      },
      {
        "title": "another reuse or recycling idea title", 
        "description": "detailed description of another reuse or recycling idea"
      }
    ],
    "binCategory": "category name"
  }
  
  Ensure that the response is **formatted as JSON** and does not include any extra text, such as quotation marks or markdown syntax.
  `;
  // Function to handle image selection
  const handleImageSelection = () => {
    // Request permissions for both camera and media library
    ImagePicker.requestCameraPermissionsAsync().then((cameraPermission) => {
      ImagePicker.requestMediaLibraryPermissionsAsync().then(
        (mediaLibraryPermission) => {
          if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
            Alert.alert(
              "Permission Denied",
              "You need to grant camera and media library permissions."
            );
            return;
          }

          console.log("Permissions granted for camera and media library.");
        }
      );
    });
  };

  // Function to open camera
  const openCamera = async () => {
    const cameraResult = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.back,
      allowsEditing: true,
      quality: 1,
    });

    if (!cameraResult.canceled) {
      const imageUri = cameraResult.assets[0].uri;
      analyzeImage(imageUri);
    } else {
      console.log("Camera usage was cancelled.");
    }
  };

  // Function to open gallery
  const openGallery = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const imageUri = pickerResult.assets[0].uri; // Ensure you're accessing uri from assets array
      analyzeImage(imageUri);
    } else {
      console.log("Image picking was cancelled.");
    }
  };

  const convertImageToBase64 = async (uri) => {
    if (!uri || typeof uri !== "string") {
      throw new Error("Invalid URI provided for Base64 conversion.");
    }

    const manipulatedImage = await ImageManipulator.manipulateAsync(uri, [], {
      base64: true,
    });

    if (!manipulatedImage.base64) {
      throw new Error("Failed to convert image to Base64.");
    }

    return manipulatedImage.base64;
  };

  const analyzeImage = async (imageUri) => {
    if (!imageUri || typeof imageUri !== "string") {
      Alert.alert("Invalid Image", "Please select a valid image.");
      return;
    }

    setLoading(true);
    setSelectedImage(imageUri);

    try {
      //step1:Call Vision API for image analysis
      const base64Image = await convertImageToBase64(imageUri);
      const visionData = await analyzeImageWithVision(base64Image);

      // Step 2: Validate visionData structure and extract labels
      let visionLabels = "";

      if (
        visionData &&
        visionData.labelAnnotations &&
        Array.isArray(visionData.labelAnnotations)
      ) {
        if (visionData.labelAnnotations.length > 0) {
          visionLabels = visionData.labelAnnotations
            .map((label) => label?.description || "")
            .filter((description) => description.trim() !== "")
            .join(", ");
        } else {
          // No labels found - image might be unclear
          Alert.alert(
            "Image Not Clear",
            "We couldn't identify any objects in your image. Please upload a clearer picture or try again."
          );
          return;
        }
      } else {
        // Vision API failed or returned invalid data
        Alert.alert(
          "Analysis Failed",
          "Unable to process your image. Please upload a clearer picture or try again later."
        );
        return;
      }

      // Step 3: Send Vision API result to GPT API for further analysis

      const gptResult = await analyzeImageWithAI21(
        imageUri,
        visionLabels,
        prompt
      );

      // Step 4: Navigate to ItemDetail screen with image and result
      navigation.navigate("ItemDetail", { imageUri, result: gptResult });
    } catch (error) {
      console.error("Image analysis error:", error);

      // User-friendly error messages
      let errorTitle = "Analysis Failed";
      let errorMessage =
        "Something went wrong. Please upload a clearer picture or try again later.";

      if (
        error.message?.includes("network") ||
        error.message?.includes("fetch")
      ) {
        errorMessage =
          "Connection problem. Please check your internet and try again.";
      } else if (
        error.message?.includes("base64") ||
        error.message?.includes("convert")
      ) {
        errorMessage =
          "Unable to process your image. Please try uploading a different photo.";
      } else if (error.message?.toLowerCase().includes("map")) {
        errorTitle = "Image Not Clear";
        errorMessage =
          "We couldn't analyze your image properly. Please upload a clearer picture or try again later.";
      }

      Alert.alert(errorTitle, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <Modal transparent={true} animationType="fade" visible={loading}>
          <BlurView
            style={styles.overlay}
            intensity={75}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
          >
            <Loading source={"loading"} text={"Analyzing Image..."} />
          </BlurView>
        </Modal>
      )}
      <ScrollView style={styles.container}>
        <IllustrationViewer />
        <View style={styles.HeaderContainer}>
          <Text style={styles.HeaderTitle}>
            Recycle Your Items, One Click Away!
          </Text>
          <Text style={styles.HeaderSubtitle}>
            Take a photo or choose from your gallery to start recycling.
          </Text>
        </View>

        <View style={styles.ButtonContainer}>
          <OutlineButton
            icon={"camera-alt"}
            color={"#fff"}
            onPress={openCamera}
            bgcolor={"#064E3B"}
          >
            Use Camera
          </OutlineButton>
          <OutlineButton
            icon={"photo-library"}
            color={"#fff"}
            onPress={openGallery}
            bgcolor={"#064E3B"}
          >
            Choose from Gallery
          </OutlineButton>
        </View>
        <DidYouKnow />
        <View style={styles.bottomspace} />
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.04, // 4% of screen width for horizontal padding
    paddingTop: height * 0.05,
    backgroundColor: "black",
  },
  HeaderContainer: {
    marginTop: height * 0.01,
    alignItems: "center",
    justifyContent: "center",
  },
  HeaderTitle: {
    textAlign: "center",
    color: "#fff",
    fontSize: width * 0.055,
    fontWeight: "bold",
    fontFamily: "NacelleBold",
  },
  HeaderSubtitle: {
    marginTop: height * 0.005,
    fontSize: width * 0.04,
    textAlign: "center",
    color: "#fff",
    fontWeight: "500",
    fontFamily: "NacelleRegular",
  },
  ButtonContainer: {
    marginTop: height * 0.015,
    gap: height * 0.005,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.59)",
  },
  bottomspace: {
    marginBottom: height * 0.1,
  },
});

export default RecycleItemScreen;
