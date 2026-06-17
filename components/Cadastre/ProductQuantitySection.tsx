import { Colors } from "@/constants/colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FormField from "./FormField";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type PackagingType = "unidade" | "caixa" | "palete";

const PACKAGING_OPTIONS: { label: string; value: PackagingType; hint: string }[] = [
    { label: "Unidade",  value: "unidade", hint: "Item individual"    },
    { label: "Caixa",    value: "caixa",   hint: "Conjunto de itens"  },
    { label: "Palete",   value: "palete",  hint: "Lote grande"        },
];

const UNIT_OPTIONS = ["Unidades", "Quilos", "Litros", "Metros", "Caixas", "Pacotes", "Garrafas", "Frascos"];

type ProductQuantitySectionProps = {
    quantity:      string;
    unit:          string;
    packaging:     PackagingType;
    onChangeQty:   (v: string) => void;
    onChangeUnit:  (v: string) => void;
    onChangePkg:   (v: PackagingType) => void;
    errors:        Partial<Record<'quantity' | 'unit', string>>;
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function ProductQuantitySection({
    quantity, unit, packaging,
    onChangeQty, onChangeUnit, onChangePkg,
    errors,
}: ProductQuantitySectionProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantidade</Text>

            {/* Tipo de embalagem */}
            <View style={styles.group}>
                <Text style={styles.label}>Tipo de embalagem</Text>
                <View style={styles.packagingRow}>
                    {PACKAGING_OPTIONS.map((opt) => {
                        const isActive = packaging === opt.value;
                        return (
                            <TouchableOpacity
                                key={opt.value}
                                style={[styles.packagingCard, isActive && styles.packagingCardActive]}
                                onPress={() => onChangePkg(opt.value)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.packagingLabel, isActive && styles.packagingLabelActive]}>
                                    {opt.label}
                                </Text>
                                <Text style={[styles.packagingHint, isActive && styles.packagingHintActive]}>
                                    {opt.hint}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Quantidade */}
            <FormField
                label="Quantidade inicial"
                required
                placeholder="0"
                value={quantity}
                onChangeText={onChangeQty}
                keyboardType="numeric"
                error={errors.quantity}
            />

            {/* Unidade de medida */}
            <View style={styles.group}>
                <Text style={styles.label}>Unidade de medida <Text style={styles.required}>*</Text></Text>
                <View style={styles.unitGrid}>
                    {UNIT_OPTIONS.map((u) => {
                        const isActive = unit === u;
                        return (
                            <TouchableOpacity
                                key={u}
                                style={[styles.unitPill, isActive && styles.unitPillActive]}
                                onPress={() => onChangeUnit(u)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.unitText, isActive && styles.unitTextActive]}>
                                    {u}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                {errors.unit && <Text style={styles.error}>{errors.unit}</Text>}
            </View>
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

    // Embalagem
    packagingRow: {
        flexDirection: 'row',
        gap: 8,
    },
    packagingCard: {
        flex: 1,
        padding: 12,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
        gap: 2,
    },
    packagingCardActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight,
    },
    packagingLabel: {
        fontSize: 13,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textSecondary,
    },
    packagingLabelActive: {
        color: Colors.primary,
    },
    packagingHint: {
        fontSize: 10,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textMuted,
    },
    packagingHintActive: {
        color: Colors.primary,
    },

    // Unidade
    unitGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    unitPill: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
    },
    unitPillActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight,
    },
    unitText: {
        fontSize: 13,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
    },
    unitTextActive: {
        fontFamily: 'Satoshi_Bold',
        color: Colors.primary,
    },
});