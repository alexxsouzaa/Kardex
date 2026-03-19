// app/index.tsx
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/constants/colors';

export default function Index() {
    const { isAuthenticated, isLoading, company } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!isAuthenticated)        return <Redirect href="/(auth)/login" />;
    if (!company)                return <Redirect href="/(auth)/onboarding" />;
    return                              <Redirect href="/(tabs)" />;
}