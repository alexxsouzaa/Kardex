import FilterTabs from "@/components/FilterTabs";
import IconButton from "@/components/IconButton";
import CategoryModal from "@/components/CategoryModal";
import SortModal, { SortOption } from "@/components/SortModal";
import StockModule from "@/components/StockModule";
import { Colors } from "@/constants/colors";
import { LOW_STOCK_THRESHOLD, STOCK_DATA } from "@/constants/stockData";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Scanning, SearchNormal1 } from "iconsax-react-native";
import { useMemo, useState } from "react";
import {
    FlatList, KeyboardAvoidingView, Platform,
    RefreshControl, StyleSheet, Text, TextInput, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type StockFilter = "all" | "low" | "out";
type SortValue = "az" | "za" | "qty_asc" | "qty_desc" | "value_desc" | "value_asc";

// ─── Constantes ──────────────────────────────────────────────────────────────

const FILTER_OPTIONS = [
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

const CARD_HEIGHT = 116;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getContextLabel(filter: StockFilter, categoryValue: string): string {
    const cat = categoryValue !== 'all' ? categoryValue : null;
    if (filter === 'low') return cat ? `Estoque baixo em ${cat}` : 'Estoque baixo';
    if (filter === 'out') return cat ? `Em falta em ${cat}` : 'Em falta';
    return cat ? cat : 'Todos em estoque';
}

// ─── Componente ──────────────────────────────────────────────────────────────

const Page = () => {
    const router = useRouter();
    const tabBarHeight = useBottomTabBarHeight();

    const [activeFilter, setActiveFilter] = useState<StockFilter>('all');
    const [search, setSearch] = useState('');
    const [sortValue, setSortValue] = useState<SortValue>('az');
    const [categoryValue, setCategoryValue] = useState('all');
    const [sortVisible, setSortVisible] = useState(false);
    const [categoryVisible, setCategoryVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const filteredData = useMemo(() => {
        const filtered = STOCK_DATA.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
            const matchesFilter =
                activeFilter === 'all' ||
                (activeFilter === 'low' && item.quantity > 0 && item.quantity <= LOW_STOCK_THRESHOLD) ||
                (activeFilter === 'out' && item.quantity === 0);
            const matchesCategory = categoryValue === 'all' || item.category === categoryValue;
            return matchesSearch && matchesFilter && matchesCategory;
        });

        return [...filtered].sort((a, b) => {
            switch (sortValue) {
                case 'az': return a.name.localeCompare(b.name);
                case 'za': return b.name.localeCompare(a.name);
                case 'qty_asc': return a.quantity - b.quantity;
                case 'qty_desc': return b.quantity - a.quantity;
                case 'value_desc': return b.value - a.value;
                case 'value_asc': return a.value - b.value;
                default: return 0;
            }
        });
    }, [search, activeFilter, sortValue, categoryValue]);

    const emptyMessage = search.length > 0
        ? `Nenhum resultado para "${search}"`
        : 'Nenhum item nesta categoria';

    const contextLabel = getContextLabel(activeFilter, categoryValue);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
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
                            size={16}
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
                </View>

                {/* ── Label contextual ── */}
                <Text style={styles.contextLabel}>{contextLabel}</Text>

                {/* ── Resultado da busca ── */}
                {search.length > 0 && (
                    <Text style={styles.searchResult}>
                        {filteredData.length} resultado{filteredData.length !== 1 ? 's' : ''} para "{search}"
                    </Text>
                )}

                {/* ── Lista ── */}
                <FlatList
                    style={{ marginTop: 8 }}
                    contentContainerStyle={{
                        paddingBottom: tabBarHeight + 48,
                        gap: 8,
                    }}
                    data={filteredData}
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
            </KeyboardAvoidingView>

            {/* ── Modal de ordenação ── */}
            <SortModal
                visible={sortVisible}
                value={sortValue}
                options={SORT_OPTIONS}
                onClose={() => setSortVisible(false)}
                onChange={(val) => setSortValue(val as SortValue)}
            />

            {/* ── Modal de categoria ── */}
            <CategoryModal
                visible={categoryVisible}
                value={categoryValue}
                onClose={() => setCategoryVisible(false)}
                onChange={setCategoryValue}
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
    headerContainer: {
        gap: 12,
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