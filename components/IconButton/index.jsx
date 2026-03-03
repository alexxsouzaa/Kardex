import { Text, View, StyleSheet, Image } from "react-native";
import { Notification } from "iconsax-react-native"

export default function IconButton() {
    return (
        <View style={styles.container}>
           <Notification size="24" color="#292D32" variant="Bold"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
    },
});