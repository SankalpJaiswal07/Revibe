import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CategoriesScreen from "../screens/CategoriesScreen";
import CategoriesItemScreen from "../screens/CategoriesItemScreen";

const Stack = createNativeStackNavigator();

const CategoriesStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CategoriesMain" component={CategoriesScreen} />
      <Stack.Screen
        name="CategoriesItemScreen"
        component={CategoriesItemScreen}
      />
    </Stack.Navigator>
  );
};

export default CategoriesStackNavigator;
