import React, { useState, useEffect, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GlobalProvider, useGlobalContext } from "./util/GlobalContext";
import { supabase } from "./services/supabase";
import { useFonts } from "expo-font";

import AuthStackNavigator from "./navigation/AuthStackNavigator";
import * as NavigationBar from "expo-navigation-bar";
import RootNavigator from "./navigation/RootNavigator";
import CustomLoader from "./components/CustomLoader";

import { initializeNotifications } from "./services/notification";

initializeNotifications();
SplashScreen.preventAutoHideAsync();
NavigationBar.setBackgroundColorAsync("rgb(0, 0, 0)");

const AppContent = () => {
  const [fontsLoaded] = useFonts({
    NacelleSemiBold: require("./assets/fonts/Nacelle-SemiBold.otf"),
    NacelleRegular: require("./assets/fonts/Nacelle-Regular.otf"),
    NacelleLight: require("./assets/fonts/Nacelle-Light.otf"),
    NacelleItalic: require("./assets/fonts/Nacelle-Italic.otf"),
    NacelleHeavy: require("./assets/fonts/Nacelle-Heavy.otf"),
    NacelleBold: require("./assets/fonts/Nacelle-Bold.otf"),
    NacelleBlack: require("./assets/fonts/Nacelle-Black.otf"),
  });

  const { session, updateSession } = useGlobalContext();
  const [initializing, setInitializing] = useState(true);

  // Hide Splash Screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      updateSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      updateSession(session);

      if (initializing) setInitializing(false);
    });
  }, [fontsLoaded, initializing]);

  // Prevent rendering until fonts are loaded
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || initializing) {
    return <CustomLoader loadingText="Loading..." />;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <StatusBar style="light" />
      {session && session?.user ? <RootNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>
  );
};

export default App;
