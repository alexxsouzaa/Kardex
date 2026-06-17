import { AppProvider } from '@/context/AppContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
    anchor: 'index',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <AppProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="onboarding" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="inventory/[id]" />
                    <Stack.Screen name="cadastre" />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </AppProvider>
    );
}