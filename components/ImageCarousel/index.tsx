import { useState } from "react";
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
} from "react-native";
import FullscreenImageModal from "@/components/FullscreenImageModal";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type ImageCarouselProps = {
    images: string[];
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CAROUSEL_HEIGHT = 200;

// ─── Componente ──────────────────────────────────────────────────────────────

export default function ImageCarousel({ images }: ImageCarouselProps) {
    const validImages = images.filter((uri) => uri?.trim());
    const [activeIndex, setActiveIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    if (validImages.length === 0) {
        return null;
    }

    const handleScroll = (e: any) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 32));
        setActiveIndex(index);
    };

    return (
        <View>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setModalVisible(true)}
            >
                <FlatList
                    data={validImages}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, i) => String(i)}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    style={styles.carousel}
                    renderItem={({ item }) => (
                        <Image
                            source={{ uri: item }}
                            style={styles.carouselImage}
                            resizeMode="cover"
                        />
                    )}
                />

                <View style={styles.dotsContainer}>
                    {validImages.map((_, i) => (
                        <View
                            key={i}
                            style={[styles.dot, i === activeIndex && styles.dotActive]}
                        />
                    ))}
                </View>
            </TouchableOpacity>

            <FullscreenImageModal
                visible={modalVisible}
                images={validImages}
                initialIndex={activeIndex}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    carousel: {
        width: "100%",
        height: CAROUSEL_HEIGHT,
        borderRadius: 22,
        overflow: "hidden",
    },
    carouselImage: {
        width: SCREEN_WIDTH - 32,
        height: CAROUSEL_HEIGHT,
    },
    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        marginTop: 10,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#C4C4C4",
    },
    dotActive: {
        width: 18,
        backgroundColor: "#292D32",
    },
});
