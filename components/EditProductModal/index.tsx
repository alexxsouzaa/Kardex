import BarcodeCaptureModal from "@/components/BarcodeCaptureModal";
import ProductBasicSection from "@/components/Cadastre/ProductBasicSection";
import ProductQuantitySection, { PackagingType } from "@/components/Cadastre/ProductQuantitySection";
import ProductCategorySection from "@/components/Cadastre/Unidade/ProductCategorySection";
import ProductImagesSection from "@/components/Cadastre/Unidade/ProductImagesSection";
import ProductValueSection from "@/components/Cadastre/Unidade/ProductValueSection";
import { Colors } from "@/constants/colors";
import type Product from "@/database/models/Product";
import type { ProductInput } from "@/hooks/useProductMutations";
import { CloseCircle } from "iconsax-react-native";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type EditProductModalProps = {
    visible: boolean;
    product: Product;
    onClose: () => void;
    onConfirm: (updated: Partial<ProductInput>) => Promise<boolean | void> | boolean | void;
};

type FormErrors = {
    name?: string;
    eanCode?: string;
    quantity?: string;
    unit?: string;
    value?: string;
    category?: string;
};

const PACKAGING_VALUES: PackagingType[] = ["unidade", "caixa", "palete"];

function normalizePackaging(value: string | null): PackagingType {
    return PACKAGING_VALUES.includes(value as PackagingType)
        ? value as PackagingType
        : "unidade";
}

function numberToInput(value: number | null | undefined): string {
    if (typeof value !== "number" || Number.isNaN(value)) return "";
    return String(value).replace(".", ",");
}

function parseNumber(value: string): number {
    return parseFloat(value.replace(",", "."));
}

export default function EditProductModal({
    visible,
    product,
    onClose,
    onConfirm,
}: EditProductModalProps) {
    const [name, setName] = useState("");
    const [eanCode, setEanCode] = useState("");
    const [lote, setLote] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const [packaging, setPackaging] = useState<PackagingType>("unidade");
    const [value, setValue] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [brand, setBrand] = useState("");
    const [supplier, setSupplier] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [scannerVisible, setScannerVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!visible) return;

        setName(product.name ?? "");
        setEanCode(product.eanCode ?? "");
        setLote(product.lote ?? "");
        setQuantity(numberToInput(product.quantity));
        setUnit(product.unit ?? "");
        setPackaging(normalizePackaging(product.packaging));
        setValue(numberToInput(product.value));
        setExpiryDate(product.expiryDate ?? "");
        setCategory(product.category ?? "");
        setType(product.type ?? "");
        setBrand(product.brand ?? "");
        setSupplier(product.supplier ?? "");
        setImages((product.images ?? []).filter((uri) => uri?.trim()));
        setErrors({});
    }, [visible, product]);

    const validate = (): boolean => {
        const nextErrors: FormErrors = {};
        const parsedQuantity = parseNumber(quantity);
        const parsedValue = parseNumber(value);

        if (!name.trim()) nextErrors.name = "Nome é obrigatório";
        if (!eanCode.trim()) nextErrors.eanCode = "Código EAN é obrigatório";
        if (!quantity.trim() || Number.isNaN(parsedQuantity)) {
            nextErrors.quantity = "Informe uma quantidade válida";
        }
        if (!unit.trim()) nextErrors.unit = "Unidade é obrigatória";
        if (!value.trim() || Number.isNaN(parsedValue)) {
            nextErrors.value = "Informe um valor válido";
        }
        if (!category.trim()) nextErrors.category = "Categoria é obrigatória";

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleAddImage = (uri: string) => {
        setImages((prev) => [...prev, uri].filter((image) => image?.trim()));
    };

    const handleReplaceImage = (index: number, uri: string) => {
        setImages((prev) =>
            prev.map((image, currentIndex) => currentIndex === index ? uri : image)
                .filter((image) => image?.trim())
        );
    };

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
    };

    const handleConfirm = async () => {
        if (!validate()) return;

        setIsSaving(true);

        try {
            const success = await onConfirm({
                name: name.trim(),
                eanCode: eanCode.trim(),
                lote: lote.trim(),
                quantity: parseNumber(quantity),
                unit: unit.trim(),
                packaging,
                value: parseNumber(value),
                expiryDate: expiryDate.trim() || undefined,
                category: category.trim(),
                type: type.trim(),
                brand: brand.trim(),
                supplier: supplier.trim(),
                images,
            });

            if (success !== false) onClose();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView
                style={styles.root}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.header}>
                    <View style={styles.headerText}>
                        <Text style={styles.headerTitle}>Editar produto</Text>
                        <Text style={styles.headerSub} numberOfLines={1}>{product.name}</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
                        <CloseCircle size={28} color={Colors.textMuted} variant="Bold" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <ProductBasicSection
                        name={name}
                        eanCode={eanCode}
                        lote={lote}
                        onChangeName={setName}
                        onChangeEan={setEanCode}
                        onChangeLote={setLote}
                        onScanPress={() => setScannerVisible(true)}
                        errors={errors}
                    />

                    <View style={styles.divider} />

                    <ProductQuantitySection
                        quantity={quantity}
                        unit={unit}
                        packaging={packaging}
                        onChangeQty={setQuantity}
                        onChangeUnit={setUnit}
                        onChangePkg={setPackaging}
                        errors={errors}
                    />

                    <View style={styles.divider} />

                    <ProductValueSection
                        value={value}
                        expiryDate={expiryDate}
                        onChangeValue={setValue}
                        onChangeExpiry={setExpiryDate}
                        errors={errors}
                    />

                    <View style={styles.divider} />

                    <ProductCategorySection
                        category={category}
                        type={type}
                        brand={brand}
                        supplier={supplier}
                        onChangeCategory={setCategory}
                        onChangeType={setType}
                        onChangeBrand={setBrand}
                        onChangeSupplier={setSupplier}
                        errors={errors}
                    />

                    <View style={styles.divider} />

                    <ProductImagesSection
                        images={images}
                        onAddImage={handleAddImage}
                        onReplaceImage={handleReplaceImage}
                        onRemoveImage={handleRemoveImage}
                    />
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.confirmBtn, isSaving && styles.confirmBtnDisabled]}
                        onPress={handleConfirm}
                        activeOpacity={0.9}
                        disabled={isSaving}
                    >
                        <Text style={styles.confirmText}>
                            {isSaving ? "Salvando..." : "Salvar alterações"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <BarcodeCaptureModal
                    visible={scannerVisible}
                    onClose={() => setScannerVisible(false)}
                    onCapture={(code) => {
                        setEanCode(code);
                        setScannerVisible(false);
                    }}
                />
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 16,
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 16,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerText: {
        flex: 1,
        gap: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: "Satoshi_Bold",
        color: Colors.textPrimary,
    },
    headerSub: {
        fontSize: 13,
        fontFamily: "Satoshi_Regular",
        color: Colors.textSecondary,
    },
    content: {
        padding: 20,
        paddingBottom: 120,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 24,
    },
    footer: {
        padding: 16,
        backgroundColor: Colors.surface,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    confirmBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 40,
        paddingVertical: 18,
        alignItems: "center",
    },
    confirmBtnDisabled: {
        opacity: 0.6,
    },
    confirmText: {
        fontSize: 15,
        fontFamily: "Satoshi_Bold",
        color: "#fff",
    },
});
