import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type StockSummaryProps = {
    total: number;
    outCount: number;
    lowCount: number;
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function StockSummary({ total, outCount, lowCount }: StockSummaryProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{total} itens</Text>

            {outCount > 0 && (
                <>
                    <View style={styles.dot} />
                    <Text style={[styles.text, styles.danger]}>{outCount} em falta</Text>
                </>
            )}

            {lowCount > 0 && (
                <>
                    <View style={styles.dot} />
                    <Text style={[styles.text, styles.warning]}>{lowCount} estoque baixo</Text>
                </>
            )}
        </View>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: Colors.textMuted,
    },
    text: {
        fontSize: 12,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textMuted,
    },
    danger: {
        fontFamily: 'Satoshi_Medium',
        color: Colors.danger,
    },
    warning: {
        fontFamily: 'Satoshi_Medium',
        color: Colors.warning,
    },
});