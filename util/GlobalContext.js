import React, { createContext, useState, useContext, useEffect } from "react";
import {
  updatePassword,
  updateProfilePicture,
  updateUsername,
} from "../services/supabase";
import {
  dummyData,
  fetchRecentItemById,
  fetchRecentItemsByBinCategory,
} from "./data";
import {
  setupNotifications,
  cancelAllScheduledNotifications,
} from "../services/notification";

// Create Context
const GlobalContext = createContext();

// Custom hook for using Global Context
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [profileSetupRequired, setProfileSetupRequired] = useState(false);
  const [session, setSession] = useState(null);
  const [syncApp, setSyncApp] = useState(false);
  const [isDummyData, setIsDummyData] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Getter and setter for session
  const updateSession = (newSession) => setSession(newSession);

  // Getter and setter for profile setup requirement
  const updateProfileSetupRequired = (isRequired) =>
    setProfileSetupRequired(isRequired);

  const getSyncApp = () => setSyncApp(!syncApp);

  // Set up notifications when enabled
  useEffect(() => {
    if (notificationsEnabled) {
      setupNotifications();
    } else {
      cancelAllScheduledNotifications();
    }
  }, [notificationsEnabled]); // Effect runs when the state changes

  // Toggle notifications state
  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  return (
    <GlobalContext.Provider
      value={{
        session,
        profileSetupRequired,
        updateSession,
        updateProfileSetupRequired,
        updatePassword,
        updateProfilePicture,
        updateUsername,
        getSyncApp,
        syncApp,
        dummyData,
        fetchRecentItemById,
        fetchRecentItemsByBinCategory,
        isDummyData,
        setIsDummyData,
        notificationsEnabled,
        toggleNotifications,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
