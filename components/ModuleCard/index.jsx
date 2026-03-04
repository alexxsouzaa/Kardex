import { Text, StyleSheet, TouchableOpacity } from "react-native";


export default function ModuleCard({
  title = "Módulo",
  icon: Icon,
  iconColor = "#292D32",
  backgroundColor = "#FFFFFF",
  onPress,
}) {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {Icon && <Icon size={24} color={iconColor} variant="Bold" />}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '31%',
    aspectRatio: 1,
    padding: 14,
    borderRadius: 16,
    justifyContent: "space-between",
    alignItems: "flex-start",

    backgroundColor: "#fff",

    shadowColor: "#00000055",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: "700",
    color: "#292D32",
  },
});