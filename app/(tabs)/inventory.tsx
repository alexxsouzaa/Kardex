import BarcodeScannerModal from "@/components/BarcodeScannerModal";
import CategoryModal from "@/components/CategoryModal";
import FilterTabs from "@/components/FilterTabs";
import IconButton from "@/components/IconButton";
import SortModal, { SortOption } from "@/components/SortModal";
import StockModule from "@/components/StockModule";
import StockSummary from "@/components/StockSummary/index";
import { Colors } from "@/constants/colors";
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Scanning, SearchNormal1 } from "iconsax-react-native";
import { useState } from "react";
import {
    ActivityIndicator, FlatList, KeyboardAvoidingView, Platform,
    RefreshControl, StyleSheet, Text, TextInput, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type StockFilter = "all" | "low" | "out";
type SortValue   = "az" | "za" | "qty_asc" | "qty_desc" | "value_desc" | "value_asc";

// ─── Constantes ──────────────────────────────────────────────────────────────

const FILTER_OPTIONS = [
    { label: 'Estoque baixo', value: 'low' as StockFilter },
    { label: 'Em falta',      value: 'out' as StockFilter },
];

const SORT_OPTIONS: SortOption[] = [
    { label: 'A → Z',         value: 'az'         },
    { label: 'Z → A',         value: 'za'         },
    { label: 'Maior estoque', value: 'qty_desc'   },
    { label: 'Menor estoque', value: 'qty_asc'    },
    { label: 'Maior valor',   value: 'value_desc' },
    { label: 'Menor valor',   value: 'value_asc'  },
];

const SORT_LABELS: Record<SortValue, string> = {
    az:         'A → Z',
    za:         'Z → A',
    qty_desc:   'Maior estoque',
    qty_asc:    'Menor estoque',
    value_desc: 'Maior valor',
    value_asc:  'Menor valor',
};

const CARD_HEIGHT = 116;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getContextLabel(filter: StockFilter, categoryValue: string): string {
    const cat = categoryValue !== 'all' ? categoryValue : null;
    if (filter === 'low') return cat ? `Estoque baixo em ${cat}` : 'Estoque baixo';
    if (filter === 'out') return cat ? `Em falta em ${cat}`      : 'Em falta';
    return cat ? cat : 'Todos em estoque';
}

// ─── Componente ──────────────────────────────────────────────────────────────

const Page = () => {
    const router       = useRouter();
    const tabBarHeight = useBottomTabBarHeight();
    const { company }  = useAuth();

    const [activeFilter,    setActiveFilter]    = useState<StockFilter>('all');
    const [search,          setSearch]          = useState('');
    const [sortValue,       setSortValue]       = useState<SortValue>('az');
    const [categoryValue,   setCategoryValue]   = useState('all');
    const [sortVisible,     setSortVisible]     = useState(false);
    const [categoryVisible, setCategoryVisible] = useState(false);
    const [scannerVisible,  setScannerVisible]  = useState(false);
    const [isRefreshing,    setIsRefreshing]    = useState(false);

    // ── Dados do WatermelonDB ──
    const { products, isLoading, error, outCount, lowCount } = useProducts({
        companyId: company?.id ?? '',
        search,
        category:  categoryValue,
        filter:    activeFilter,
        sortBy:    sortValue,
    });

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const emptyMessage = search.length > 0
        ? `Nenhum resultado para "${search}"`
        : 'Nenhum item nesta categoria';

    const contextLabel = getContextLabel(activeFilter, categoryValue);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* ── Header ── */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Controle de Estoque</Text>

                    {/* ── Search bar ── */}
                    <View style={styles.searchBar}>
                        <View style={styles.searchInput}>
                            <SearchNormal1 size={16} color={Colors.textSecondary} variant="Linear" />
                            <TextInput
                                style={styles.searchInputText}
                                placeholder="Pesquisar por nome ou código"
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
                            size={16}
                            onPress={() => setScannerVisible(true)}
                        />
                    </View>

                    {/* ── FilterTabs ── */}
                    <FilterTabs
                        options={FILTER_OPTIONS}
                        value={activeFilter}
                        onChange={setActiveFilter}
                        sortLabel={SORT_LABELS[sortValue]}
                        categoryLabel={categoryValue !== 'all' ? categoryValue : 'Categoria'}
                        onSortPress={() => setSortVisible(true)}
                        onCategoryPress={() => setCategoryVisible(true)}
                        isSortActive={sortValue !== 'az'}
                        isCategoryActive={categoryValue !== 'all'}
                    />

                    {/* ── Sumário ── */}
                    <StockSummary
                        total={products.length}
                        outCount={outCount}
                        lowCount={lowCount}
                    />
                </View>

                {/* ── Label contextual ── */}
                <Text style={styles.contextLabel}>{contextLabel}</Text>

                {/* ── Resultado da busca ── */}
                {search.length > 0 && (
                    <Text style={styles.searchResult}>
                        {products.length} resultado{products.length !== 1 ? 's' : ''} para "{search}"
                    </Text>
                )}

                {/* ── Loading ── */}
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                    </View>
                )}

                {/* ── Erro ── */}
                {error && !isLoading && (
                    <Text style={styles.errorText}>{error}</Text>
                )}

                {/* ── Lista ── */}
                {!isLoading && !error && (
                    <FlatList
                        style={styles.list}
                        contentContainerStyle={{
                            paddingBottom: tabBarHeight + 48,
                            gap: 8,
                        }}
                        data={products}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <StockModule
                                data={item}
                                onPress={() => router.push(`/inventory/${item.id}`)}
                            />
                        )}
                        getItemLayout={(_, index) => ({
                            length: CARD_HEIGHT,
                            offset: (CARD_HEIGHT + 8) * index,
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
            </KeyboardAvoidingView>

            {/* ── Modais ── */}
            <SortModal
                visible={sortVisible}
                value={sortValue}
                options={SORT_OPTIONS}
                onClose={() => setSortVisible(false)}
                onChange={(val) => setSortValue(val as SortValue)}
            />
            <CategoryModal
                visible={categoryVisible}
                value={categoryValue}
                onClose={() => setCategoryVisible(false)}
                onChange={setCategoryValue}
            />
            <BarcodeScannerModal
                visible={scannerVisible}
                onClose={() => setScannerVisible(false)}
                onNavigateToProduct={(product) => {
                    setScannerVisible(false);
                    router.push(`/inventory/${product.id}`);
                }}
                onRegisterMovement={(product) => {
                    setScannerVisible(false);
                    router.push(`/inventory/${product.id}`);
                }}
                onAddProduct={(code) => {
                    setScannerVisible(false);
                    router.push(`/cadastre?eanCode=${code}`);
                }}
            />
        </SafeAreaView>
    );
};

export default Page;

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: 16,
        paddingHorizontal: 16,
    },
    keyboardView: {
        flex: 1,
    },
    headerContainer: {
        gap: 12,
        flexShrink: 1,
        flexGrow: 0,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textPrimary,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    searchInput: {
        flex: 1,
        height: 44,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: Colors.surface,
        borderRadius: 40,
        paddingHorizontal: 16,
    },
    searchInputText: {
        flex: 1,
        fontSize: 13,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textPrimary,
    },
    list: {
        flex: 1,
        marginTop: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        textAlign: 'center',
        marginTop: 48,
        fontSize: 14,
        fontFamily: 'Satoshi_Regular',
        color: Colors.danger,
    },
    contextLabel: {
        fontSize: 13,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
        marginTop: 16,
        marginBottom: 4,
    },
    searchResult: {
        fontSize: 13,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textSecondary,
        marginTop: 4,
        marginBottom: 4,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 48,
        fontSize: 14,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textSecondary,
    },
});