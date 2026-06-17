import { Colors } from "@/constants/colors";
import { CATEGORY_ICONS } from "@/constants/stockData";
import { ArrowDown2 } from "iconsax-react-native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type FilterOption<T extends string> = {
    label: string;
    value: T;
};

type FilterTabsProps<T extends string> = {
    // Linha 1 — categorias
    categoryValue:    string;
    onCategoryChange: (value: string) => void;

    // Linha 2 — ordenação + filtros de status
    options:          FilterOption<T>[];
    value:            T;
    onChange:         (value: T) => void;
    sortLabel?:       string;
    onSortPress?:     () => void;
    isSortActive?:    boolean;
};

// ─── Constantes ──────────────────────────────────────────────────────────────

const CATEGORIES = [
    { label: 'Todos', value: 'all' },
    ...Object.keys(CATEGORY_ICONS).map((cat) => ({ label: cat, value: cat })),
];

// ─── Componente ──────────────────────────────────────────────────────────────

export default function FilterTabs<T extends string>({
    categoryValue,
    onCategoryChange,
    options,
    value,
    onChange,
    sortLabel    = 'Ordenar',
    onSortPress,
    isSortActive = false,
}: FilterTabsProps<T>) {
    return (
        <View style={styles.wrapper}>

            {/* ── Linha 1: Categorias ── */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.row}
            >
                {CATEGORIES.map((cat) => {
                    const isActive = categoryValue === cat.value;
                    return (
                        <TouchableOpacity
                            key={cat.value}
                            style={[styles.pill, isActive && styles.pillActiveDark]}
                            onPress={() => onCategoryChange(cat.value)}
                            activeOpacity={0.7}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: isActive }}
                        >
                            <Text style={[styles.pillText, isActive && styles.pillTextActiveDark]}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* ── Linha 2: Ordenação + filtros de status ── */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.row}
            >
                {/* Pill de ordenação */}
                {onSortPress && (
                    <TouchableOpacity
                        style={[
                            styles.pill,
                            styles.pillBordered,
                            isSortActive && styles.pillBorderedActive,
                        ]}
                        onPress={onSortPress}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.pillText,
                            isSortActive && styles.pillTextActiveOrange,
                        ]}>
                            {sortLabel}
                        </Text>
                        <ArrowDown2
                            size={12}
                            color={isSortActive ? Colors.primary : Colors.textSecondary}
                            variant="Bold"
                        />
                    </TouchableOpacity>
                )}

                {/* Pills de filtro de status */}
                {options.map((option) => {
                    const isActive = option.value === value;
                    return (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.pill,
                                styles.pillBordered,
                                isActive && styles.pillBorderedActive,
                            ]}
                            onPress={() => onChange(option.value)}
                            activeOpacity={0.7}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: isActive }}
                        >
                            <Text style={[
                                styles.pillText,
                                isActive && styles.pillTextActiveOrange,
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    wrapper: {
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 2,
    },

    // Base de todos os pills
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.surface,
    },

    // Linha 1 — categoria ativa (fundo escuro)
    pillActiveDark: {
        backgroundColor: Colors.textPrimary,
    },

    // Linha 2 — pills com borda
    pillBordered: {
        borderWidth: 1.5,
        borderColor: Colors.border,
    },
    pillBorderedActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight,
    },

    pillText: {
        fontSize: 13,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
    },
    pillTextActiveDark: {
        fontFamily: 'Satoshi_Bold',
        color: Colors.surface,
    },
    pillTextActiveOrange: {
        fontFamily: 'Satoshi_Bold',
        color: Colors.primary,
    },
});