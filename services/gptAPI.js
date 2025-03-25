import axios from "axios";

const VISION_API_URL = process.env.EXPO_PUBLIC_VISION_API_URL;
const GOOGLE_VISION_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY;

export const analyzeImageWithVision = async (base64Image) => {
  try {
    const response = await axios.post(
      `${VISION_API_URL}?key=${GOOGLE_VISION_API_KEY}`,
      {
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: "LABEL_DETECTION", maxResults: 5 }], // Add other features as needed
          },
        ],
      }
    );
    return response.data.responses[0];
  } catch (error) {
    console.error(
      "Error with Vision API:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const analyzeImageWithAI21 = async (imageUri, visionLabels, prompt) => {
  const ai21ApiUrl = process.env.EXPO_PUBLIC_AI21_API_URL;
  const ai21ApiKey = process.env.EXPO_PUBLIC_AI21_API_Key;

  // Combine the vision labels with the provided prompt
  const completePrompt = `${prompt}\n\nVision Result: ${visionLabels}`;

  try {
    const response = await axios.post(
      ai21ApiUrl,
      {
        model: "jamba-1.5-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant and providing idea for reuse items.",
          },
          {
            role: "user",
            content: completePrompt, // User's input with vision results
          },
        ],
        maxTokens: 200,
        temperature: 0.7,
        topP: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${ai21ApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    const result = JSON.parse(response.data.choices[0].message.content);

    return result;
  } catch (error) {
    // Handle errors and log for debugging
    console.error("Error calling AI21 API:", error.response || error.message);
    return null; // Return null if the request fails
  }
};
