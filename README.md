# Revibe - Smart Recycling App

Revibe is a modern recycling app that helps users analyze items using AI and provides clear instructions on how to recycle or reuse them. The app aims to make recycling effortless and promote sustainability by giving users smart suggestions for waste management.

## 🚀 Features

- **AI-powered Image Analysis**: Identify items and receive detailed recycling or reuse instructions.
- **Offline Storage with SQLite**: Save analyzed items for later use.
- **Categorized Recycling Bins**: Items are sorted into appropriate bins for easy management.
- **Animated UI/UX**: Modern animations for a seamless experience.
- **User Authentication**: Secure login and profile setup with Firebase.
- **Push Notifications**: Timely reminders and recycling tips throughout the day.
- **Onboarding Screens**: Interactive introduction to the app features.

## 📸 How It Works

1. Take a photo or upload an image of an item.
2. The AI analyzes the item and provides recycling instructions.
3. Save the analysis for future reference or discard it.
4. View saved items categorized by their recycling bin.

## 📱 Screenshots



## 🛠 Technologies Used

- **React Native (Expo)**: Frontend framework.
- **supabase**: User authentication and cloud functions.
- **SQLite**: Local database storage for offline mode.
- **Google Vision API**: Image recognition.
- **GPT**: AI-generated recycling instructions.
- **React Navigation**: Smooth navigation experience.
- **React Native Reanimated**: Modern animations.

## 🔧 Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/YOUR_GITHUB_USERNAME/revibe.git
   ```
2. Navigate to the project folder:
   ```sh
   cd revibe
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the Expo development server:
   ```sh
   expo start
   ```

## 🌎 Deployment

To build the app for Android:

```sh
expo build:android
```

For iOS (Mac required):

```sh
expo build:ios
```

## 🔑 Environment Variables

Create a `.env` file in the root directory and add:

```
EXPO_PUBLIC_SUPABASE_API_KEY=your_supabase_api_key
EXPO_PUBLIC_GPT_API_KEY=your_gpt_api_key
EXPO_PUBLIC_GOOGLE_VISION_API_KEY=your_google_vision_api_key
```

## 📢 Notifications

Revibe sends **7-10 daily notifications** with recycling tips and reminders. You can enable/disable them in settings.

## 📄 License

This project is licensed under the MIT License.

## 📩 Contact

For feedback or suggestions, reach out at [**sankalpj598@gmail.com**](mailto\:sankalpj598@gmail.com).

---

🚀 **Revibe – Recycle Smart, Live Green!** 🌱

