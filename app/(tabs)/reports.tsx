import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { ExpiringProduct, useReportData } from "@/hooks/useReportData";
import { StatusBar } from "expo-status-bar";
import {
    ArrowDown,
    ArrowUp,
    Box,
    Calendar,
    Danger,
    EmptyWallet,
    TickCircle,
    Warning2,
} from "iconsax-react-native";
import { useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function formatDate(dateStr: string): string {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
}

function getDayLabel(days: number): string {
    if (days === 0) return "Vence hoje";
    if (days === 1) return "Vence amanhã";
    return `${days} dias`;
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

type SummaryCardProps = {
    icon: React.ReactNode;
    label: string;
    value: string;
    accent?: string;
    bgColor?: string;
};

const SummaryCard = ({
    icon,
    label,
    value,
    accent,
    bgColor,
}: SummaryCardProps) => (
    <View style={[styles.summaryCard, bgColor ? { backgroundColor: bgColor } : null]}>
        <View style={styles.summaryCardIcon}>{icon}</View>
        <Text
            style={[
                styles.summaryCardValue,
                accent ? { color: accent } : null,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
        >
            {value}
        </Text>
        <Text style={styles.summaryCardLabel}>{label}</Text>
    </View>
);

type StatusPillProps = {
    icon: React.ReactNode;
    label: string;
    count: number;
    color: string;
    bgColor: string;
};

const StatusPill = ({ icon, label, count, color, bgColor }: StatusPillProps) => (
    <View style={[styles.statusPill, { backgroundColor: bgColor }]}>
        <View style={styles.statusPillLeft}>
            {icon}
            <Text style={[styles.statusPillLabel, { color }]}>{label}</Text>
        </View>
        <Text style={[styles.statusPillCount, { color }]}>{count}</Text>
    </View>
);

type MovementCardProps = {
    icon: React.ReactNode;
    label: string;
    qty: number;
    value: number;
    accentColor: string;
    bgColor: string;
};

const MovementCard = ({
    icon,
    label,
    qty,
    value,
    accentColor,
    bgColor,
}: MovementCardProps) => (
    <View style={[styles.movementCard, { backgroundColor: bgColor }]}>
        <View style={[styles.movementIconBox, { backgroundColor: accentColor }]}>
            {icon}
        </View>
        <View style={styles.movementInfo}>
            <Text style={styles.movementLabel}>{label}</Text>
            <Text style={[styles.movementQty, { color: accentColor }]}>
                {qty} {qty === 1 ? "item" : "itens"}
            </Text>
        </View>
        <Text
            style={styles.movementValue}
            numberOfLines={1}
            adjustsFontSizeToFit
        >
            {formatCurrency(value)}
        </Text>
    </View>
);

type ExpiringItemProps = {
    item: ExpiringProduct;
};

const ExpiringItem = ({ item }: ExpiringItemProps) => {
    const isUrgent = item.daysLeft <= 7;
    const badgeColor = isUrgent ? Colors.danger : Colors.warning;
    const badgeBg = isUrgent ? Colors.dangerLight : Colors.warningLight;

    return (
        <View style={styles.expiringItem}>
            <View style={styles.expiringLeft}>
                <Text style={styles.expiringName} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={styles.expiringDate}>
                    Vencimento: {formatDate(item.expiryDate)}
                </Text>
            </View>
            <View style={[styles.expiringBadge, { backgroundColor: badgeBg }]}>
                <Text style={[styles.expiringBadgeText, { color: badgeColor }]}>
                    {getDayLabel(item.daysLeft)}
                </Text>
            </View>
        </View>
    );
};

// ─── Página ───────────────────────────────────────────────────────────────────

const Page = () => {
    const { company } = useApp();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const report = useReportData(company?.id ?? "");

    const handleRefresh = () => {
        setIsRefreshing(true);
        report.refetch();
        setTimeout(() => setIsRefreshing(false), 800);
    };

    const today = new Date();
    const dateStr = today.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    if (report.isLoading && !isRefreshing) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="dark" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

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
                {/* ── Header ── */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Relatórios</Text>
                    <Text style={styles.headerDate}>{dateStr}</Text>
                </View>

                {/* ── Resumo Geral ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Resumo geral</Text>
                    <View style={styles.summaryRow}>
                        <SummaryCard
                            icon={
                                <Box
                                    size={20}
                                    color={Colors.iconBlue}
                                    variant="Bold"
                                />
                            }
                            label="Produtos cadastrados"
                            value={String(report.totalProducts)}
                            accent={Colors.iconBlue}
                            bgColor={Colors.iconBlueBg}
                        />
                        <SummaryCard
                            icon={
                                <EmptyWallet
                                    size={20}
                                    color={Colors.iconPurple}
                                    variant="Bold"
                                />
                            }
                            label="Valor total em estoque"
                            value={formatCurrency(report.totalStockValue)}
                            accent={Colors.iconPurple}
                            bgColor={Colors.iconPurpleBg}
                        />
                    </View>
                </View>

                {/* ── Status do Estoque ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Status do estoque</Text>
                    <View style={styles.statusColumn}>
                        <StatusPill
                            icon={
                                <Danger
                                    size={18}
                                    color={Colors.danger}
                                    variant="Bold"
                                />
                            }
                            label="Em falta"
                            count={report.outOfStockCount}
                            color={Colors.danger}
                            bgColor={Colors.dangerLight}
                        />
                        <StatusPill
                            icon={
                                <Warning2
                                    size={18}
                                    color={Colors.warning}
                                    variant="Bold"
                                />
                            }
                            label="Estoque baixo"
                            count={report.lowStockCount}
                            color={Colors.warning}
                            bgColor={Colors.warningLight}
                        />
                        <StatusPill
                            icon={
                                <TickCircle
                                    size={18}
                                    color={Colors.success}
                                    variant="Bold"
                                />
                            }
                            label="Estoque normal"
                            count={report.normalStockCount}
                            color={Colors.success}
                            bgColor={Colors.successLight}
                        />
                    </View>
                </View>

                {/* ── Movimentações ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Movimentações</Text>
                    <View style={styles.movementColumn}>
                        <MovementCard
                            icon={
                                <ArrowDown
                                    size={18}
                                    color="#fff"
                                    variant="Bold"
                                />
                            }
                            label="Entradas"
                            qty={report.totalIn}
                            value={report.totalInValue}
                            accentColor={Colors.success}
                            bgColor={Colors.surface}
                        />
                        <MovementCard
                            icon={
                                <ArrowUp
                                    size={18}
                                    color="#fff"
                                    variant="Bold"
                                />
                            }
                            label="Saídas"
                            qty={report.totalOut}
                            value={report.totalOutValue}
                            accentColor={Colors.danger}
                            bgColor={Colors.surface}
                        />
                    </View>
                </View>

                {/* ── Próximos a Vencer ── */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            Próximos a vencer
                        </Text>
                        {report.expiringProducts.length > 0 && (
                            <View style={styles.expiringCountBadge}>
                                <Text style={styles.expiringCountText}>
                                    {report.expiringProducts.length}
                                </Text>
                            </View>
                        )}
                    </View>

                    {report.expiringProducts.length === 0 ? (
                        <View style={styles.emptyCard}>
                            <Calendar
                                size={32}
                                color={Colors.textMuted}
                                variant="Linear"
                            />
                            <Text style={styles.emptyText}>
                                Nenhum produto próximo{"\n"}do vencimento
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.expiringList}>
                            {report.expiringProducts.map((item) => (
                                <ExpiringItem key={item.id} item={item} />
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Page;

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    content: {
        padding: 16,
        gap: 24,
        paddingBottom: 140,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    // ── Header ──
    header: {
        gap: 4,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: "Satoshi_Bold",
        color: Colors.textPrimary,
    },
    headerDate: {
        fontSize: 13,
        fontFamily: "Satoshi_Regular",
        color: Colors.textSecondary,
    },

    // ── Seções ──
    section: {
        gap: 12,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    sectionTitle: {
        fontSize: 15,
        fontFamily: "Satoshi_Bold",
        color: Colors.textPrimary,
    },

    // ── Resumo ──
    summaryRow: {
        flexDirection: "row",
        gap: 10,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        gap: 8,
    },
    summaryCardIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    summaryCardValue: {
        fontSize: 20,
        fontFamily: "Satoshi_Bold",
        color: Colors.textPrimary,
    },
    summaryCardLabel: {
        fontSize: 11,
        fontFamily: "Satoshi_Regular",
        color: Colors.textSecondary,
    },

    // ── Status ──
    statusColumn: {
        gap: 8,
    },
    statusPill: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
    },
    statusPillLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    statusPillLabel: {
        fontSize: 14,
        fontFamily: "Satoshi_Medium",
    },
    statusPillCount: {
        fontSize: 20,
        fontFamily: "Satoshi_Bold",
    },

    // ── Movimentações ──
    movementColumn: {
        gap: 10,
    },
    movementCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 16,
        gap: 14,
    },
    movementIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    movementInfo: {
        flex: 1,
        gap: 2,
    },
    movementLabel: {
        fontSize: 14,
        fontFamily: "Satoshi_Medium",
        color: Colors.textPrimary,
    },
    movementQty: {
        fontSize: 12,
        fontFamily: "Satoshi_Regular",
    },
    movementValue: {
        fontSize: 15,
        fontFamily: "Satoshi_Bold",
        color: Colors.textPrimary,
    },

    // ── Próximos a vencer ──
    expiringCountBadge: {
        backgroundColor: Colors.dangerLight,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    expiringCountText: {
        fontSize: 12,
        fontFamily: "Satoshi_Bold",
        color: Colors.danger,
    },
    expiringList: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        overflow: "hidden",
    },
    expiringItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
    },
    expiringLeft: {
        flex: 1,
        gap: 2,
        marginRight: 12,
    },
    expiringName: {
        fontSize: 14,
        fontFamily: "Satoshi_Medium",
        color: Colors.textPrimary,
    },
    expiringDate: {
        fontSize: 12,
        fontFamily: "Satoshi_Regular",
        color: Colors.textSecondary,
    },
    expiringBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    expiringBadgeText: {
        fontSize: 11,
        fontFamily: "Satoshi_Bold",
    },

    // ── Vazio ──
    emptyCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        paddingVertical: 32,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    emptyText: {
        fontSize: 13,
        fontFamily: "Satoshi_Regular",
        color: Colors.textMuted,
        textAlign: "center",
        lineHeight: 20,
    },
});