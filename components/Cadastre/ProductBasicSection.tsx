import { Colors } from "@/constants/colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScanBarcode } from "iconsax-react-native";
import FormField from "./FormField";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type ProductBasicSectionProps = {
    name:       string;
    eanCode:    string;
    lote:       string;
    onChangeName:    (v: string) => void;
    onChangeEan:     (v: string) => void;
    onChangeLote:    (v: string) => void;
    onScanPress:     () => void;
    errors:     Partial<Record<'name' | 'eanCode', string>>;
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function ProductBasicSection({
    name, eanCode, lote,
    onChangeName, onChangeEan, onChangeLote,
    onScanPress, errors,
}: ProductBasicSectionProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações básicas</Text>

            <FormField
                label="Nome do produto"
                required
                placeholder="Ex: Arroz Branco"
                value={name}
                onChangeText={onChangeName}
                error={errors.name}
            />

            {/* EAN com botão de scanner */}
            <View style={styles.eanRow}>
                <View style={{ flex: 1 }}>
                    <FormField
                        label="Código EAN"
                        required
                        placeholder="Ex: 13564875"
                        value={eanCode}
                        onChangeText={onChangeEan}
                        keyboardType="numeric"
                        error={errors.eanCode}
                    />
                </View>
                <TouchableOpacity
                    style={styles.scanBtn}
                    onPress={onScanPress}
                    activeOpacity={0.8}
                >
                    <ScanBarcode size={20} color={Colors.primary} variant="Bold" />
                </TouchableOpacity>
            </View>

            <FormField
                label="Lote"
                placeholder="Ex: LOT-2024-001"
                value={lote}
                onChangeText={onChangeLote}
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
    eanRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },
    scanBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
    },
});