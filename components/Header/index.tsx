import { useApp } from "@/context/AppContext";
import { Colors } from "@/constants/colors";
import { Notification } from "iconsax-react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconButton from "../IconButton";

type HeaderProps = {
    onNotificationPress?: () => void;
};

export default function Header({ onNotificationPress }: HeaderProps) {
    const { user, company } = useApp();

    const initials = user?.fullName
        ?.split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() ?? '?';

    const firstName = user?.fullName?.split(' ')[0] ?? 'bem-vindo';

    return (
        <View style={styles.container}>
            <View style={styles.userContainer}>

                {/* Avatar */}
                {user?.avatarUrl ? (
                    <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarFallback}>
                        <Text style={styles.avatarInitials}>{initials}</Text>
                    </View>
                )}

                {/* Texto */}
                <View style={styles.textContainer}>
                    <Text style={styles.subtitle}>
                        {company?.name ?? 'Meu estoque'}
                    </Text>
                    <Text style={styles.title} numberOfLines={1}>
                        Olá, {firstName}!
                    </Text>
                </View>
            </View>

            {/* Notificação */}
            <IconButton
                icon={Notification}
                variant="Linear"
                backgroundColor={Colors.surface}
                iconColor={Colors.textSecondary}
                size={18}
                onPress={onNotificationPress}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        width: '100%',
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
    },
    avatarFallback: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    avatarInitials: {
        fontSize: 15,
        fontFamily: 'Satoshi_Bold',
        color: Colors.primary,
    },
    textContainer: {
        flex: 1,
        gap: 1,
    },
    subtitle: {
        fontSize: 12,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textSecondary,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
    },
});