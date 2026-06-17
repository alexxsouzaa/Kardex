import { Colors } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";
import FormField from "./../FormField";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type ProductValueSectionProps = {
    value:          string;
    expiryDate:     string;
    onChangeValue:  (v: string) => void;
    onChangeExpiry: (v: string) => void;
    errors:         Partial<Record<'value', string>>;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Formata input como DD/MM/AAAA
function formatDate(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function ProductValueSection({
    value, expiryDate,
    onChangeValue, onChangeExpiry,
    errors,
}: ProductValueSectionProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Valor e validade</Text>

            <FormField
                label="Valor unitário"
                required
                placeholder="0,00"
                value={value}
                onChangeText={onChangeValue}
                keyboardType="decimal-pad"
                prefix="R$"
                error={errors.value}
            />

            <FormField
                label="Data de validade"
                placeholder="DD/MM/AAAA"
                value={expiryDate}
                onChangeText={(v) => onChangeExpiry(formatDate(v))}
                keyboardType="numeric"
                hint="Opcional"
                maxLength={10}
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
});