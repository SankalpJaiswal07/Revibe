import { View, Platform, StyleSheet, Dimensions } from "react-native";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { Text, PlatformPressable } from "@react-navigation/elements";
import { Ionicons, Octicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const TabBar = ({ state, descriptors, navigation }) => {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  const primaryColor = "#00FF88";
  const secondaryColor = "#888888";

  const icons = {
    Home: (props) => (
      <Octicons name="home" size={20} color="white" {...props} />
    ),
    Recycle: (props) => (
      <Octicons name="trash" size={20} color="white" {...props} />
    ),
    Categories: (props) => (
      <Ionicons name="albums" size={20} color="white" {...props} />
    ),
    Profile: (props) => (
      <Octicons name="person-fill" size={20} color="white" {...props} />
    ),
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={route.name}
            style={styles.tabBarItem}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {icons[route.name]({
              color: isFocused ? primaryColor : secondaryColor,
            })}
            <Text
              style={{
                color: isFocused ? primaryColor : secondaryColor,
                fontSize: width * 0.03,
                fontFamily: "Nacelle-Light",
              }}
            >
              {label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: height * 0.05, // Dynamic bottom spacing (5% of screen height)
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#000",
    marginHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderRadius: 25,
    borderCurve: "continuous",
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 10,
  },
  tabBarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
});

export default TabBar;
