import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import RecycleStackNavigator from "./RecycleStackNavigator";

import ProfileScreen from "../screens/ProfileScreen";
import CategoriesStackNavigator from "./CategoriesStackNavigator";
import TabBar from "../components/TabBar";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Recycle"
        component={RecycleStackNavigator}
        options={{
          title: "",
          tabBarLabel: "Recycle",
        }}
      />

      <Tab.Screen name="Categories" component={CategoriesStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
