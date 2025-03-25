import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useGlobalContext } from "../util/GlobalContext";
import BottomTabNavigator from "./BottomTabNavigator";
import ItemDetailScreen from "../screens/ItemDetail";
import InitialProfileSetup from "../screens/InitialProfileSetup";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { profileSetupRequired } = useGlobalContext();

  return (
    <Stack.Navigator
      initialRouteName={profileSetupRequired ? "ProfileSetup" : "MainTabs"}
      screenOptions={{ headerShown: false }}
    >
      {/* Main Bottom Tab Navigator */}
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

      {/* Shared Screen: Item Detail */}
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
      <Stack.Screen name="ProfileSetup" component={InitialProfileSetup} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
