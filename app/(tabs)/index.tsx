import Header from "@/components/Header";
import ModuleCard from "@/components/ModuleCard";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { useProducts } from "@/hooks/useProducts";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    Activity, ArchiveBox, Bag, Book1,
    Box, Crown, Document, TaskSquare, UserAdd
} from "iconsax-react-native";
import { useState } from "react";
import {
    RefreshControl, ScrollView, StyleSheet,
    Text, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Componente ──────────────────────────────────────────────────────────────

const HomeScreen = () => {
    const router            = useRouter();
    const { company, plan } = useApp();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { products, outCount, lowCount } = useProducts({
        companyId: company?.id ?? '',
    });

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    // ── Módulos com navegação real ──
    const inventoryModules = [
        {
            id:    '1',
            title: 'Estoque',
            icon:  Box,
            onPress: () => router.push('/(tabs)/inventory' as any),
        },
        {
            id:       '2',
            title:    'Relatórios',
            icon:     Document,
            onPress:  () => plan === 'pro' ? router.push('/(tabs)/reports' as any) : null,
            iconColor: plan === 'pro' ? Colors.textPrimary : Colors.textMuted,
            iconBg:    plan === 'pro' ? Colors.background  : Colors.divider,
        },
        {
            id:    '3',
            title: 'Informações',
            icon:  Activity,
            onPress: () => router.push('/(tabs)/inventory' as any),
        },
    ];

    const productsModules = [
        {
            id:      '1',
            title:   'Lista de produtos',
            icon:    TaskSquare,
            onPress: () => router.push('/(tabs)/inventory' as any),
        },
        {
            id:      '2',
            title:   'Catálogo',
            icon:    Book1,
            onPress: () => router.push('/(tabs)/inventory' as any),
        },
    ];

    const cadastreModules = [
        {
            id:      '1',
            title:   'Novo produto',
            icon:    Bag,
            onPress: () => router.push('/cadastre' as any),
        },
        {
            id:      '2',
            title:   'Novo fornecedor',
            icon:    UserAdd,
            onPress: () => {},
        },
        {
            id:      '3',
            title:   'Nova categoria',
            icon:    ArchiveBox,
            onPress: () => {},
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={Colors.primary}
                        colors={[Colors.primary]}
                        progressBackgroundColor={Colors.surface}
                    />
                }
            >
                {/* ── Header com dados reais ── */}
                <Header />

                {/* ── Banner PRO (só no plano free) ── */}
                {plan === 'free' && (
                    <TouchableOpacity style={styles.proBanner} activeOpacity={0.9}>
                        <View style={styles.proLeft}>
                            <View style={styles.proIconBox}>
                                <Crown size={20} color="#F59E0B" variant="Bold" />
                            </View>
                            <View style={styles.proInfo}>
                                <Text style={styles.proTitle}>Upgrade para Pro</Text>
                                <Text style={styles.proSub}>
                                    Relatórios, sync em nuvem e muito mais
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {/* ── Resumo rápido ── */}
                <View style={styles.summaryRow}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryValue}>{products.length}</Text>
                        <Text style={styles.summaryLabel}>Produtos</Text>
                    </View>
                    <View style={[
                        styles.summaryCard,
                        outCount > 0 && styles.summaryCardDanger,
                    ]}>
                        <Text style={[
                            styles.summaryValue,
                            outCount > 0 && styles.summaryValueDanger,
                        ]}>
                            {outCount}
                        </Text>
                        <Text style={[
                            styles.summaryLabel,
                            outCount > 0 && styles.summaryLabelDanger,
                        ]}>
                            Em falta
                        </Text>
                    </View>
                    <View style={[
                        styles.summaryCard,
                        lowCount > 0 && styles.summaryCardWarning,
                    ]}>
                        <Text style={[
                            styles.summaryValue,
                            lowCount > 0 && styles.summaryValueWarning,
                        ]}>
                            {lowCount}
                        </Text>
                        <Text style={[
                            styles.summaryLabel,
                            lowCount > 0 && styles.summaryLabelWarning,
                        ]}>
                            Estoque baixo
                        </Text>
                    </View>
                </View>

                {/* ── Seção: Estoque ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Estoque</Text>
                    <View style={styles.modulesGrid}>
                        {inventoryModules.map((module) => (
                            <ModuleCard
                                key={module.id}
                                title={module.title}
                                icon={module.icon}
                                iconColor={module.iconColor}
                                iconBg={module.iconBg}
                                onPress={module.onPress}
                            />
                        ))}
                    </View>
                </View>

                {/* ── Seção: Produtos ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Produtos</Text>
                    <View style={styles.modulesGrid}>
                        {productsModules.map((module) => (
                            <ModuleCard
                                key={module.id}
                                title={module.title}
                                icon={module.icon}
                                onPress={module.onPress}
                            />
                        ))}
                    </View>
                </View>

                {/* ── Seção: Cadastros ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cadastros</Text>
                    <View style={styles.modulesGrid}>
                        {cadastreModules.map((module) => (
                            <ModuleCard
                                key={module.id}
                                title={module.title}
                                icon={module.icon}
                                onPress={module.onPress}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 16,
        gap: 16,
        paddingBottom: 140,
    },

    // ── Banner PRO ──
    proBanner: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    proLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    proIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    proInfo: {
        flex: 1,
        gap: 2,
    },
    proTitle: {
        fontSize: 14,
        fontFamily: 'Satoshi_Bold',
        color: '#fff',
    },
    proSub: {
        fontSize: 11,
        fontFamily: 'Satoshi_Regular',
        color: 'rgba(255,255,255,0.8)',
    },

    // ── Resumo ──
    summaryRow: {
        flexDirection: 'row',
        gap: 8,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 14,
        gap: 2,
        alignItems: 'center',
    },
    summaryCardDanger: {
        backgroundColor: Colors.dangerLight,
    },
    summaryCardWarning: {
        backgroundColor: Colors.warningLight,
    },
    summaryValue: {
        fontSize: 22,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
    },
    summaryValueDanger: {
        color: Colors.danger,
    },
    summaryValueWarning: {
        color: Colors.warning,
    },
    summaryLabel: {
        fontSize: 11,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    summaryLabelDanger: {
        color: Colors.danger,
    },
    summaryLabelWarning: {
        color: Colors.warning,
    },

    // ── Seções ──
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
    },
    modulesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
});