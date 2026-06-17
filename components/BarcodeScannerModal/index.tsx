// components/BarcodeScannerModal.tsx
import { Colors } from "@/constants/colors";
import { ExternalProduct } from "@/hooks/useProductLookup";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { StockItem } from "@/constants/stockData";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ScanBarcode, Box, Add, CloseCircle } from "iconsax-react-native";
import { useEffect } from "react";
import {
    ActivityIndicator, Dimensions, Modal, Pressable, StyleSheet,
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

type BarcodeScannerModalProps = {
    visible: boolean;
    onClose: () => void;
    onNavigateToProduct: (product: StockItem) => void;
    onRegisterMovement:  (product: StockItem) => void;
    onAddProduct:        (code: string, external?: ExternalProduct) => void;
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function BarcodeScannerModal({
    visible,
    onClose,
    onNavigateToProduct,
    onRegisterMovement,
    onAddProduct,
}: BarcodeScannerModalProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const { result, handleScan, reset }   = useBarcodeScanner();
    const translateY                      = useSharedValue(500);

    // ── Animação de entrada ──
    useEffect(() => {
        if (visible) {
            translateY.value = 500;
            translateY.value = withTiming(0, {
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
        reset();
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
            onDismiss={() => { translateY.value = 500; reset(); }}
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
                            <Text style={styles.headerTitle}>Leitor de código</Text>
                            <TouchableOpacity onPress={handleClose} hitSlop={8}>
                                <CloseCircle size={26} color={Colors.textMuted} variant="Bold" />
                            </TouchableOpacity>
                        </View>

                        {/* ── Câmera ── */}
                        {!result ? (
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
                        ) : (

                            // ── Resultado ──
                            <View style={styles.resultContainer}>

                                {/* Buscando online */}
                                {result.status === "searching" && (
                                    <View style={styles.searchingBox}>
                                        <ActivityIndicator size="small" color={Colors.primary} />
                                        <Text style={styles.searchingText}>
                                            Buscando produto online...
                                        </Text>
                                    </View>
                                )}

                                {/* Encontrado localmente */}
                                {result.status === "found" && (
                                    <>
                                        <View style={styles.resultFound}>
                                            <ScanBarcode size={28} color={Colors.success} variant="Bold" />
                                            <View style={styles.resultInfo}>
                                                <Text style={styles.resultName}>{result.product.name}</Text>
                                                <Text style={styles.resultCode}>
                                                    Item: {result.product.eanCode}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.actions}>
                                            <TouchableOpacity
                                                style={styles.actionBtn}
                                                onPress={() => { onNavigateToProduct(result.product); handleClose(); }}
                                                activeOpacity={0.8}
                                            >
                                                <Box size={18} color={Colors.primary} variant="Bold" />
                                                <Text style={styles.actionBtnText}>Ver produto</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.actionBtn, styles.actionBtnPrimary]}
                                                onPress={() => { onRegisterMovement(result.product); handleClose(); }}
                                                activeOpacity={0.8}
                                            >
                                                <Add size={18} color="#fff" variant="Bold" />
                                                <Text style={[styles.actionBtnText, { color: '#fff' }]}>
                                                    Registrar movimento
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}

                                {/* Encontrado via Open Food Facts */}
                                {result.status === "external" && (
                                    <>
                                        <View style={styles.resultExternal}>
                                            <ScanBarcode size={28} color="#3B82F6" variant="Bold" />
                                            <View style={styles.resultInfo}>
                                                <Text style={styles.resultName}>
                                                    {result.product.name || 'Produto encontrado'}
                                                </Text>
                                                {result.product.brand ? (
                                                    <Text style={styles.resultCode}>{result.product.brand}</Text>
                                                ) : null}
                                                <Text style={[styles.resultCode, { color: '#3B82F6' }]}>
                                                    Via Open Food Facts
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            style={[styles.actionBtn, styles.actionBtnPrimary]}
                                            onPress={() => {
                                                onAddProduct(result.product.eanCode, result.product);
                                                handleClose();
                                            }}
                                            activeOpacity={0.8}
                                        >
                                            <Add size={18} color="#fff" variant="Bold" />
                                            <Text style={[styles.actionBtnText, { color: '#fff' }]}>
                                                Cadastrar produto
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                {/* Não encontrado */}
                                {result.status === "not_found" && (
                                    <>
                                        <View style={styles.resultNotFound}>
                                            <ScanBarcode size={28} color={Colors.warning} variant="Bold" />
                                            <View style={styles.resultInfo}>
                                                <Text style={styles.resultName}>Produto não encontrado</Text>
                                                <Text style={styles.resultCode}>{result.code}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            style={[styles.actionBtn, styles.actionBtnPrimary]}
                                            onPress={() => {
                                                onAddProduct(result.code);
                                                handleClose();
                                            }}
                                            activeOpacity={0.8}
                                        >
                                            <Add size={18} color="#fff" variant="Bold" />
                                            <Text style={[styles.actionBtnText, { color: '#fff' }]}>
                                                Cadastrar produto
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                {/* Escanear novamente */}
                                {result.status !== "searching" && (
                                    <TouchableOpacity style={styles.rescanBtn} onPress={reset}>
                                        <Text style={styles.rescanText}>Escanear novamente</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
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

    // ── Câmera ──
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

    // ── Permissão ──
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

    // ── Resultado ──
    resultContainer: {
        gap: 12,
        marginBottom: 8,
    },
    searchingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: Colors.surfaceElevated,
        borderRadius: 16,
        padding: 14,
    },
    searchingText: {
        fontSize: 14,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
    },
    resultFound: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: Colors.successLight,
        borderRadius: 16,
        padding: 14,
    },
    resultExternal: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#EFF6FF',
        borderRadius: 16,
        padding: 14,
    },
    resultNotFound: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: Colors.warningLight,
        borderRadius: 16,
        padding: 14,
    },
    resultInfo: {
        flex: 1,
        gap: 2,
    },
    resultName: {
        fontSize: 14,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
    },
    resultCode: {
        fontSize: 12,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textSecondary,
    },

    // ── Ações ──
    actions: {
        gap: 8,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.surface,
        borderRadius: 40,
        paddingVertical: 14,
        borderWidth: 1.5,
        borderColor: Colors.border,
    },
    actionBtnPrimary: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    actionBtnText: {
        fontSize: 14,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
    },
    rescanBtn: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    rescanText: {
        fontSize: 13,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
    },
});