import { Colors } from "@/constants/colors";
import { persistImage } from "@/utils/persistImage";
import * as ImagePicker from "expo-image-picker";
import { Add, CloseCircle } from "iconsax-react-native";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type ProductImagesSectionProps = {
    images:        string[];
    onAddImage:    (uri: string) => void;
    onRemoveImage: (index: number) => void;
    onReplaceImage?: (index: number, uri: string) => void;
};

const MAX_IMAGES = 5;

// ─── Componente ──────────────────────────────────────────────────────────────

export default function ProductImagesSection({
    images,
    onAddImage,
    onRemoveImage,
    onReplaceImage,
}: ProductImagesSectionProps) {
    const visibleImages = images
        .map((uri, index) => ({ uri, index }))
        .filter((image) => image.uri?.trim());

    const pickImageFromLibrary = async (): Promise<string | null> => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return null;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            return result.assets[0].uri;
        }

        return null;
    };

    const pickImage = async () => {
        const uri = await pickImageFromLibrary();
        if (uri) {
            const persisted = await persistImage(uri);
            onAddImage(persisted);
        }
    };

    const replaceImage = async (index: number) => {
        if (!onReplaceImage) return;

        const uri = await pickImageFromLibrary();
        if (uri) {
            const persisted = await persistImage(uri);
            onReplaceImage(index, persisted);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') return;

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const persisted = await persistImage(result.assets[0].uri);
            onAddImage(persisted);
        }
    };

    return (
        <View style={styles.section}>
            <View style={styles.titleRow}>
                <Text style={styles.sectionTitle}>Imagens</Text>
                <Text style={styles.counter}>{visibleImages.length}/{MAX_IMAGES}</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageList}
            >
                {/* Imagens adicionadas */}
                {visibleImages.map(({ uri, index }) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
                        {onReplaceImage && (
                            <TouchableOpacity
                                style={styles.replaceBtn}
                                onPress={() => replaceImage(index)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.replaceText}>Trocar</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={styles.removeBtn}
                            onPress={() => onRemoveImage(index)}
                        >
                            <CloseCircle size={20} color={Colors.danger} variant="Bold" />
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Botões de adicionar */}
                {visibleImages.length < MAX_IMAGES && (
                    <>
                        <TouchableOpacity style={styles.addBtn} onPress={pickImage} activeOpacity={0.8}>
                            <Add size={24} color={Colors.textMuted} variant="Linear" />
                            <Text style={styles.addBtnText}>Galeria</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.addBtn} onPress={takePhoto} activeOpacity={0.8}>
                            <Add size={24} color={Colors.textMuted} variant="Linear" />
                            <Text style={styles.addBtnText}>Câmera</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    section: {
        gap: 12,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 15,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
    },
    counter: {
        fontSize: 12,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textMuted,
    },
    imageList: {
        gap: 10,
        paddingVertical: 4,
    },
    imageWrapper: {
        position: 'relative',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 14,
        backgroundColor: Colors.background,
    },
    removeBtn: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: Colors.surface,
        borderRadius: 10,
    },
    replaceBtn: {
        position: 'absolute',
        left: 6,
        right: 6,
        bottom: 6,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.62)',
        paddingVertical: 4,
        alignItems: 'center',
    },
    replaceText: {
        fontSize: 10,
        fontFamily: 'Satoshi_Bold',
        color: '#fff',
    },
    addBtn: {
        width: 80,
        height: 80,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderStyle: 'dashed',
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    addBtnText: {
        fontSize: 10,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textMuted,
    },
});
