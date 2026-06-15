import { useState, useRef } from "react";
import {
    View,
    Image,
    Modal,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Text,
} from "react-native";
import { CloseCircle } from "iconsax-react-native";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type ImageCarouselProps = {
    images: string[]; // Array de URIs das imagens
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CAROUSEL_HEIGHT = 200;

// ─── Componente ──────────────────────────────────────────────────────────────

export default function ImageCarousel({ images }: ImageCarouselProps) {
    const validImages = images.filter((uri) => uri?.trim());
    const [activeIndex, setActiveIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const fullscreenRef = useRef<FlatList>(null);

    if (validImages.length === 0) {
        return null;
    }

    // Atualiza o índice ativo conforme o scroll do carrosel
    const handleScroll = (e: any) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
        setActiveIndex(index);
    };

    // Abre o modal e sincroniza a imagem com o índice ativo
    const handleOpen = () => {
        setModalVisible(true);
        setTimeout(() => {
            fullscreenRef.current?.scrollToIndex({ index: activeIndex, animated: false });
        }, 100);
    };

    return (
        <View>
            {/* ── Carrosel compacto ── */}
            <TouchableOpacity activeOpacity={0.9} onPress={handleOpen}>
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

                {/* Indicadores de página */}
                <View style={styles.dotsContainer}>
                    {validImages.map((_, i) => (
                        <View
                            key={i}
                            style={[styles.dot, i === activeIndex && styles.dotActive]}
                        />
                    ))}
                </View>
            </TouchableOpacity>

            {/* ── Modal tela cheia ── */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    {/* Botão fechar */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <CloseCircle size={32} color="#fff" variant="Bold" />
                    </TouchableOpacity>

                    {/* Contador de imagens */}
                    <Text style={styles.counter}>
                        {activeIndex + 1} / {validImages.length}
                    </Text>

                    {/* Imagens em tela cheia */}
                    <FlatList
                        ref={fullscreenRef}
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
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item }}
                                style={styles.fullscreenImage}
                                resizeMode="contain"
                            />
                        )}
                    />
                </View>
            </Modal>
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
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        justifyContent: "center",
    },
    closeButton: {
        position: "absolute",
        top: 56,
        right: 20,
        zIndex: 10,
    },
    counter: {
        position: "absolute",
        top: 60,
        alignSelf: "center",
        fontSize: 14,
        fontFamily: "Poppins_500Medium",
        color: "#fff",
        zIndex: 10,
    },
    fullscreenImage: {
        width: SCREEN_WIDTH,
        height: "100%",
    },
});
