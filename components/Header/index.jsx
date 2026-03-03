import { Text, View, StyleSheet, Image } from "react-native";
import IconButton from "../IconButton";

export default function Header() {
    return (
        <View style={styles.container}>
        <View style={styles.userContainer}>
            <Image source={require('../../assets/images/avatar.png')} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.subtitle}>Bem-vindo(a),</Text>
                <Text style={styles.title}>Bruno Alex!</Text>
            </View>
        </View>
        <View style={styles.notificationContainer}>
            <IconButton />
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        width: '100%',
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    textContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 0,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: "#292D32"
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: "#292D32"
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
    },
});
