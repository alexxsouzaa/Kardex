import BarcodeCaptureModal from "@/components/BarcodeCaptureModal";
import ProductBasicSection from "@/components/Cadastre/ProductBasicSection";
import ProductCategorySection from "@/components/Cadastre/Unidade/ProductCategorySection";
import ProductImagesSection from "@/components/Cadastre/Unidade/ProductImagesSection";
import ProductQuantitySection, { PackagingType } from "@/components/Cadastre/ProductQuantitySection";
import ProductValueSection from "@/components/Cadastre/Unidade/ProductValueSection";
import { Colors } from "@/constants/colors";
import { useProductMutations } from "@/hooks/useProductMutations";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft2 } from "iconsax-react-native";
import { useEffect, useState } from "react";
import {
    Alert, KeyboardAvoidingView, Platform,
    ScrollView, StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type FormErrors = {
    name?:     string;
    eanCode?:  string;
    quantity?: string;
    unit?:     string;
    value?:    string;
    category?: string;
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function CadastrePage() {
    const router  = useRouter();
    const params  = useLocalSearchParams<{
        eanCode?: string;
        name?:    string;
        brand?:   string;
    }>();

    const { createProduct, isLoading: isSaving, error: saveError } = useProductMutations();

    // ── Estado do formulário ──
    const [name,          setName]          = useState('');
    const [eanCode,       setEanCode]       = useState('');
    const [lote,          setLote]          = useState('');
    const [quantity,      setQuantity]      = useState('');
    const [unit,          setUnit]          = useState('');
    const [packaging,     setPackaging]     = useState<PackagingType>('unidade');
    const [value,         setValue]         = useState('');
    const [expiryDate,    setExpiryDate]    = useState('');
    const [category,      setCategory]      = useState('');
    const [type,          setType]          = useState('');
    const [brand,         setBrand]         = useState('');
    const [supplier,      setSupplier]      = useState('');
    const [images,        setImages]        = useState<string[]>([]);
    const [errors,        setErrors]        = useState<FormErrors>({});
    const [scannerVisible, setScannerVisible] = useState(false);

    // ── Preenche campos via params (scanner) ──
    useEffect(() => {
        if (params.eanCode) setEanCode(params.eanCode);
        if (params.name)    setName(decodeURIComponent(params.name));
        if (params.brand)   setBrand(decodeURIComponent(params.brand));
    }, []);

    // ── Mostra erro do hook se houver ──
    useEffect(() => {
        if (saveError) {
            Alert.alert('Erro', saveError);
        }
    }, [saveError]);

    // ── Validação ──
    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!name.trim())     newErrors.name     = 'Nome é obrigatório';
        if (!eanCode.trim())  newErrors.eanCode   = 'Código EAN é obrigatório';
        if (!quantity.trim()) newErrors.quantity  = 'Quantidade é obrigatória';
        if (!unit.trim())     newErrors.unit      = 'Unidade é obrigatória';
        if (!value.trim())    newErrors.value     = 'Valor é obrigatório';
        if (!category.trim()) newErrors.category  = 'Categoria é obrigatória';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ── Salvar no WatermelonDB ──
    const handleSave = async () => {
        if (!validate()) return;

        const result = await createProduct({
            name:        name.trim(),
            eanCode:     eanCode.trim(),
            lote:        lote.trim(),
            quantity:    parseFloat(quantity),
            unit:        unit.trim(),
            packaging,
            value:       parseFloat(value.replace(',', '.')),
            expiryDate:  expiryDate.trim() || undefined,
            category:    category.trim(),
            type:        type.trim(),
            brand:       brand.trim(),
            supplier:    supplier.trim(),
            images,
        });

        if (result) {
            Alert.alert(
                'Produto cadastrado!',
                `"${name}" foi adicionado ao estoque.`,
                [{ text: 'OK', onPress: () => router.back() }]
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                >
                    <ArrowLeft2 size={20} color={Colors.textPrimary} variant="Linear" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Novo produto</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Seção: Básico ── */}
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

                    {/* ── Seção: Quantidade ── */}
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

                    {/* ── Seção: Valor e validade ── */}
                    <ProductValueSection
                        value={value}
                        expiryDate={expiryDate}
                        onChangeValue={setValue}
                        onChangeExpiry={setExpiryDate}
                        errors={errors}
                    />

                    <View style={styles.divider} />

                    {/* ── Seção: Categoria ── */}
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

                    {/* ── Seção: Imagens ── */}
                    <ProductImagesSection
                        images={images}
                        onAddImage={(uri) => setImages(prev => [...prev, uri])}
                        onRemoveImage={(index) => setImages(prev => prev.filter((_, i) => i !== index))}
                    />

                    <View style={{ height: 100 }} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* ── Botão salvar fixo ── */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
                    onPress={handleSave}
                    activeOpacity={0.9}
                    disabled={isSaving}
                >
                    <Text style={styles.saveBtnText}>
                        {isSaving ? 'Salvando...' : 'Cadastrar produto'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ── Modal scanner ── */}
            <BarcodeCaptureModal
                visible={scannerVisible}
                onClose={() => setScannerVisible(false)}
                onCapture={(code) => {
                    setEanCode(code);
                    setScannerVisible(false);
                }}
            />
        </SafeAreaView>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textPrimary,
    },
    content: {
        padding: 16,
        paddingBottom: 120,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: 120,
        backgroundColor: Colors.background,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    saveBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 40,
        paddingVertical: 18,
        alignItems: 'center',
    },
    saveBtnDisabled: {
        opacity: 0.6,
    },
    saveBtnText: {
        fontSize: 15,
        fontFamily: 'Satoshi_Bold',
        color: '#fff',
    },
});