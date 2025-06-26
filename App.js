import React, { useState, useEffect, useCallback, useRef } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GlobalProvider, useGlobalContext } from "./util/GlobalContext";
import { supabase } from "./services/supabase";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import AuthStackNavigator from "./navigation/AuthStackNavigator";
import * as NavigationBar from "expo-navigation-bar";
import RootNavigator from "./navigation/RootNavigator";
import CustomLoader from "./components/CustomLoader";

import { initializeNotifications } from "./services/notification";

initializeNotifications();
SplashScreen.preventAutoHideAsync();
NavigationBar.setBackgroundColorAsync("rgb(0, 0, 0)");

const STORAGE_KEY = "@supabase_session";

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

  // Use refs to avoid recreating functions and causing re-renders
  const authStateListenerRef = useRef(null);
  const networkListenerRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Memoized session storage functions
  const storeSession = useCallback(async (session) => {
    try {
      if (session) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error storing session:", error);
    }
  }, []);

  const getStoredSession = useCallback(async () => {
    try {
      const storedSession = await AsyncStorage.getItem(STORAGE_KEY);
      return storedSession ? JSON.parse(storedSession) : null;
    } catch (error) {
      console.error("Error retrieving stored session:", error);
      return null;
    }
  }, []);

  const isSessionValid = useCallback((session) => {
    if (!session || !session.expires_at) return false;

    const expiresAt = new Date(session.expires_at * 1000);
    const now = new Date();
    const bufferTime = 5 * 60 * 1000; // 5-minute buffer

    return expiresAt.getTime() > now.getTime() + bufferTime;
  }, []);

  // Single initialization effect
  useEffect(() => {
    if (!fontsLoaded || isInitializedRef.current) return;

    const initializeAuth = async () => {
      try {
        // Check network connectivity first
        const netInfo = await NetInfo.fetch();

        if (netInfo.isConnected) {
          // Online: Get session from Supabase
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) {
            console.error("Error getting session:", error);
            // Fallback to stored session
            const storedSession = await getStoredSession();
            if (storedSession && isSessionValid(storedSession)) {
              updateSession(storedSession);
            } else {
              updateSession(null);
            }
          } else {
            updateSession(session);
            // Store the fresh session
            if (session) {
              await storeSession(session);
            }
          }
        } else {
          // Offline: Use stored session
          const storedSession = await getStoredSession();
          if (storedSession && isSessionValid(storedSession)) {
            updateSession(storedSession);
          } else {
            // Clear invalid stored session
            await AsyncStorage.removeItem(STORAGE_KEY);
            updateSession(null);
          }
        }

        // Set up auth state listener (only once)
        if (!authStateListenerRef.current) {
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state changed:", event);

            updateSession(session);
            await storeSession(session);

            if (event === "SIGNED_OUT") {
              await AsyncStorage.removeItem(STORAGE_KEY);
            }
          });
          authStateListenerRef.current = subscription;
        }

        // Set up network listener (only once)
        if (!networkListenerRef.current) {
          networkListenerRef.current = NetInfo.addEventListener(
            async (state) => {
              // Only handle reconnection scenarios
              if (state.isConnected && session) {
                try {
                  const {
                    data: { session: freshSession },
                  } = await supabase.auth.getSession();
                  if (
                    freshSession &&
                    freshSession.access_token !== session.access_token
                  ) {
                    updateSession(freshSession);
                    await storeSession(freshSession);
                  }
                } catch (error) {
                  console.error(
                    "Error refreshing session after reconnection:",
                    error
                  );
                }
              }
            }
          );
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Final fallback to stored session
        const storedSession = await getStoredSession();
        if (storedSession && isSessionValid(storedSession)) {
          updateSession(storedSession);
        } else {
          updateSession(null);
        }
      } finally {
        setInitializing(false);
        isInitializedRef.current = true;
        await SplashScreen.hideAsync();
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      if (authStateListenerRef.current) {
        authStateListenerRef.current.unsubscribe();
        authStateListenerRef.current = null;
      }
      if (networkListenerRef.current) {
        networkListenerRef.current();
        networkListenerRef.current = null;
      }
    };
  }, [
    fontsLoaded,
    storeSession,
    getStoredSession,
    isSessionValid,
    updateSession,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (authStateListenerRef.current) {
        authStateListenerRef.current.unsubscribe();
      }
      if (networkListenerRef.current) {
        networkListenerRef.current();
      }
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !initializing) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, initializing]);

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
