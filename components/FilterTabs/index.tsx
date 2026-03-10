import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFonts } from "@expo-google-fonts/poppins";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type FilterOption<T extends string> = {
    label: string; // Texto exibido na aba
    value: T;      // Valor único que identifica a aba
};

type FilterTabsProps<T extends string> = {
    options: FilterOption<T>[]; // Lista de abas disponíveis
    value: T;                   // Aba atualmente ativa
    onChange: (value: T) => void; // Callback ao trocar de aba
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function FilterTabs<T extends string>({
    options,
    value,
    onChange,
}: FilterTabsProps<T>) {
    return (
        // ScrollView horizontal para suportar muitas abas sem quebrar layout
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {options.map((option) => {
                const isActive = option.value === value;

                return (
                    <TouchableOpacity
                        key={option.value}
                        style={[styles.tab, isActive && styles.tabActive]}
                        onPress={() => onChange(option.value)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.label, isActive && styles.labelActive]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 2,
        justifyContent: "space-between"
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        alignItems: "center",
        flex: 1
    },
    tabActive: {
        backgroundColor: "#F1F1F4",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        flex: 1
    },
    label: {
        fontSize: 12,
        fontFamily: "Poppins_500Medium",
        color: "#727272",
    },
    labelActive: {
        fontFamily: "Poppins_600SemiBold",
        color: "#292D32",
    },
});