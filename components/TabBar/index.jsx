import { Home2, Setting, Box, AddCircle, Document } from 'iconsax-react-native';
import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useAppFonts } from '../../hooks/fontsConfig';

export default function TabBar({ state, descriptors, navigation }) {
    const fontsLoaded = useAppFonts();
    const icons = {
        index: Home2,
        inventory: Box,
        cadastre: AddCircle,
        settings: Setting,
        reports: Document,
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];

                    const label =
                        options.tabBarLabel ??
                        options.title ??
                        route.name;

                    const isFocused = state.index === index;
                    const IconComponent = icons[route.name];

                    // BOTÃO CENTRAL DE AÇÃO (CADASTRAR)
                    if (route.name === 'cadastre') {
                        return (
                            <TouchableOpacity
                                key={route.key}
                                onPress={() => navigation.navigate(route.name)}
                                activeOpacity={0.85}
                                style={styles.actionButton}
                            >
                                <AddCircle size={32} variant="Bold" color="#fff" />
                            </TouchableOpacity>
                        );
                    }

                    // BOTÕES NORMAIS
                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={() => navigation.navigate(route.name)}
                            activeOpacity={0.8}
                            style={[
                                styles.tabButton,
                                isFocused && styles.tabButtonFocused,
                            ]}
                        >
                            {IconComponent && (
                                <IconComponent
                                    size={24}
                                    variant="Bold"
                                    color={isFocused ? "#FF4F18" : "#000"}
                                />
                            )}

                            {!isFocused && (
                                <Text style={styles.label}>
                                    {label}
                                </Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: 16,
        alignSelf: "center",
        borderRadius: 80,
        elevation: 6,
    },
    container: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 80,
        padding: 4,
        alignItems: "center",
    },
    tabButton: {
        height: 64,
        width: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
    },
    tabButtonFocused: {
        backgroundColor: "#FFE3D9",
    },
    actionButton: {
        height: 60,
        width: 60,
        borderRadius: 36,
        backgroundColor: "#FF4F18",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 12,
    },
    label: {
        fontSize: 10,
        fontFamily: 'Poppins_400Regular',
        color: "#000",
    },
});