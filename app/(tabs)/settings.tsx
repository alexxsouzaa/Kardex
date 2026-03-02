import { Text, View, StyleSheet } from "react-native";

const Page = () => {
    return (
        <View style={styles.container}>
            <Text>Settings</Text>
        </View>
    );
}

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});