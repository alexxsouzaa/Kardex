import { Colors } from "@/constants/colors";
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

export type SortOption = {
    label: string;
    value: string;
};

type SortModalProps = {
    visible: boolean;
    value: string;
    options: SortOption[];
    onClose: () => void;
    onChange: (value: string) => void;
};

// ─── Constantes ──────────────────────────────────────────────────────────────

const DISMISS_THRESHOLD = 80;

// ─── Componente ──────────────────────────────────────────────────────────────

export default function SortModal({
    visible,
    value,
    options,
    onClose,
    onChange,
}: SortModalProps) {
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
                                <Text style={styles.headerTitle}>Ordenar por</Text>
                            </View>

                            {/* Opções */}
                            <View style={styles.optionList}>
                                {options.map((option, index) => {
                                    const isActive = value === option.value;
                                    const isLast   = index === options.length - 1;
                                    return (
                                        <View key={option.value}>
                                            <TouchableOpacity
                                                style={[styles.optionRow, isActive && styles.optionRowActive]}
                                                onPress={() => { onChange(option.value); onClose(); }}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>
                                                    {option.label}
                                                </Text>
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
        paddingVertical: 15,
        paddingHorizontal: 16,
    },
    optionRowActive: {
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