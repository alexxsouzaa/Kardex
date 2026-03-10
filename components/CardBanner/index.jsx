import { Text, View, StyleSheet, ImageBackground } from "react-native";
import TextButton from "../TextButton";

export default function CardBanner() {
    return (
        <ImageBackground
            source={require('../../assets/images/card-banner.png')}
            style={styles.container}
            imageStyle={styles.image}
            resizeMode="cover"
        >
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Kardex</Text>
                    <Text style={styles.subtitle}>Seu estoque na palma da mão</Text>
                </View>
                <TextButton />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 150,
        padding: 16,
        borderRadius: 22,
        overflow: 'hidden',
        alignItems: 'flex-start',
    },
    textContainer: {
        alignItems: 'flex-start',
        padding: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
    },
    image: {
        borderRadius: 22,
    },
    content: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
        height: '100%',
        padding: 8,
    },
});