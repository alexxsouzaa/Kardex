import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Icon as IconType } from "iconsax-react-native";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type IconButtonProps = TouchableOpacityProps & {
    icon: IconType;           // Componente de ícone do iconsax-react-native
    iconColor?: string;       // Cor do ícone
    backgroundColor?: string; // Cor de fundo do botão
    variant?: string;         // Estilo do ícone (ex: "Bold", "Linear", "Outline")
    size?: number;            // Tamanho do ícone em px
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function IconButton({
    icon: Icon,
    iconColor = "#292D32",
    backgroundColor = "#FFFFFF",
    variant = "Bold",
    size = 24,
    onPress,
    ...rest // repassa props nativas do TouchableOpacity (disabled, testID, etc.)
}: IconButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor }]}
            onPress={onPress}
            activeOpacity={0.7} // feedback visual ao pressionar
            {...rest}
        >
            {Icon && <Icon size={size} color={iconColor} variant={variant} />}
        </TouchableOpacity>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        aspectRatio: 1,
        borderRadius: 20,
    },
});
