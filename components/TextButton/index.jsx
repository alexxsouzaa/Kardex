import { Text, StyleSheet, Pressable } from "react-native";

export default function TextButton() {
    return (
        <Pressable style={styles.container}>
            <Text style={styles.text}>Saiba mais</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: "#292D32"
    },
});