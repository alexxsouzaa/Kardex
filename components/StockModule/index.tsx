import { Colors } from "@/constants/colors";
import { ArrowRight2, ShoppingCart, Barcode } from "iconsax-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

// ─── Constante local ─────────────────────────────────────────────────────────

const LOW_STOCK_THRESHOLD = 5;

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type StockItemData = {
    id:        string;
    name:      string;
    eanCode?:  string | null;
    quantity:  number;
    value:     number;
    unit?:     string | null;
    category?: string | null;
    type?:     string | null;
    icon?:     any;
    images?:   string[] | null;
    imagesRaw?: string | null;
};

type StockModuleProps = {
    data:     StockItemData;
    onPress?: () => void;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStockStatus(quantity: number) {
    if (quantity === 0)                  return { color: Colors.danger,  bg: Colors.dangerLight,  label: 'Em Falta'      };
    if (quantity <= LOW_STOCK_THRESHOLD) return { color: Colors.warning, bg: Colors.warningLight, label: 'Estoque baixo' };
    return                                      { color: null,           bg: null,                label: null            };
}

function getImages(data: StockItemData): string[] {
    if (Array.isArray(data.images)) {
        return data.images.filter((uri) => uri?.trim());
    }

    if (typeof data.imagesRaw === 'string') {
        try {
            const parsed = JSON.parse(data.imagesRaw);
            return Array.isArray(parsed)
                ? parsed.filter((uri) => typeof uri === 'string' && uri.trim())
                : [];
        } catch {
            return [];
        }
    }

    return [];
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function StockModule({ data, onPress }: StockModuleProps) {
    const Icon       = data.icon ?? ShoppingCart;
    const images     = getImages(data);
    const firstImage = images[0];
    const status     = getStockStatus(data.quantity);

    const totalValue = (data.value * data.quantity).toLocaleString('pt-BR', {
        style:    'currency',
        currency: 'BRL',
    });

    const categoryLabel = [data.category, data.type].filter(Boolean).join(' • ');

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                pressed && styles.containerPressed,
            ]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${data.name}, ${totalValue}, ${data.quantity} ${data.unit}`}
        >
            <View style={styles.inner}>

                {/* ── Imagem ── */}
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

                {/* ── Info ── */}
                <View style={styles.info}>

                    {/* Badge categoria+tipo no topo */}
                    {categoryLabel ? (
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{categoryLabel}</Text>
                        </View>
                    ) : null}

                    {/* Nome */}
                    <Text style={styles.name} numberOfLines={1}>{data.name}</Text>

                    {/* EAN + valor + badge status */}
                    <View style={styles.metaRow}>
                        <Barcode size={10} color={Colors.textSecondary} variant="Bold" />
                        <Text style={styles.meta}>
                            {data.eanCode ?? '—'} • {totalValue}
                        </Text>
                        {status.label && (
                            <View style={[styles.statusBadge, { backgroundColor: status.bg! }]}>
                                <Text style={[styles.statusText, { color: status.color! }]}>
                                    {status.label}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Disponível */}
                    <Text style={styles.quantity}>
                        Disponível: {data.quantity} {data.unit ?? ''}
                    </Text>
                </View>

                {/* ── Seta ── */}
                <ArrowRight2 size={16} color={Colors.textMuted} variant="Linear" />
            </View>
        </Pressable>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
    },
    containerPressed: {
        opacity: 0.82,
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 16,
    },
    imageContainer: {
        width: 72,
        height: 72,
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
        gap: 4,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.primaryLight,
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    categoryText: {
        fontSize: 10,
        fontFamily: 'Satoshi_Medium',
        color: Colors.primary,
    },
    name: {
        fontSize: 14,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
    },
    meta: {
        fontSize: 11,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontFamily: 'Satoshi_Bold',
    },
    quantity: {
        fontSize: 11,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textSecondary,
    },
});
