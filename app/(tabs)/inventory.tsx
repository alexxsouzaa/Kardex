import FilterTabs from "@/components/FilterTabs";
import IconButton from "@/components/IconButton";
import StockModule from "@/components/StockModule";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft2, Scanning, SearchNormal1, Setting4 } from "iconsax-react-native";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type StockFilter = "all" | "low" | "out";

type StockItem = {
    id: string;
    name: string;
    eanCode: string;
    quantity: number;
    value: number;
    unit: string;
};

// ─── Dados mockados ───────────────────────────────────────────────────────────

const STOCK_DATA: StockItem[] = [
    { id: '1', name: 'Arroz Branco', eanCode: '13564875', quantity: 874, value: 125.99, unit: 'Quilos' },
    { id: '2', name: 'Feijão Preto', eanCode: '98765432', quantity: 3, value: 18.50, unit: 'Quilos' },
    { id: '3', name: 'Azeite', eanCode: '11223344', quantity: 0, value: 45.00, unit: 'Litros' },
    { id: '4', name: 'Macarrão', eanCode: '55667788', quantity: 2, value: 8.90, unit: 'Pacotes' },
    { id: '5', name: 'Pâo', eanCode: '55667788', quantity: 2, value: 8.90, unit: 'Pacotes' },
    { id: '6', name: 'Biscoito', eanCode: '55667788', quantity: 2, value: 8.90, unit: 'Pacotes' },
    { id: '7', name: 'Leite Integral', eanCode: '78912345', quantity: 15, value: 6.50, unit: 'Litros' },
    { id: '8', name: 'Açúcar Refinado', eanCode: '78954321', quantity: 10, value: 4.20, unit: 'Quilos' },
    { id: '9', name: 'Café em Pó', eanCode: '78961234', quantity: 5, value: 12.90, unit: 'Pacotes' },
    { id: '10', name: 'Óleo de Soja', eanCode: '78971234', quantity: 20, value: 7.80, unit: 'Litros' },
    { id: '11', name: 'Sal Refinado', eanCode: '78981234', quantity: 8, value: 2.50, unit: 'Quilos' },
    { id: '12', name: 'Farinha de Trigo', eanCode: '78991234', quantity: 12, value: 5.50, unit: 'Quilos' },
    { id: '13', name: 'Detergente', eanCode: '78901235', quantity: 4, value: 3.80, unit: 'Frascos' },
    { id: '14', name: 'Sabão em Pó', eanCode: '78901236', quantity: 7, value: 25.00, unit: 'Caixas' },
    { id: '15', name: 'Amaciante', eanCode: '78901237', quantity: 2, value: 15.90, unit: 'Litros' },
    { id: '16', name: 'Papel Higiênico', eanCode: '78901238', quantity: 1, value: 18.00, unit: 'Pacotes' },
    { id: '17', name: 'Creme Dental', eanCode: '78901239', quantity: 6, value: 4.50, unit: 'Tubos' },
    { id: '18', name: 'Sabonete', eanCode: '78901240', quantity: 25, value: 2.20, unit: 'Unidades' },
    { id: '19', name: 'Shampoo', eanCode: '78901241', quantity: 3, value: 14.50, unit: 'Frascos' },
    { id: '20', name: 'Condicionador', eanCode: '78901242', quantity: 3, value: 16.50, unit: 'Frascos' },
    { id: '21', name: 'Esponja de Aço', eanCode: '78901243', quantity: 10, value: 5.90, unit: 'Pacotes' },
    { id: '22', name: 'Pano de Prato', eanCode: '78901244', quantity: 5, value: 8.00, unit: 'Unidades' },
    { id: '23', name: 'Bolacha Recheada', eanCode: '78901245', quantity: 0, value: 3.50, unit: 'Pacotes' },
    { id: '24', name: 'Refrigerante 2L', eanCode: '78901246', quantity: 15, value: 9.90, unit: 'Garrafas' },
    { id: '25', name: 'Suco de Caixa', eanCode: '78901247', quantity: 8, value: 5.50, unit: 'Litros' },
    { id: '26', name: 'Água Mineral', eanCode: '78901248', quantity: 50, value: 2.50, unit: 'Garrafas' },
    { id: '27', name: 'Chocolate em Barra', eanCode: '78901249', quantity: 12, value: 6.90, unit: 'Unidades' },
    { id: '28', name: 'Iogurte Natural', eanCode: '78901250', quantity: 4, value: 3.20, unit: 'Potes' },
    { id: '29', name: 'Manteiga', eanCode: '78901251', quantity: 2, value: 12.50, unit: 'Potes' },
    { id: '30', name: 'Queijo Mussarela', eanCode: '78901252', quantity: 1, value: 45.90, unit: 'Quilos' },
];

