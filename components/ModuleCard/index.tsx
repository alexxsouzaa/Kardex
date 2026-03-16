import { Text, StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import { Colors } from "@/constants/colors";

// ─── Constantes ──────────────────────────────────────────────────────────────

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 16 * 2; // padding horizontal da tela
const GRID_GAP = 8 * 2;  // 2 gaps entre 3 colunas
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING - GRID_GAP) / 3;

// ─── Tipos ───────────────────────────────────────────────────────────────────

type ModuleCardProps = {
    title: string;
    icon?: any;
    iconColor?: string;
    iconBg?: string;
    backgroundColor?: string;
    onPress?: () => void;
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function ModuleCard({
    title,
    icon: Icon,
    iconColor = Colors.textPrimary,
    iconBg = Colors.background,
    backgroundColor = Colors.surface,
    onPress,
}: ModuleCardProps) {
    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor }]}
            activeOpacity={0.7}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={title}
        >
            {Icon && (
                <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
                    <Icon size={20} color={iconColor} variant="Bold" />
                </View>
            )}

            <Text style={styles.text} numberOfLines={2}>{title}</Text>
        </TouchableOpacity>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: 110,
        padding: 14,
        borderRadius: 20,
        justifyContent: "space-between",
        alignItems: "flex-start",
        shadowColor: "#00000055",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 12,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
        lineHeight: 16,
    },
});