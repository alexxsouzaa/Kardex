import { Colors } from "@/constants/colors";
import { CATEGORY_ICONS } from "@/constants/stockData";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FormField from "./../FormField";

// ─── Tipos ───────────────────────────────────────────────────────────────────

const CATEGORIES   = Object.keys(CATEGORY_ICONS);

const TYPES_BY_CATEGORY: Record<string, string[]> = {
    'Alimento': ['Perecível', 'Não Perecível'],
    'Bebida':   ['Perecível', 'Não Perecível'],
    'Limpeza':  ['Químico',   'Utensílio'    ],
    'Higiene':  ['Cosmético', 'Descartável'  ],
};

type ProductCategorySectionProps = {
    category:         string;
    type:             string;
    brand:            string;
    supplier:         string;
    onChangeCategory: (v: string) => void;
    onChangeType:     (v: string) => void;
    onChangeBrand:    (v: string) => void;
    onChangeSupplier: (v: string) => void;
    errors:           Partial<Record<'category', string>>;
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function ProductCategorySection({
    category, type, brand, supplier,
    onChangeCategory, onChangeType, onChangeBrand, onChangeSupplier,
    errors,
}: ProductCategorySectionProps) {
    const availableTypes = TYPES_BY_CATEGORY[category] ?? [];

    const handleCategoryChange = (cat: string) => {
        onChangeCategory(cat);
        // Reseta tipo se não compatível
        const types = TYPES_BY_CATEGORY[cat] ?? [];
        if (!types.includes(type)) onChangeType(types[0] ?? '');
    };

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categoria e fornecedor</Text>

            {/* Categoria */}
            <View style={styles.group}>
                <Text style={styles.label}>
                    Categoria <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.categoryGrid}>
                    {CATEGORIES.map((cat) => {
                        const Icon     = CATEGORY_ICONS[cat];
                        const isActive = category === cat;
                        return (
                            <TouchableOpacity
                                key={cat}
                                style={[styles.categoryCard, isActive && styles.categoryCardActive]}
                                onPress={() => handleCategoryChange(cat)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.categoryIcon, isActive && styles.categoryIconActive]}>
                                    <Icon size={18} color={isActive ? Colors.primary : Colors.textSecondary} variant="Bold" />
                                </View>
                                <Text style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                {errors.category && <Text style={styles.error}>{errors.category}</Text>}
            </View>

            {/* Tipo */}
            {availableTypes.length > 0 && (
                <View style={styles.group}>
                    <Text style={styles.label}>Tipo</Text>
                    <View style={styles.typeRow}>
                        {availableTypes.map((t) => {
                            const isActive = type === t;
                            return (
                                <TouchableOpacity
                                    key={t}
                                    style={[styles.typePill, isActive && styles.typePillActive]}
                                    onPress={() => onChangeType(t)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.typeText, isActive && styles.typeTextActive]}>
                                        {t}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            )}

            {/* Marca */}
            <FormField
                label="Marca"
                placeholder="Ex: Nestlé"
                value={brand}
                onChangeText={onChangeBrand}
                hint="Opcional"
            />

            {/* Fornecedor */}
            <FormField
                label="Fornecedor"
                placeholder="Ex: Distribuidora RJ"
                value={supplier}
                onChangeText={onChangeSupplier}
                hint="Opcional"
            />
        </View>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    section: {
        gap: 16,
    },
    sectionTitle: {
        fontSize: 15,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
    },
    group: {
        gap: 8,
    },
    label: {
        fontSize: 13,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
    },
    required: {
        color: Colors.danger,
    },
    error: {
        fontSize: 11,
        fontFamily: 'Satoshi_Regular',
        color: Colors.danger,
    },

    // Categoria
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
    },
    categoryCardActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight,
    },
    categoryIcon: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryIconActive: {
        backgroundColor: '#FFE8E2',
    },
    categoryLabel: {
        fontSize: 13,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
    },
    categoryLabelActive: {
        fontFamily: 'Satoshi_Bold',
        color: Colors.primary,
    },

    // Tipo
    typeRow: {
        flexDirection: 'row',
        gap: 8,
    },
    typePill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
    },
    typePillActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight,
    },
    typeText: {
        fontSize: 13,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
    },
    typeTextActive: {
        fontFamily: 'Satoshi_Bold',
        color: Colors.primary,
    },
});
