import BarcodeScannerModal from "@/components/BarcodeScannerModal";
import IconButton from "@/components/IconButton";
import SortModal, { SortOption } from "@/components/SortModal";
import StockModule from "@/components/StockModule";
import { Colors } from "@/constants/colors";
import { CATEGORY_ICONS } from "@/constants/stockData";
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowDown2, Scanning, SearchNormal1 } from "iconsax-react-native";
import { useState } from "react";
import {
    ActivityIndicator, FlatList, KeyboardAvoidingView, Platform,
    RefreshControl, ScrollView, StyleSheet, Text, TextInput,
    TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type StockFilter = "all" | "low" | "out";
type SortValue = "az" | "za" | "qty_asc" | "qty_desc" | "value_desc" | "value_asc";

const FILTER_OPTIONS = [
    { label: 'Todos', value: 'all' as StockFilter },
    { label: 'Estoque baixo', value: 'low' as StockFilter },
    { label: 'Em falta', value: 'out' as StockFilter },
];

const SORT_OPTIONS: SortOption[] = [
    { label: 'A → Z', value: 'az' },
    { label: 'Z → A', value: 'za' },
    { label: 'Maior estoque', value: 'qty_desc' },
    { label: 'Menor estoque', value: 'qty_asc' },
    { label: 'Maior valor', value: 'value_desc' },
    { label: 'Menor valor', value: 'value_asc' },
];

const SORT_LABELS: Record<SortValue, string> = {
    az: 'A → Z',
    za: 'Z → A',
    qty_desc: 'Maior estoque',
    qty_asc: 'Menor estoque',
    value_desc: 'Maior valor',
    value_asc: 'Menor valor',
};

const CATEGORIES = [
    { label: 'Todos', value: 'all' },
    ...Object.keys(CATEGORY_ICONS).map((cat) => ({ label: cat, value: cat })),
];

const CARD_HEIGHT = 108;

function getContextLabel(filter: StockFilter, categoryValue: string): string {
    const cat = categoryValue !== 'all' ? categoryValue : null;
    if (filter === 'low') return cat ? `Estoque baixo em ${cat}` : 'Estoque baixo';
    if (filter === 'out') return cat ? `Em falta em ${cat}` : 'Em falta';
    return cat ? cat : 'Todos em estoque';
}

const Page = () => {
    const router = useRouter();
    const tabBarHeight = useBottomTabBarHeight();
    const { company } = useAuth();

    const [activeFilter, setActiveFilter] = useState<StockFilter>('all');
    const [search, setSearch] = useState('');
    const [sortValue, setSortValue] = useState<SortValue>('az');
    const [categoryValue, setCategoryValue] = useState('all');
    const [sortVisible, setSortVisible] = useState(false);
    const [scannerVisible, setScannerVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { products, isLoading, error } = useProducts({
        companyId: company?.id ?? '',
        search,
        category: categoryValue,
        filter: activeFilter,
        sortBy: sortValue,
    });

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const contextLabel = getContextLabel(activeFilter, categoryValue);

    const emptyMessage = search.length > 0
        ? `Nenhum resultado para "${search}"`
        : 'Nenhum item nesta categoria';

    // ── Header do card branco (rola junto com a lista) ──
    const ListHeader = () => (
        <View>
            {/* Filtros */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
                contentContainerStyle={styles.filterRow}
            >
                <TouchableOpacity
                    style={[styles.filterPill, sortValue !== 'az' && styles.filterPillActive]}
                    onPress={() => setSortVisible(true)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.filterPillText, sortValue !== 'az' && styles.filterPillTextActive]}>
                        {SORT_LABELS[sortValue]}
                    </Text>
                    <ArrowDown2
                        size={12}
                        color={sortValue !== 'az' ? Colors.textPrimary : Colors.textSecondary}
                        variant="Bold"
                    />
                </TouchableOpacity>

                {FILTER_OPTIONS.map((option) => {
                    const isActive = option.value === activeFilter;
                    return (
                        <TouchableOpacity
                            key={option.value}
                            style={[styles.filterPill, isActive && styles.filterPillActive]}
                            onPress={() => setActiveFilter(option.value)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Label contextual + contador */}
            <View style={styles.contextRow}>
                <Text style={styles.contextLabel}>{contextLabel}</Text>
                {!isLoading && (
                    <Text style={styles.contextCount}>
                        {products.length} {products.length === 1 ? 'item' : 'itens'}
                    </Text>
                )}
            </View>

            {/* Resultado da busca */}
            {search.length > 0 && (
                <Text style={styles.searchResult}>
                    {products.length} resultado{products.length !== 1 ? 's' : ''} para "{search}"
                </Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* ── Header fixo (fora do card) ── */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Controle de Estoque</Text>

                    <View style={styles.searchBar}>
                        <View style={styles.searchInput}>
                            <SearchNormal1 size={12} color={Colors.textSecondary} variant="Linear" />
                            <TextInput
                                style={styles.searchInputText}
                                placeholder="Pesquisar produto ou item"
                                placeholderTextColor={Colors.textSecondary}
                                maxLength={55}
                                returnKeyType="search"
                                value={search}
                                onChangeText={setSearch}
                            />
                        </View>
                        <IconButton
                            icon={Scanning}
                            variant="Bold"
                            backgroundColor={Colors.surface}
                            iconColor={Colors.textSecondary}
                            size={12}
                            onPress={() => setScannerVisible(true)}
                        />
                    </View>

                    {/* Categorias */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryRow}
                    >
                        {CATEGORIES.map((cat) => {
                            const isActive = categoryValue === cat.value;
                            return (
                                <TouchableOpacity
                                    key={cat.value}
                                    style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                                    onPress={() => setCategoryValue(cat.value)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* ── Card branco com FlatList ── */}
                <View style={styles.contentCard}>
                    {isLoading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                        </View>
                    )}

                    {error && !isLoading && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}

                    {!isLoading && !error && (
                        <FlatList
                            style={styles.list}
                            contentContainerStyle={{
                                paddingBottom: tabBarHeight + 48,
                                paddingHorizontal: 16,
                            }}
                            data={products}
                            keyExtractor={(item) => String(item.id)}
                            ListHeaderComponent={<ListHeader />}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                            renderItem={({ item }) => (
                                <StockModule
                                    data={item}
                                    onPress={() => router.push(`/inventory/${item.id}` as any)}
                                />
                            )}
                            getItemLayout={(_, index) => ({
                                length: CARD_HEIGHT,
                                offset: (CARD_HEIGHT + 10) * index,
                                index,
                            })}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>{emptyMessage}</Text>
                            }
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={handleRefresh}
                                    tintColor={Colors.primary}
                                    colors={[Colors.primary]}
                                    progressBackgroundColor={Colors.surface}
                                />
                            }
                        />
                    )}
                </View>
            </KeyboardAvoidingView>

            <SortModal
                visible={sortVisible}
                value={sortValue}
                options={SORT_OPTIONS}
                onClose={() => setSortVisible(false)}
                onChange={(val) => setSortValue(val as SortValue)}
            />
            <BarcodeScannerModal
                visible={scannerVisible}
                onClose={() => setScannerVisible(false)}
                onNavigateToProduct={(product) => {
                    setScannerVisible(false);
                    router.push(`/inventory/${product.id}` as any);
                }}
                onRegisterMovement={(product) => {
                    setScannerVisible(false);
                    router.push(`/inventory/${product.id}` as any);
                }}
                onAddProduct={(code) => {
                    setScannerVisible(false);
                    router.push(`/cadastre?eanCode=${code}` as any);
                }}
            />
        </SafeAreaView>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: 16,
    },
    keyboardView: {
        flex: 1,
    },
    headerContainer: {
        gap: 16,
        paddingHorizontal: 16,
        flexShrink: 1,
        flexGrow: 0,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textPrimary,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.surface,
        borderRadius: 40,
        paddingHorizontal: 16,
    },
    searchInputText: {
        flex: 1,
        fontSize: 12,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textPrimary,
    },
    categoryRow: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 2,
    },
    categoryPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.background,
    },
    categoryPillActive: {
        backgroundColor: Colors.surface,
    },
    categoryPillText: {
        fontSize: 12,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
    },
    categoryPillTextActive: {
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
    },
    contentCard: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        marginTop: 16,
        overflow: 'hidden',
    },
    filterScroll: {
        flexGrow: 0,
        flexShrink: 0,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingTop: 16,
        paddingBottom: 4,
    },
    filterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
    },
    filterPillActive: {
        borderColor: Colors.textPrimary,
        backgroundColor: Colors.surface,
    },
    filterPillText: {
        fontSize: 13,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
    },
    filterPillTextActive: {
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
    },
    contextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 24,
    },
    contextLabel: {
        fontSize: 14,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textPrimary,
    },
    contextCount: {
        fontSize: 12,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textMuted,
    },
    list: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 48,
    },
    errorText: {
        textAlign: 'center',
        marginTop: 48,
        fontSize: 14,
        fontFamily: 'Satoshi_Regular',
        color: Colors.danger,
        paddingHorizontal: 16,
    },
    searchResult: {
        fontSize: 13,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textSecondary,
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 48,
        fontSize: 14,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textSecondary,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.divider,
        marginHorizontal: 16,
    },
});