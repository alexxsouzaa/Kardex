import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert, KeyboardAvoidingView, Platform, ScrollView,
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Componente ──────────────────────────────────────────────────────────────

export default function RegisterPage() {
    const router   = useRouter();
    const { signUp } = useAuth();

    const [fullName,  setFullName]  = useState('');
    const [email,     setEmail]     = useState('');
    const [password,  setPassword]  = useState('');
    const [confirm,   setConfirm]   = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!fullName.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        if (password !== confirm) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setIsLoading(true);
        const { error } = await signUp(email.trim(), password, fullName.trim());
        setIsLoading(false);

        if (error) {
            Alert.alert('Erro ao criar conta', error);
            return;
        }

        // Após cadastro, vai para onboarding criar a empresa
        router.replace('/(auth)/onboarding');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.inner}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Criar conta</Text>
                        <Text style={styles.subtitle}>
                            Comece gratuitamente, sem cartão de crédito
                        </Text>
                    </View>

                    {/* Formulário */}
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nome completo</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Seu nome"
                                placeholderTextColor={Colors.textMuted}
                                value={fullName}
                                onChangeText={setFullName}
                                autoCapitalize="words"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="seu@email.com"
                                placeholderTextColor={Colors.textMuted}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Senha</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Mínimo 6 caracteres"
                                placeholderTextColor={Colors.textMuted}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirmar senha</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Repita a senha"
                                placeholderTextColor={Colors.textMuted}
                                value={confirm}
                                onChangeText={setConfirm}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.registerBtn, isLoading && styles.btnDisabled]}
                            onPress={handleRegister}
                            activeOpacity={0.9}
                            disabled={isLoading}
                        >
                            <Text style={styles.registerBtnText}>
                                {isLoading ? 'Criando conta...' : 'Criar conta grátis'}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.terms}>
                            Ao criar uma conta, você concorda com nossos{' '}
                            <Text style={styles.termsLink}>Termos de Uso</Text>
                            {' '}e{' '}
                            <Text style={styles.termsLink}>Política de Privacidade</Text>
                        </Text>
                    </View>

                    {/* Login */}
                    <View style={styles.loginRow}>
                        <Text style={styles.loginText}>Já tem uma conta? </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.loginLink}>Entrar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    inner: {
        padding: 24,
        gap: 32,
        flexGrow: 1,
        justifyContent: 'center',
    },
    header: {
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
    },
    form: {
        gap: 16,
    },
    inputGroup: {
        gap: 6,
    },
    label: {
        fontSize: 13,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
    },
    input: {
        backgroundColor: Colors.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textPrimary,
    },
    registerBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 40,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 4,
    },
    btnDisabled: {
        opacity: 0.6,
    },
    registerBtnText: {
        fontSize: 15,
        fontFamily: 'Satoshi_Bold',
        color: '#fff',
    },
    terms: {
        fontSize: 12,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textMuted,
        textAlign: 'center',
        lineHeight: 18,
    },
    termsLink: {
        color: Colors.primary,
        fontFamily: 'Satoshi_Medium',
    },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textSecondary,
    },
    loginLink: {
        fontSize: 14,
        fontFamily: 'Satoshi_Bold',
        color: Colors.primary,
    },
});