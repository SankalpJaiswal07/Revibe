import { StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

function IconButton({ icon, size, color, onpress }) {
  return (
    <TouchableOpacity
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onpress}
    >
      <MaterialIcons name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 4,
    top: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
