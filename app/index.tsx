import { useApp } from '@/context/AppContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/constants/colors';

export default function Index() {
    const { deposit, isLoading } = useApp();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    // Sem depósito → onboarding
    if (!deposit) return <Redirect href="/onboarding" />;

    // Com depósito → app
    return <Redirect href="/(tabs)" />;
}