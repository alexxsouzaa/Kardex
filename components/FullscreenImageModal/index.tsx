import { useEffect, useRef, useState } from "react";
import {
    View,
    Image,
    Modal,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Text,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";
import { CloseCircle } from "iconsax-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type FullscreenImageModalProps = {
    visible: boolean;
    images: string[];
    initialIndex?: number;
    onClose: () => void;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ─── Componente ──────────────────────────────────────────────────────────────

export default function FullscreenImageModal({
    visible,
    images,
    initialIndex = 0,
    onClose,
}: FullscreenImageModalProps) {
    const insets = useSafeAreaInsets();
    const validImages = images.filter((uri) => uri?.trim());
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const listRef = useRef<FlatList>(null);

    useEffect(() => {
        if (!visible || validImages.length === 0) return;

        const index = Math.min(
            Math.max(initialIndex, 0),
            validImages.length - 1
        );

        setActiveIndex(index);

        const timer = setTimeout(() => {
            listRef.current?.scrollToIndex({ index, animated: false });
        }, 50);

        return () => clearTimeout(timer);
    }, [visible, initialIndex, validImages.length]);

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);

        if (index >= 0 && index < validImages.length) {
            setActiveIndex(index);
        }
    };

    if (validImages.length === 0) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
            presentationStyle="overFullScreen"
        >
            <StatusBar style="light" />
            <View style={styles.container}>
                <TouchableOpacity
                    style={[styles.closeButton, { top: insets.top + 12 }]}
                    onPress={onClose}
                    activeOpacity={0.8}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                    <CloseCircle size={32} color="#fff" variant="Bold" />
                </TouchableOpacity>

                {validImages.length > 1 && (
                    <Text style={[styles.counter, { top: insets.top + 20 }]}>
                        {activeIndex + 1} / {validImages.length}
                    </Text>
                )}

                <FlatList
                    ref={listRef}
                    style={styles.list}
                    data={validImages}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, i) => String(i)}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    getItemLayout={(_, index) => ({
                        length: SCREEN_WIDTH,
                        offset: SCREEN_WIDTH * index,
                        index,
                    })}
                    onScrollToIndexFailed={(info) => {
                        setTimeout(() => {
                            listRef.current?.scrollToIndex({
                                index: info.index,
                                animated: false,
                            });
                        }, 100);
                    }}
                    renderItem={({ item }) => (
                        <View style={styles.slide}>
                            <Image
                                source={{ uri: item }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                />

                {validImages.length > 1 && (
                    <View style={[styles.dots, { bottom: insets.bottom + 24 }]}>
                        {validImages.map((_, i) => (
                            <View
                                key={i}
                                style={[styles.dot, i === activeIndex && styles.dotActive]}
                            />
                        ))}
                    </View>
                )}
            </View>
        </Modal>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    list: {
        flex: 1,
    },
    closeButton: {
        position: "absolute",
        right: 20,
        zIndex: 10,
    },
    counter: {
        position: "absolute",
        alignSelf: "center",
        fontSize: 14,
        fontFamily: "Satoshi_Medium",
        color: "#fff",
        zIndex: 10,
    },
    slide: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    dots: {
        position: "absolute",
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.35)",
    },
    dotActive: {
        width: 18,
        backgroundColor: "#fff",
    },
});
