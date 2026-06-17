import { Colors } from "@/constants/colors";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type FormFieldProps = TextInputProps & {
    label:        string;
    required?:    boolean;
    hint?:        string;
    error?:       string;
    prefix?:      string;
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function FormField({
    label,
    required = false,
    hint,
    error,
    prefix,
    ...rest
}: FormFieldProps) {
    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <Text style={styles.label}>
                    {label}
                    {required && <Text style={styles.required}> *</Text>}
                </Text>
                {hint && <Text style={styles.hint}>{hint}</Text>}
            </View>

            <View style={[styles.inputWrapper, error ? styles.inputWrapperError : null]}>
                {prefix && <Text style={styles.prefix}>{prefix}</Text>}
                <TextInput
                    style={styles.input}
                    placeholderTextColor={Colors.textMuted}
                    {...rest}
                />
            </View>

            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        gap: 6,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 13,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textSecondary,
    },
    required: {
        color: Colors.danger,
    },
    hint: {
        fontSize: 11,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textMuted,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: 14,
        minHeight: 44,
    },
    inputWrapperError: {
        borderColor: Colors.danger,
    },
    prefix: {
        fontSize: 14,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textSecondary,
        marginRight: 4,
    },
    input: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textPrimary,
        paddingVertical: 12,
    },
    error: {
        fontSize: 11,
        fontFamily: 'Satoshi_Regular',
        color: Colors.danger,
        marginTop: 2,
    },
});