import CardBanner from "@/components/CardBanner";
import Header from "@/components/Header";
import ModuleCard from "@/components/ModuleCard";
import { StatusBar } from "expo-status-bar";
import { ArrowRight2, Box, Activity, Document, TaskSquare, Book1, ArchiveBox, UserAdd, Bag } from "iconsax-react-native";
import React from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const inventoryModules = [
    { id: "1", title: "Estoque", icon: Box },
    { id: "2", title: "Relatórios", icon: Document },
    { id: "3", title: "Informações do estoque", icon: Activity },
];

const productsModules = [
    { id: "1", title: "Lista de produtos", icon: TaskSquare },
    { id: "2", title: "Catálogo de produtos", icon: Book1 },
];

const cadastreModules = [
    { id: "1", title: "Novo produto", icon: Bag },
    { id: "2", title: "Novo fornecedor", icon: UserAdd },
    { id: "3", title: "Nova categoria", icon: ArchiveBox },
    { id: "4", title: "Nova marca", icon: ArchiveBox },
    { id: "5", title: "Nova unidade de medida", icon: ArchiveBox },
];

const HomeScreen = () => {
    return (
        <SafeAreaView style={styles.screenContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <StatusBar style="dark" />

                <View style={styles.screenContent}>
                    <Header />
                    <CardBanner />
                    <View style={styles.inventorySection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Estoque</Text>
                            <ArrowRight2 size={12} color="#292D32" />
                        </View>

                        <View style={styles.modulesGrid}>
                            {inventoryModules.map((module) => (
                                <ModuleCard
                                    key={module.id}
                                    title={module.title}
                                    icon={module.icon}
                                    onPress={() => { }}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.inventorySection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Produtos</Text>
                            <ArrowRight2 size={12} color="#292D32" />
                        </View>

                        <View style={styles.modulesGrid}>
                            {productsModules.map((module) => (
                                <ModuleCard
                                    key={module.id}
                                    title={module.title}
                                    icon={module.icon}
                                    onPress={() => { }}
                                />
                            ))}
                        </View>
                    </View>
                    <View style={styles.inventorySection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Cadastros</Text>
                            <ArrowRight2 size={12} color="#292D32" />
                        </View>

                        <View style={styles.modulesGrid}>
                            {cadastreModules.map((module) => (
                                <ModuleCard
                                    key={module.id}
                                    title={module.title}
                                    icon={module.icon}
                                    onPress={() => { }}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: "#EBECEF",
    },

    screenContent: {
        padding: 16,
        gap: 16,
        paddingBottom: 140,
    },

    inventorySection: {
        paddingTop: 8,
        gap: 12,
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#292D32",
    },

    modulesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        gap: 8,
    },
});