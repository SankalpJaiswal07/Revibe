import { Pressable, StyleSheet, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

function OutlineButton({ onPress, icon, children, color, bgcolor }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bgcolor },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <MaterialIcons style={styles.icon} name={icon} size={18} color={color} />
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

export default OutlineButton;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    margin: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    color: "#fff",
    fontFamily: "NacelleSemiBold",
    fontWeight: "600",
  },
});
