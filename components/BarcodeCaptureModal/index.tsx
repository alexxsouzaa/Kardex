// components/BarcodeCaptureModal.tsx
import { Colors } from "@/constants/colors";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { CloseCircle, ScanBarcode } from "iconsax-react-native";
import { useEffect, useRef } from "react";
import {
    Dimensions, Modal, Pressable, StyleSheet,
    Text, TouchableOpacity, View
} from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
    Easing, runOnJS, useAnimatedStyle,
    useSharedValue, withTiming
} from "react-native-reanimated";

// ─── Constantes ──────────────────────────────────────────────────────────────

const SCREEN_HEIGHT     = Dimensions.get('window').height;
const CAMERA_HEIGHT     = SCREEN_HEIGHT * 0.35;
const DISMISS_THRESHOLD = 80;

// ─── Tipos ───────────────────────────────────────────────────────────────────

type BarcodeCaptureModalProps = {
    visible:   boolean;
    onClose:   () => void;
    onCapture: (code: string) => void; // ← só devolve o código, sem busca
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function BarcodeCaptureModal({
    visible,
    onClose,
    onCapture,
}: BarcodeCaptureModalProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const translateY  = useSharedValue(500);
    const scannedRef  = useRef(false); // ← ref para evitar leituras duplas

    // ── Animação de entrada ──
    useEffect(() => {
        if (visible) {
            scannedRef.current   = false;
            translateY.value     = 500;
            translateY.value     = withTiming(0, {
                duration: 350,
                easing: Easing.out(Easing.cubic),
            });
            requestPermission();
        }
    }, [visible]);

    const handleClose = () => {
        translateY.value = withTiming(500, {
            duration: 300,
            easing: Easing.in(Easing.cubic),
        }, () => runOnJS(onClose)());
    };

    const handleScan = async (code: string) => {
        if (scannedRef.current) return;
        scannedRef.current = true;

        // Só vibra — sem busca
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Devolve o código e fecha
        onCapture(code);
        handleClose();
    };

    // ── Gesto de arrastar para fechar ──
    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (e.translationY > 0) translateY.value = e.translationY;
        })
        .onEnd((e) => {
            if (e.translationY > DISMISS_THRESHOLD) {
                translateY.value = withTiming(500, {
                    duration: 300,
                    easing: Easing.in(Easing.cubic),
                }, () => runOnJS(handleClose)());
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
            onRequestClose={handleClose}
            onDismiss={() => { translateY.value = 500; scannedRef.current = false; }}
        >
            <GestureHandlerRootView style={styles.gestureRoot}>

                {/* ── Backdrop ── */}
                <Pressable style={styles.backdrop} onPress={handleClose} />

                {/* ── Sheet ── */}
                <Animated.View style={[styles.sheet, animatedStyle]}>
                    <View style={styles.sheetClip}>

                        {/* Handle arrastável */}
                        <GestureDetector gesture={panGesture}>
                            <View style={styles.handleArea}>
                                <View style={styles.handle} />
                            </View>
                        </GestureDetector>

                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Escanear código EAN</Text>
                            <TouchableOpacity onPress={handleClose} hitSlop={8}>
                                <CloseCircle size={26} color={Colors.textMuted} variant="Bold" />
                            </TouchableOpacity>
                        </View>

                        {/* Câmera */}
                        <View style={styles.cameraContainer}>
                            {!permission?.granted ? (
                                <View style={styles.permissionBox}>
                                    <ScanBarcode size={40} color={Colors.textMuted} variant="Bold" />
                                    <Text style={styles.permissionText}>
                                        Permissão de câmera necessária
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.permissionBtn}
                                        onPress={requestPermission}
                                    >
                                        <Text style={styles.permissionBtnText}>Permitir acesso</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.cameraWrapper}>
                                    <CameraView
                                        style={styles.camera}
                                        facing="back"
                                        onBarcodeScanned={({ data }) => handleScan(data)}
                                    />
                                    <View style={styles.scanOverlay}>
                                        <View style={styles.scanFrame}>
                                            <View style={[styles.corner, styles.cornerTL]} />
                                            <View style={[styles.corner, styles.cornerTR]} />
                                            <View style={[styles.corner, styles.cornerBL]} />
                                            <View style={[styles.corner, styles.cornerBR]} />
                                        </View>
                                        <Text style={styles.scanHint}>
                                            Aponte para o código de barras
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        <Text style={styles.caption}>
                            O código será preenchido automaticamente no campo EAN
                        </Text>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 17,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
    },
    cameraContainer: {
        height: CAMERA_HEIGHT,
        marginBottom: 16,
    },
    cameraWrapper: {
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#000',
        height: CAMERA_HEIGHT,
    },
    camera: {
        width: '100%',
        height: CAMERA_HEIGHT,
    },
    scanOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    scanFrame: {
        width: 200,
        height: 120,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: '#fff',
    },
    cornerTL: { top: 0,    left: 0,  borderTopWidth: 3,    borderLeftWidth: 3  },
    cornerTR: { top: 0,    right: 0, borderTopWidth: 3,    borderRightWidth: 3 },
    cornerBL: { bottom: 0, left: 0,  borderBottomWidth: 3, borderLeftWidth: 3  },
    cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
    scanHint: {
        fontSize: 12,
        fontFamily: 'Satoshi_Regular',
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
    permissionBox: {
        height: CAMERA_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        backgroundColor: Colors.surfaceElevated,
        borderRadius: 20,
    },
    permissionText: {
        fontSize: 14,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    permissionBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    permissionBtnText: {
        fontSize: 13,
        fontFamily: 'Satoshi_Bold',
        color: '#fff',
    },
    caption: {
        fontSize: 12,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textMuted,
        textAlign: 'center',
        marginTop: 4,
    },
});