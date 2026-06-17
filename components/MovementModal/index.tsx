import { useState } from "react";
import {
    Modal, View, Text, StyleSheet, TouchableOpacity,
    TextInput, KeyboardAvoidingView, Platform, ScrollView
} from "react-native";
import { ArrowDown, ArrowUp, Setting2, CloseCircle } from "iconsax-react-native";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type MovementType = "in" | "out" | "adjust";

type MovementModalProps = {
    visible: boolean;
    productName: string;
    currentQuantity: number;
    unit: string;
    onClose: () => void;
    onConfirm: (type: MovementType, quantity: number, note: string) => void;
};

// ─── Constantes ──────────────────────────────────────────────────────────────

const MOVEMENT_OPTIONS: { type: MovementType; label: string; icon: any; color: string; bg: string }[] = [
    { type: "in",     label: "Entrada",  icon: ArrowDown,  color: "#4CAF50", bg: "#E8F5E9" },
    { type: "out",    label: "Saída",    icon: ArrowUp,    color: "#E53935", bg: "#FFEBEE" },
    { type: "adjust", label: "Ajuste",   icon: Setting2,   color: "#FF9800", bg: "#FFF3E0" },
];

// ─── Componente ──────────────────────────────────────────────────────────────

export default function MovementModal({
    visible,
    productName,
    currentQuantity,
    unit,
    onClose,
    onConfirm,
}: MovementModalProps) {
    const [selectedType, setSelectedType] = useState<MovementType>("in");
    const [quantity, setQuantity] = useState("");
    const [note, setNote] = useState("");

    const selected = MOVEMENT_OPTIONS.find(o => o.type === selectedType)!;

    const handleConfirm = () => {
        const qty = parseFloat(quantity);
        if (!qty || qty <= 0) return;
        onConfirm(selectedType, qty, note);
        handleClose();
    };

    const handleClose = () => {
        setQuantity("");
        setNote("");
        setSelectedType("in");
        onClose();
    };

    // Preview do novo saldo
    const newQuantity = () => {
        const qty = parseFloat(quantity) || 0;
        if (selectedType === "in")     return currentQuantity + qty;
        if (selectedType === "out")    return Math.max(0, currentQuantity - qty);
        if (selectedType === "adjust") return qty;
        return currentQuantity;
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView
                style={styles.root}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {/* ── Header ── */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Registrar movimento</Text>
                        <Text style={styles.headerSub}>{productName}</Text>
                    </View>
                    <TouchableOpacity onPress={handleClose}>
                        <CloseCircle size={28} color="#A9A9A9" variant="Bold" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    {/* ── Tipo de movimento ── */}
                    <Text style={styles.label}>Tipo de movimento</Text>
                    <View style={styles.typeRow}>
                        {MOVEMENT_OPTIONS.map((opt) => {
                            const Icon = opt.icon;
                            const isActive = selectedType === opt.type;
                            return (
                                <TouchableOpacity
                                    key={opt.type}
                                    style={[styles.typeCard, isActive && { borderColor: opt.color, backgroundColor: opt.bg }]}
                                    onPress={() => setSelectedType(opt.type)}
                                    activeOpacity={0.8}
                                >
                                    <Icon size={20} color={isActive ? opt.color : "#A9A9A9"} variant="Bold" />
                                    <Text style={[styles.typeLabel, isActive && { color: opt.color }]}>
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* ── Quantidade ── */}
                    <Text style={styles.label}>
                        {selectedType === "adjust" ? `Nova quantidade (${unit})` : `Quantidade (${unit})`}
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={quantity}
                        onChangeText={setQuantity}
                        placeholder="0"
                        placeholderTextColor="#C0C0C0"
                        keyboardType="numeric"
                    />

                    {/* ── Preview do saldo ── */}
                    {quantity.length > 0 && (
                        <View style={[styles.preview, { backgroundColor: selected.bg }]}>
                            <Text style={styles.previewLabel}>Saldo após movimento</Text>
                            <Text style={[styles.previewValue, { color: selected.color }]}>
                                {newQuantity()} {unit}
                            </Text>
                        </View>
                    )}

                    {/* ── Observação ── */}
                    <Text style={styles.label}>Observação (opcional)</Text>
                    <TextInput
                        style={[styles.input, styles.inputMultiline]}
                        value={note}
                        onChangeText={setNote}
                        placeholder="Ex: Recebimento NF 1234..."
                        placeholderTextColor="#C0C0C0"
                        multiline
                        numberOfLines={3}
                    />
                </ScrollView>

                {/* ── Botão confirmar ── */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.confirmBtn, { backgroundColor: selected.color }, !quantity && styles.confirmBtnDisabled]}
                        onPress={handleConfirm}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.confirmText}>Confirmar {selected.label}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F1F2F4',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 24,
        paddingTop: 32,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F2F4',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Satoshi_Bold',
        color: '#343434',
    },
    headerSub: {
        fontSize: 13,
        fontFamily: 'Satoshi_Regular',
        color: '#727272',
        marginTop: 2,
    },
    content: {
        padding: 24,
        gap: 8,
    },
    label: {
        fontSize: 13,
        fontFamily: 'Satoshi_Medium',
        color: '#727272',
        marginTop: 8,
        marginBottom: 4,
    },

    // Tipo de movimento
    typeRow: {
        flexDirection: 'row',
        gap: 10,
    },
    typeCard: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
        padding: 14,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E5E5E5',
        backgroundColor: '#fff',
    },
    typeLabel: {
        fontSize: 12,
        fontFamily: 'Satoshi_Medium',
        color: '#A9A9A9',
    },

    // Input
    input: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Satoshi_Regular',
        color: '#343434',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    inputMultiline: {
        height: 90,
        textAlignVertical: 'top',
        fontSize: 13,
    },

    // Preview
    preview: {
        borderRadius: 14,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    previewLabel: {
        fontSize: 13,
        fontFamily: 'Satoshi_Regular',
        color: '#727272',
    },
    previewValue: {
        fontSize: 16,
        fontFamily: 'Satoshi_Bold',
    },

    // Footer
    footer: {
        padding: 24,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F1F2F4',
    },
    confirmBtn: {
        borderRadius: 40,
        paddingVertical: 18,
        alignItems: 'center',
    },
    confirmBtnDisabled: {
        opacity: 0.5,
    },
    confirmText: {
        fontSize: 15,
        fontFamily: 'Satoshi_Bold',
        color: '#fff',
    },
});