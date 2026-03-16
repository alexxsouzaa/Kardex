import { Colors } from "@/constants/colors";
import { ArrowDown2 } from "iconsax-react-native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type FilterOption<T extends string> = {
    label: string;
    value: T;
};

type FilterTabsProps<T extends string> = {
    options: FilterOption<T>[];
    value: T;
    onChange: (value: T) => void;
    sortLabel?: string;
    categoryLabel?: string;
    onSortPress?: () => void;
    onCategoryPress?: () => void;
    isSortActive?: boolean;
    isCategoryActive?: boolean;
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function FilterTabs<T extends string>({
    options,
    value,
    onChange,
    sortLabel = 'Ordenar',
    categoryLabel = 'Categoria',
    onSortPress,
    onCategoryPress,
    isSortActive = false,
    isCategoryActive = false,
}: FilterTabsProps<T>) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {/* ── Pill: Ordenar ── */}
            {onSortPress && (
                <TouchableOpacity
                    style={[
                        styles.pill,
                        styles.pillDropdown,
                        isSortActive && styles.pillDropdownActive,
                        { borderColor: isSortActive ? Colors.primary : Colors.border },
                    ]}
                    onPress={onSortPress}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Ordenar: ${sortLabel}`}
                >
                    <Text style={[
                        styles.pillDropdownText,
                        isSortActive && styles.pillDropdownTextActive,
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

            {/* ── Pill: Categoria ── */}
            {onCategoryPress && (
                <TouchableOpacity
                    style={[
                        styles.pill,
                        styles.pillDropdown,
                        isCategoryActive && styles.pillDropdownActive,
                        { borderColor: isCategoryActive ? Colors.primary : Colors.border },
                    ]}
                    onPress={onCategoryPress}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Categoria: ${categoryLabel}`}
                >
                    <Text style={[
                        styles.pillDropdownText,
                        isCategoryActive && styles.pillDropdownTextActive,
                    ]}>
                        {categoryLabel}
                    </Text>
                    <ArrowDown2
                        size={12}
                        color={isCategoryActive ? Colors.primary : Colors.textSecondary}
                        variant="Bold"
                    />
                </TouchableOpacity>
            )}

            {/* ── Pills de filtro ── */}
            {options.map((option) => {
                const isActive = option.value === value;
                return (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.pill,
                            isActive && styles.pillActive,
                            { borderColor: isActive ? Colors.textPrimary : Colors.border },
                        ]}
                        onPress={() => onChange(option.value)}
                        activeOpacity={0.7}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: isActive }}
                        accessibilityLabel={option.label}
                    >
                        <Text style={[
                            styles.pillText,
                            isActive && styles.pillTextActive,
                        ]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
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
        borderWidth: 1.5,
        backgroundColor: Colors.surface,
        borderColor: Colors.border,
    },

    // Dropdown (Ordenar / Categoria) — inativo
    pillDropdown: {
        backgroundColor: Colors.surface,
    },

    // Dropdown ativo — fundo levemente laranja
    pillDropdownActive: {
        backgroundColor: Colors.primaryLight,
    },
    pillDropdownText: {
        fontSize: 13,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
    },
    pillDropdownTextActive: {
        fontFamily: 'Satoshi_Bold',
        color: Colors.primary,
    },

    // Filtro ativo — fundo escuro
    pillActive: {
        backgroundColor: Colors.textPrimary,
    },
    pillText: {
        fontSize: 13,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
    },
    pillTextActive: {
        fontFamily: 'Satoshi_Bold',
        color: Colors.surface,
    },
});