const LOW_STOCK_THRESHOLD = 5;

const FILTER_OPTIONS = [
    { label: 'Todos', value: 'all' as StockFilter },
    { label: 'Estoque baixo', value: 'low' as StockFilter },
    { label: 'Em falta', value: 'out' as StockFilter },
];

// ─── Componente ──────────────────────────────────────────────────────────────

const Page = () => {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<StockFilter>('all');
    const [search, setSearch] = useState('');

    const filteredData = STOCK_DATA.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
            activeFilter === 'all' ||
            (activeFilter === 'low' && item.quantity > 0 && item.quantity <= LOW_STOCK_THRESHOLD) ||
            (activeFilter === 'out' && item.quantity === 0);
        return matchesSearch && matchesFilter;
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.headerContainer}>
                {/* ── Título ── */}
                <View style={styles.header}>
                    <IconButton
                        icon={ArrowLeft2}
                        variant="Linear"
                        backgroundColor="#fff"
                        size={24}
                        onPress={() => router.back()}
                    />
                    <Text style={styles.headerTitle}>Controle de Estoque</Text>
                </View>

                {/* ── Barra de pesquisa ── */}
                <View style={styles.searchBar}>
                    <View style={styles.searchInput}>
                        <View style={styles.searchIcon}>
                            <SearchNormal1 size="16" color="#727272" variant="Bold" />
                            <TextInput
                                style={styles.searchInputText}
                                placeholder="Pesquisar..."
                                placeholderTextColor="#727272"
                                maxLength={55}
                                returnKeyType="search"
                                value={search}
                                onChangeText={setSearch}
                            />
                        </View>
                        <IconButton icon={Scanning} variant="Bold" backgroundColor="#fff" iconColor="#727272" size={16} />
                    </View>
                    <IconButton icon={Setting4} variant="Bold" backgroundColor="#fff" iconColor="#727272" size={16} />
                </View>

                {/* ── Filtros ── */}
                <FilterTabs
                    options={FILTER_OPTIONS}
                    value={activeFilter}
                    onChange={setActiveFilter}
                />
            </View>

            {/* ── Resultado da busca ── */}
            {search.length > 0 && (
                <Text style={styles.searchResult}>
                    Resultados para "{search}"
                </Text>
            )}

            {/* ── Lista de produtos ── */}
            <FlatList
                style={{ marginTop: search.length > 0 ? 8 : 16 }}
                contentContainerStyle={{ paddingBottom: 100, gap: 8 }}
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <StockModule
                        data={item}
                        onPress={() => router.push({ pathname: '/(tabs)/inventory' })} // rota temporária
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Nenhum item encontrado.</Text>
                }
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default Page;

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#F1F2F4',
        padding: 16,
    },
    headerContainer: {
        flexDirection: "column",
        alignItems: 'flex-start',
        width: "100%",
        gap: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        width: "100%",
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_600SemiBold',
        color: "#292D32",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        width: "100%",
    },
    searchInput: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 40,
        paddingLeft: 16,
        paddingRight: 8,
    },
    searchInputText: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#292D32',
        width: "80%",
    },
    searchIcon: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    searchResult: {
        fontSize: 13,
        fontFamily: 'Poppins_400Regular',
        color: '#727272',
        marginTop: 16,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 48,
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#727272',
    },
});