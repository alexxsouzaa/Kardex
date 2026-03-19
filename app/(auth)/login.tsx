import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert, KeyboardAvoidingView, Platform,
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Componente ──────────────────────────────────────────────────────────────

export default function LoginPage() {
    const router    = useRouter();
    const { signIn, signInWithGoogle } = useAuth();

    const [email,     setEmail]     = useState('');
    const [password,  setPassword]  = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Erro', 'Preencha email e senha.');
            return;
        }

        setIsLoading(true);
        const { error } = await signIn(email.trim(), password);
        setIsLoading(false);

        if (error) {
            Alert.alert('Erro ao entrar', error);
            return;
        }

        router.replace('/');
    };

    const handleGoogle = async () => {
        const { error } = await signInWithGoogle();
        if (error) Alert.alert('Erro', error);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.inner}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Logo */}
                <View style={styles.logoArea}>
                    <View style={styles.logoBox}>
                        <Text style={styles.logoText}>K</Text>
                    </View>
                    <Text style={styles.appName}>Kardex</Text>
                    <Text style={styles.tagline}>Seu estoque na palma da mão</Text>
                </View>

                {/* Formulário */}
                <View style={styles.form}>
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
                            placeholder="••••••••"
                            placeholderTextColor={Colors.textMuted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.forgotBtn}>
                        <Text style={styles.forgotText}>Esqueceu a senha?</Text>
                    </TouchableOpacity>

                    {/* Botão entrar */}
                    <TouchableOpacity
                        style={[styles.loginBtn, isLoading && styles.btnDisabled]}
                        onPress={handleLogin}
                        activeOpacity={0.9}
                        disabled={isLoading}
                    >
                        <Text style={styles.loginBtnText}>
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </Text>
                    </TouchableOpacity>

                    {/* Divisor */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>ou</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Google */}
                    <TouchableOpacity
                        style={styles.googleBtn}
                        onPress={handleGoogle}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.googleBtnText}>Continuar com Google</Text>
                    </TouchableOpacity>
                </View>

                {/* Cadastro */}
                <View style={styles.registerRow}>
                    <Text style={styles.registerText}>Não tem uma conta? </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                        <Text style={styles.registerLink}>Criar conta</Text>
                    </TouchableOpacity>
                </View>
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
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        gap: 32,
    },
    logoArea: {
        alignItems: 'center',
        gap: 8,
    },
    logoBox: {
        width: 72,
        height: 72,
        borderRadius: 22,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 36,
        fontFamily: 'Satoshi_Bold',
        color: '#fff',
    },
    appName: {
        fontSize: 28,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
    },
    tagline: {
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
    forgotBtn: {
        alignSelf: 'flex-end',
    },
    forgotText: {
        fontSize: 13,
        fontFamily: 'Satoshi_Medium',
        color: Colors.primary,
    },
    loginBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 40,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 4,
    },
    btnDisabled: {
        opacity: 0.6,
    },
    loginBtnText: {
        fontSize: 15,
        fontFamily: 'Satoshi_Bold',
        color: '#fff',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
    dividerText: {
        fontSize: 12,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textMuted,
    },
    googleBtn: {
        backgroundColor: Colors.surface,
        borderRadius: 40,
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    googleBtnText: {
        fontSize: 14,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerText: {
        fontSize: 14,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textSecondary,
    },
    registerLink: {
        fontSize: 14,
        fontFamily: 'Satoshi_Bold',
        color: Colors.primary,
    },
});