import { Colors } from "@/constants/colors";
import { CATEGORY_ICONS } from "@/constants/stockData";
import { TickCircle } from "iconsax-react-native";
import { useEffect } from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type CategoryModalProps = {
    visible: boolean;
    value: string;
    onClose: () => void;
    onChange: (value: string) => void;
};

// ─── Constantes ──────────────────────────────────────────────────────────────

const DISMISS_THRESHOLD = 80;

const CATEGORIES = [
    { label: 'Todas', value: 'all' },
    ...Object.keys(CATEGORY_ICONS).map((cat) => ({ label: cat, value: cat })),
];

// ─── Componente ──────────────────────────────────────────────────────────────

export default function CategoryModal({
    visible,
    value,
    onClose,
    onChange,
}: CategoryModalProps) {
    const translateY = useSharedValue(500);

    // Animação de entrada
    useEffect(() => {
        if (visible) {
            translateY.value = 500;
            translateY.value = withTiming(0, {
                duration: 350,
                easing: Easing.out(Easing.cubic),
            });
        }
    }, [visible]);

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (e.translationY > 0) {
                translateY.value = e.translationY;
            }
        })
        .onEnd((e) => {
            if (e.translationY > DISMISS_THRESHOLD) {
                translateY.value = withTiming(500, {
                    duration: 300,
                    easing: Easing.in(Easing.cubic),
                }, () => {
                    runOnJS(onClose)();
                });
            } else {
                translateY.value = withTiming(0, {
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                });
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Modal
            visible={visible}
            animationType="none"
            transparent
            statusBarTranslucent
            onRequestClose={onClose}
            onDismiss={() => { translateY.value = 500; }}
        >
            <GestureHandlerRootView style={styles.gestureRoot}>

                {/* ── Backdrop ── */}
                <Pressable style={styles.backdrop} onPress={onClose} />

                {/* ── Sheet ── */}
                <Animated.View style={[styles.sheet, animatedStyle]}>
                    <View style={styles.sheetClip}>
                        <View style={styles.sheetInner}>

                            {/* Handle arrastável */}
                            <GestureDetector gesture={panGesture}>
                                <View style={styles.handleArea}>
                                    <View style={styles.handle} />
                                </View>
                            </GestureDetector>

                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={styles.headerTitle}>Categoria</Text>
                            </View>

                            {/* Opções */}
                            <View style={styles.optionList}>
                                {CATEGORIES.map((cat, index) => {
                                    const isActive = value === cat.value;
                                    const isLast   = index === CATEGORIES.length - 1;
                                    const Icon     = CATEGORY_ICONS[cat.value];
                                    return (
                                        <View key={cat.value}>
                                            <TouchableOpacity
                                                style={[styles.optionRow, isActive && styles.optionRowActive]}
                                                onPress={() => { onChange(cat.value); onClose(); }}
                                                activeOpacity={0.7}
                                            >
                                                <View style={styles.optionLeft}>
                                                    {Icon && (
                                                        <View style={[styles.iconBox, isActive && styles.iconBoxActive]}>
                                                            <Icon size={16} color={isActive ? Colors.primary : Colors.textSecondary} variant="Bold" />
                                                        </View>
                                                    )}
                                                    <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>
                                                        {cat.label}
                                                    </Text>
                                                </View>
                                                {isActive && <TickCircle size={20} color={Colors.primary} variant="Bold" />}
                                            </TouchableOpacity>
                                            {!isLast && <View style={styles.divider} />}
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </GestureHandlerRootView>
        </Modal>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    gestureRoot: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    sheet: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    sheetClip: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
        backgroundColor: Colors.background,
    },
    sheetInner: {
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    handleArea: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    handle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.border,
    },
    header: {
        alignItems: 'center',
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 17,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
    },
    optionList: {
        backgroundColor: Colors.surface,
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 8,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 13,
        paddingHorizontal: 16,
    },
    optionRowActive: {
        backgroundColor: Colors.primaryLight,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBoxActive: {
        backgroundColor: Colors.primaryLight,
    },
    optionLabel: {
        fontSize: 14,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
    },
    optionLabelActive: {
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.divider,
        marginHorizontal: 16,
    },
});