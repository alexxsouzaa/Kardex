import { Colors } from "@/constants/colors";
import { LOW_STOCK_THRESHOLD } from "@/constants/stockData";
import { ArrowRight2, ShoppingCart } from "iconsax-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type StockItem = {
    id: string;
    name: string;
    eanCode: string;
    quantity: number;
    value: number;
    unit: string;
    category?: string;
    type?: string;
    icon?: any;
    images?: string[];
};

type StockModuleProps = {
    data: StockItem;
    onPress?: () => void;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStockStatus(quantity: number) {
    if (quantity === 0)                  return { color: Colors.danger,  bg: Colors.dangerLight,  label: 'Em Falta'      };
    if (quantity <= LOW_STOCK_THRESHOLD) return { color: Colors.warning, bg: Colors.warningLight, label: 'Estoque baixo' };
    return                                      { color: null,           bg: null,                label: null            };
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function StockModule({ data, onPress }: StockModuleProps) {
    const Icon = data.icon ?? ShoppingCart;
    const firstImage = data.images?.[0];
    const status = getStockStatus(data.quantity);

    const totalValue = (data.value * data.quantity).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                pressed && styles.containerPressed,
            ]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${data.name}, ${totalValue}, ${data.quantity} ${data.unit}`}
            accessibilityHint="Toque para ver detalhes do produto"
        >
            <View style={styles.top}>

                {/* Imagem */}
                <View style={styles.imageContainer}>
                    {firstImage ? (
                        <Image
                            source={{ uri: firstImage }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    ) : (
                        <Icon size={28} color={Colors.textMuted} variant="Bold" />
                    )}
                </View>

                {/* Info */}
                <View style={styles.info}>

                    {/* Nome + badge de status inline */}
                    <View style={styles.nameRow}>
                        <Text style={styles.name} numberOfLines={1}>{data.name}</Text>
                        {status.label && (
                            <View style={[styles.statusBadge, { backgroundColor: status.bg! }]}>
                                <Text style={[styles.statusText, { color: status.color! }]}>
                                    {status.label}
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.eanCode}>Item: {data.eanCode}</Text>
                    <Text style={styles.value}>{totalValue}</Text>

                    {/* Badges inferiores */}
                    <View style={styles.badgeGroup}>
                        <Text style={styles.badgeText}>{data.quantity} {data.unit}</Text>
                        {(data.category || data.type) && (
                            <>
                                <View style={styles.badgeDivider} />
                                <Text style={styles.badgeText}>
                                    {[data.category, data.type].filter(Boolean).join(' • ')}
                                </Text>
                            </>
                        )}
                    </View>
                </View>

                {/* Seta solta */}
                <ArrowRight2 size={16} color={Colors.textMuted} variant="Linear" />
            </View>
        </Pressable>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 8,
        shadowColor: "#00000055",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    containerPressed: {
        opacity: 0.82,
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    imageContainer: {
        width: 76,
        height: 76,
        borderRadius: 16,
        backgroundColor: Colors.background,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    info: {
        flex: 1,
        gap: 2,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
    },
    name: {
        fontSize: 14,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
        flexShrink: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 10,
        fontFamily: 'Satoshi_Bold',
    },
    eanCode: {
        fontSize: 11,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textSecondary,
    },
    value: {
        fontSize: 12,
        fontFamily: 'Satoshi_Bold',
        color: Colors.primary,
        marginBottom: 2,
    },
    badgeGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.background,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 11,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
    },
    badgeDivider: {
        width: 1,
        height: 10,
        backgroundColor: Colors.border,
    },
});