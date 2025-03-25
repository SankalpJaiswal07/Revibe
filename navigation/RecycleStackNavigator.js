import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RecycleItemScreen from "../screens/RecycleItemScreen";
import ItemDetailScreen from "../screens/ItemDetail";

const Stack = createNativeStackNavigator();

const RecycleStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="RecycleItem"
        component={RecycleItemScreen}
        options={{
          title: "",
        }}
      />
    </Stack.Navigator>
  );
};

export default RecycleStackNavigator;
