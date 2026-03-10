import { StyleSheet, Text, View, Pressable } from "react-native";
import IconButton from "../IconButton";
import { ArrowRight2 } from "iconsax-react-native";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type StockItem = {
    id: string;
    name: string;       // Nome do produto
    eanCode: string;    // Código EAN / código de barras
    quantity: number;   // Quantidade em estoque
    value: number;      // Valor unitário
    unit: string;       // Unidade de medida (ex: "Quilos", "Unidades")
};

type StockModuleProps = {
    data: StockItem;
    onPress?: () => void;
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function StockModule({ data, onPress }: StockModuleProps) {
    // Formata o valor para moeda BRL (ex: R$ 125,99)
    const formattedValue = data.value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                pressed && styles.containerPressed, // feedback visual ao pressionar
            ]}
            onPress={onPress}
        >
            {/* Imagem / ícone do produto */}
            <View style={styles.imageContainer} />

            {/* Informações principais */}
            <View style={styles.infoContainer}>
                <View style={styles.infoTop}>
                    <Text style={styles.title}numberOfLines={1}>{data.name}</Text>
                    <Text style={styles.eanCode}>Item: {data.eanCode}</Text>
                    <Text style={styles.value}>{formattedValue}</Text>
                </View>

                {/* Quantidade + unidade de medida */}
                <Text style={styles.quantity}>
                    {data.quantity} {data.unit}
                </Text>
            </View>

            {/* Botão de navegação */}
            <View style={styles.actionContainer}>
                <IconButton
                    icon={ArrowRight2}
                    variant="Linear"
                    backgroundColor="#fff"
                    iconColor="#292D32"
                    size={16}
                />
            </View>
        </Pressable>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 22,
        padding: 8,
        gap: 12,
    },

    // Reduz levemente a opacidade ao pressionar
    containerPressed: {
        opacity: 0.75,
    },

    // Placeholder para imagem ou ícone do produto
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 74,
        aspectRatio: 1,
        borderRadius: 16,
        backgroundColor: '#EBECEF',
    },

    // Ocupa o espaço restante entre imagem e botão
    infoContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 2,
    },

    // Agrupa nome, código EAN e valor
    infoTop: {
        gap: 2,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },

    // Botão de seta à direita
    actionContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: '#292D32',
    },

    eanCode: {
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
        color: '#727272',
    },

    quantity: {
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
        paddingTop: 6,
        color: '#727272',
    },

    value: {
        fontSize: 12,
        fontFamily: 'Poppins_600SemiBold',
        color: '#FF4F18',
    },
});
