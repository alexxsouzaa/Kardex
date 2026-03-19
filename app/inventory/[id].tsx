import IconButton from "@/components/IconButton";
import MovementModal from "@/components/MovementModal";
import CategoryModal from "@/components/CategoryModal";
import EditProductModal from "@/components/EditProductModal";
import { Colors } from "@/constants/colors";
import { useProduct } from "@/hooks/useProduct";
import { useProductMutations } from "@/hooks/useProductMutations";
import { useMovements } from "@/hooks/useMovements";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    ArrowLeft2, Barcode, Box, Truck, Tag, Chart,
    ShoppingBag, Copy, Edit2, Trash
} from "iconsax-react-native";
import { useRef, useState } from "react";
import {
    ActivityIndicator, Alert, Animated, Image, ScrollView, StyleSheet,
    Text, TouchableOpacity, View
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Constantes ───────────────────────────────────────────────────────────────

const IMAGE_HEIGHT        = 320;
const LOW_STOCK_THRESHOLD = 5;

// ─── Sub-componentes ──────────────────────────────────────────────────────────

const DetailRow = ({
    icon: Icon,
    label,
    value,
    highlight = false,
}: {
    icon: any;
    label: string;
    value: string;
    highlight?: boolean;
}) => (
    <View style={styles.detailRow}>
        <View style={styles.detailIcon}>
            <Icon size={16} color="#A9A9A9" variant="Bold" />
        </View>
        <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={[styles.detailValue, highlight && styles.detailValueHighlight]}>
                {value}
            </Text>
        </View>
        <TouchableOpacity style={styles.detailCopy}>
            <Copy size={16} color="#A9A9A9" variant="Bold" />
        </TouchableOpacity>
    </View>
);

const Divider = () => <View style={styles.divider} />;

// ─── Componente ──────────────────────────────────────────────────────────────

const Page = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [activeImage, setActiveImage] = useState(0);

    // ── Modais ──
    const [movementVisible, setMovementVisible] = useState(false);
    const [categoryVisible, setCategoryVisible] = useState(false);
    const [editVisible,     setEditVisible]     = useState(false);

    // ── Hooks de dados ──
    const { product, isLoading, error } = useProduct(id);
    const { updateProduct, deleteProduct } = useProductMutations();
    const { registerMovement }          = useMovements(id);

    // ── Loading ──
    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    // ── Erro ou não encontrado ──
    if (error || !product) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Produto não encontrado.</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backLink}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const images = product.images ?? [];

    const formattedValue = product.value.toLocaleString('pt-BR', {
        style:    'currency',
        currency: 'BRL',
    });

    const totalValue = (product.value * product.quantity).toLocaleString('pt-BR', {
        style:    'currency',
        currency: 'BRL',
    });

    // ── Status do estoque ──
    const stockStatus =
        product.quantity === 0                  ? 'Em falta' :
        product.quantity <= LOW_STOCK_THRESHOLD ? 'Estoque baixo' :
        'Normal';

    const stockStatusColor =
        product.quantity === 0                  ? Colors.danger :
        product.quantity <= LOW_STOCK_THRESHOLD ? Colors.warning :
        Colors.success;

    const stockStatusBg =
        product.quantity === 0                  ? Colors.dangerLight :
        product.quantity <= LOW_STOCK_THRESHOLD ? Colors.warningLight :
        Colors.successLight;

    // ── Animações ──
    const imageScale = scrollY.interpolate({
        inputRange:  [-100, 0],
        outputRange: [1.3, 1],
        extrapolate: 'clamp',
    });

    const backButtonBg = scrollY.interpolate({
        inputRange:  [0, IMAGE_HEIGHT - 100],
        outputRange: ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)'],
        extrapolate: 'clamp',
    });

    // ── Handlers ──
    const handleMovementConfirm = async (
        type: 'in' | 'out' | 'adjust',
        qty:  number,
        note: string
    ) => {
        await registerMovement(product, type, qty, note);
    };

    const handleCategoryConfirm = async (category: string, type: string) => {
        await updateProduct(product, { category, type });
    };

    const handleEditConfirm = async (updated: any) => {
        await updateProduct(product, updated);
    };

    const handleDelete = () => {
        Alert.alert(
            'Excluir produto',
            `Tem certeza que deseja excluir "${product.name}"? Esta ação não pode ser desfeita.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await deleteProduct(product);
                        if (success) router.back();
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.root}>
            <StatusBar style="light" />

            {/* ── Imagem com parallax ── */}
            <Animated.View
                style={[styles.imageWrapper, { transform: [{ scale: imageScale }] }]}
            >
                <Image
                    source={{ uri: images[activeImage] ?? '' }}
                    style={styles.mainImage}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.45)']}
                    style={styles.imageGradient}
                />
            </Animated.View>

            {/* ── Botão voltar ── */}
            <Animated.View style={[styles.floatingBack, { top: insets.top + 12, backgroundColor: backButtonBg }]}>
                <IconButton
                    icon={ArrowLeft2}
                    variant="Linear"
                    backgroundColor="transparent"
                    iconColor="#fff"
                    size={22}
                    onPress={() => router.back()}
                />
            </Animated.View>

            {/* ── Botão editar ── */}
            <Animated.View style={[styles.floatingEdit, { top: insets.top + 12, backgroundColor: backButtonBg }]}>
                <IconButton
                    icon={Edit2}
                    variant="Bold"
                    backgroundColor="transparent"
                    iconColor="#fff"
                    size={20}
                    onPress={() => setEditVisible(true)}
                />
            </Animated.View>

            {/* ── ScrollView ── */}
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <View style={{ height: IMAGE_HEIGHT - 32 }} />

                <View style={styles.card}>

                    {/* Nome + status */}
                    <View style={styles.nameRow}>
                        <View style={styles.nameSection}>
                            <Text style={styles.eanCode}>{product.eanCode ?? '—'}</Text>
                            <Text style={styles.productName}>{product.name}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: stockStatusBg }]}>
                            <View style={[styles.statusDot, { backgroundColor: stockStatusColor }]} />
                            <Text style={[styles.statusText, { color: stockStatusColor }]}>
                                {stockStatus}
                            </Text>
                        </View>
                    </View>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.thumbnailList}
                        >
                            {images.map((uri, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setActiveImage(index)}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={{ uri }}
                                        style={[styles.thumbnail, index === activeImage && styles.thumbnailActive]}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    <View style={styles.separator} />

                    {/* Informações do produto */}
                    <Text style={styles.sectionTitle}>Informações do produto</Text>
                    <View style={styles.infoCard}>
                        <DetailRow icon={Barcode}     label="EAN"        value={product.eanCode  ?? '—'} />
                        <Divider />
                        <DetailRow icon={Barcode}     label="Item"       value={product.id              } />
                        <Divider />
                        <DetailRow icon={ShoppingBag} label="Marca"      value={product.brand    ?? '—'} />
                        <Divider />
                        <DetailRow icon={Truck}       label="Fornecedor" value={product.supplier ?? '—'} />
                    </View>

                    {/* Categoria */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Categoria</Text>
                        <TouchableOpacity onPress={() => setCategoryVisible(true)}>
                            <Text style={styles.sectionAction}>Mover</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.infoCard}>
                        <DetailRow icon={Tag} label="Categoria" value={product.category ?? '—'} />
                        <Divider />
                        <DetailRow icon={Box} label="Tipo"      value={product.type     ?? '—'} />
                    </View>

                    {/* Estoque */}
                    <Text style={styles.sectionTitle}>Informações do estoque</Text>
                    <View style={styles.infoCard}>
                        <DetailRow icon={Box}   label="Quantidade disponível"  value={`${product.quantity} ${product.unit ?? ''}`} />
                        <Divider />
                        <DetailRow icon={Tag}   label="Valor unitário"         value={formattedValue}                              />
                        <Divider />
                        <DetailRow icon={Chart} label="Valor total em estoque" value={totalValue} highlight                        />
                    </View>

                    <View style={{ height: 100 }} />
                </View>
            </Animated.ScrollView>

            {/* ── FAB ── */}
            <View style={[styles.fabContainer, { bottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                    style={styles.deleteBtn}
                    activeOpacity={0.8}
                    onPress={handleDelete}
                >
                    <Trash size={18} color={Colors.danger} variant="Bold" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.fab}
                    activeOpacity={0.9}
                    onPress={() => setMovementVisible(true)}
                >
                    <Text style={styles.fabText}>+ Registrar movimento</Text>
                </TouchableOpacity>
            </View>

            {/* ── Modais ── */}
            <MovementModal
                visible={movementVisible}
                productName={product.name}
                currentQuantity={product.quantity}
                unit={product.unit ?? ''}
                onClose={() => setMovementVisible(false)}
                onConfirm={handleMovementConfirm}
            />
            <CategoryModal
                visible={categoryVisible}
                productName={product.name}
                currentCategory={product.category ?? undefined}
                currentType={product.type ?? undefined}
                onClose={() => setCategoryVisible(false)}
                onConfirm={handleCategoryConfirm}
            />
            <EditProductModal
                visible={editVisible}
                product={product}
                onClose={() => setEditVisible(false)}
                onConfirm={handleEditConfirm}
            />
        </View>
    );
};

export default Page;

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    root:          { flex: 1, backgroundColor: Colors.background },
    centered:      { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, backgroundColor: Colors.background },
    errorText:     { fontSize: 14, fontFamily: 'Satoshi_Regular', color: Colors.textSecondary },
    backLink:      { fontSize: 14, fontFamily: 'Satoshi_Bold', color: Colors.primary },
    imageWrapper:  { position: 'absolute', top: 0, left: 0, right: 0, height: IMAGE_HEIGHT },
    mainImage:     { width: '100%', height: '100%' },
    imageGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
    floatingBack:  { position: 'absolute', left: 16, zIndex: 10, borderRadius: 20, overflow: 'hidden' },
    floatingEdit:  { position: 'absolute', right: 16, zIndex: 10, borderRadius: 20, overflow: 'hidden' },
    card:          { backgroundColor: Colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, gap: 12, minHeight: 600 },
    nameRow:       { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
    nameSection:   { flex: 1, gap: 2 },
    eanCode:       { fontSize: 12, fontFamily: 'Satoshi_Regular', color: Colors.textSecondary },
    productName:   { fontSize: 26, fontFamily: 'Satoshi_Black', color: Colors.textPrimary, lineHeight: 30 },
    statusBadge:   { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, marginTop: 4 },
    statusDot:     { width: 6, height: 6, borderRadius: 3 },
    statusText:    { fontSize: 11, fontFamily: 'Satoshi_Medium' },
    thumbnailList: { gap: 8, paddingVertical: 4 },
    thumbnail:     { width: 52, height: 52, borderRadius: 12, backgroundColor: '#E0E0E0', opacity: 0.6 },
    thumbnailActive: { opacity: 1, borderWidth: 2, borderColor: '#A9A9A9' },
    separator:     { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sectionTitle:  { fontSize: 14, fontFamily: 'Satoshi_Medium', color: Colors.textSecondary },
    sectionAction: { fontSize: 13, fontFamily: 'Satoshi_Bold', color: Colors.primary },
    infoCard:      { borderRadius: 22, backgroundColor: Colors.surface, overflow: 'hidden' },
    detailRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, gap: 12 },
    detailIcon:    { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
    detailContent: { flex: 1, gap: 2 },
    detailLabel:   { fontSize: 13, fontFamily: 'Satoshi_Medium', color: Colors.textPrimary },
    detailValue:   { fontSize: 12, fontFamily: 'Satoshi_Regular', color: Colors.textSecondary },
    detailValueHighlight: { fontFamily: 'Satoshi_Bold', color: Colors.primary },
    detailCopy:    { padding: 4 },
    divider:       { height: 1, backgroundColor: Colors.background, marginLeft: 60 },
    fabContainer:  { position: 'absolute', left: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 8 },
    deleteBtn:     { width: 56, height: 56, borderRadius: 40, backgroundColor: Colors.dangerLight, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
    fab:           { flex: 1, backgroundColor: Colors.primary, borderRadius: 40, paddingVertical: 18, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
    fabText:       { fontSize: 15, fontFamily: 'Satoshi_Bold', color: '#fff' },
});