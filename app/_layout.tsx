import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/constants/colors';

export const unstable_settings = {
    anchor: '(auth)',
};

// ─── Guard separado (precisa estar dentro do AuthProvider) ────────────────────

function RootGuard() {
    const { isAuthenticated, isLoading, company } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    // Não autenticado → login
    if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

    // Autenticado mas sem empresa → onboarding
    if (!company) return <Redirect href="/(auth)/onboarding" />;

    // Tudo certo → app
    return <Redirect href="/(tabs)" />;
}

// ─── Layout raiz ─────────────────────────────────────────────────────────────

const RootLayout = () => {
    const colorScheme = useColorScheme();

    return (
        <AuthProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="index"          options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)"         options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)"         options={{ headerShown: false }} />
                    <Stack.Screen name="inventory/[id]" options={{ headerShown: false }} />
                    <Stack.Screen name="cadastre"       options={{ headerShown: false }} />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </AuthProvider>
    );
};

export default RootLayout;