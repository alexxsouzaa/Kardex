import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { useRouter } from "expo-router";
import { Building, Shop } from "iconsax-react-native";
import { useState } from "react";
import {
    Alert, KeyboardAvoidingView, Platform,
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingPage() {
    const router = useRouter();
    const { createDeposit } = useApp();

    const [depositName, setDepositName] = useState('');
    const [isLoading,   setIsLoading]   = useState(false);

    const handleCreate = async () => {
        if (!depositName.trim()) {
            Alert.alert('Erro', 'Dê um nome ao seu estoque.');
            return;
        }

        setIsLoading(true);
        await createDeposit(depositName.trim());
        setIsLoading(false);
        router.replace('/(tabs)' as any);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.inner}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Ícone */}
                <View style={styles.iconArea}>
                    <View style={styles.iconBox}>
                        <Shop size={40} color={Colors.primary} variant="Bold" />
                    </View>
                </View>

                {/* Texto */}
                <View style={styles.textArea}>
                    <Text style={styles.title}>Crie seu estoque</Text>
                    <Text style={styles.subtitle}>
                        Dê um nome ao seu depósito ou empresa. Você pode alterar isso depois nas configurações.
                    </Text>
                </View>

                {/* Input */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome do estoque</Text>
                        <View style={styles.inputWrapper}>
                            <Building size={18} color={Colors.textMuted} variant="Bold" />
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Depósito Central, Minha Loja..."
                                placeholderTextColor={Colors.textMuted}
                                value={depositName}
                                onChangeText={setDepositName}
                                autoCapitalize="words"
                                autoFocus
                            />
                        </View>
                    </View>

                    {/* Sugestões */}
                    <View style={styles.suggestions}>
                        {['Depósito Central', 'Minha Loja', 'Estoque Principal'].map((s) => (
                            <TouchableOpacity
                                key={s}
                                style={styles.suggestionPill}
                                onPress={() => setDepositName(s)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.suggestionText}>{s}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.createBtn, isLoading && styles.btnDisabled]}
                        onPress={handleCreate}
                        activeOpacity={0.9}
                        disabled={isLoading}
                    >
                        <Text style={styles.createBtnText}>
                            {isLoading ? 'Criando...' : 'Criar estoque'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Info plano */}
                <View style={styles.planInfo}>
                    <Text style={styles.planText}>
                        🎉 Você está no plano{' '}
                        <Text style={styles.planBold}>Gratuito</Text>
                        {' '}· 50 produtos · Armazenamento local
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    inner: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        gap: 32,
    },
    iconArea: {
        alignItems: 'center',
    },
    iconBox: {
        width: 88,
        height: 88,
        borderRadius: 28,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textArea: {
        gap: 8,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textSecondary,
        lineHeight: 20,
    },
    form: {
        gap: 16,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 13,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: Colors.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    input: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textPrimary,
    },
    suggestions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    suggestionPill: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    suggestionText: {
        fontSize: 13,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
    },
    createBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 40,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 4,
    },
    btnDisabled: {
        opacity: 0.6,
    },
    createBtnText: {
        fontSize: 15,
        fontFamily: 'Satoshi_Bold',
        color: '#fff',
    },
    planInfo: {
        backgroundColor: Colors.successLight,
        borderRadius: 14,
        padding: 14,
        alignItems: 'center',
    },
    planText: {
        fontSize: 13,
        fontFamily: 'Satoshi_Regular',
        color: Colors.success,
        textAlign: 'center',
    },
    planBold: {
        fontFamily: 'Satoshi_Bold',
    },
});