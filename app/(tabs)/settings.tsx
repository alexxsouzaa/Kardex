import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import {
    ArrowRight2, Crown, Global, Information,
    Logout, MessageQuestion, Moon, Notification,
    Personalcard, SecuritySafe, ShieldTick, User
} from "iconsax-react-native";
import {
    Alert, Image, ScrollView, StyleSheet,
    Text, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type SettingItem = {
    id:       string;
    label:    string;
    icon:     any;
    color:    string;
    bg:       string;
    onPress:  () => void;
    value?:   string;
    danger?:  boolean;
};

type SettingGroup = {
    title: string;
    items: SettingItem[];
};

// ─── Sub-componentes ─────────────────────────────────────────────────────────

const SettingRow = ({ item }: { item: SettingItem }) => {
    const Icon = item.icon;
    return (
        <TouchableOpacity
            style={styles.settingRow}
            onPress={item.onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.settingIcon, { backgroundColor: item.bg }]}>
                <Icon size={18} color={item.color} variant="Bold" />
            </View>
            <Text style={[styles.settingLabel, item.danger && styles.settingLabelDanger]}>
                {item.label}
            </Text>
            <View style={styles.settingRight}>
                {item.value && (
                    <Text style={styles.settingValue}>{item.value}</Text>
                )}
                <ArrowRight2 size={16} color={Colors.textMuted} variant="Linear" />
            </View>
        </TouchableOpacity>
    );
};

const SettingGroupCard = ({ group }: { group: SettingGroup }) => (
    <View style={styles.group}>
        <Text style={styles.groupTitle}>{group.title}</Text>
        <View style={styles.groupCard}>
            {group.items.map((item, index) => (
                <View key={item.id}>
                    <SettingRow item={item} />
                    {index < group.items.length - 1 && (
                        <View style={styles.rowDivider} />
                    )}
                </View>
            ))}
        </View>
    </View>
);

// ─── Componente ──────────────────────────────────────────────────────────────

export default function OptionsPage() {
    const router       = useRouter();
    const { signOut, user, role, plan } = useApp();

    const roleLabel: Record<string, string> = {
        admin:    'Administrador',
        manager:  'Gerente',
        operator: 'Operador',
        viewer:   'Visitante',
    };

    const groups: SettingGroup[] = [
        {
            title: 'Conta',
            items: [
                {
                    id:      'profile',
                    label:   'Meu perfil',
                    icon:    User,
                    color:   Colors.textSecondary,
                    bg:      Colors.background,
                    onPress: () => {},
                },
                {
                    id:      'security',
                    label:   'Segurança',
                    icon:    SecuritySafe,
                    color:   Colors.textSecondary,
                    bg:      Colors.background,
                    onPress: () => {},
                },
                {
                    id:      'notifications',
                    label:   'Notificações',
                    icon:    Notification,
                    color:   Colors.textSecondary,
                    bg:      Colors.background,
                    onPress: () => {},
                },
            ],
        },
        {
            title: 'Preferências',
            items: [
                {
                    id:      'theme',
                    label:   'Tema',
                    icon:    Moon,
                    color:   Colors.textSecondary,
                    bg:      Colors.background,
                    value:   'Claro',
                    onPress: () => {},
                },
                {
                    id:      'language',
                    label:   'Idioma',
                    icon:    Global,
                    color:   Colors.textSecondary,
                    bg:      Colors.background,
                    value:   'Português',
                    onPress: () => {},
                },
            ],
        },
        {
            title: 'Suporte',
            items: [
                {
                    id:      'support',
                    label:   'Suporte',
                    icon:    MessageQuestion,
                    color:   Colors.textSecondary,
                    bg:      Colors.background,
                    onPress: () => {},
                },
                {
                    id:      'about',
                    label:   'Sobre o app',
                    icon:    Information,
                    color:   Colors.textSecondary,
                    bg:      Colors.background,
                    value:   `v${Constants.expoConfig?.version ?? '1.0.0'}`,
                    onPress: () => {},
                },
                {
                    id:      'terms',
                    label:   'Termos e privacidade',
                    icon:    ShieldTick,
                    color:   Colors.textSecondary,
                    bg:      Colors.background,
                    onPress: () => {},
                },
            ],
        },
        {
            title: 'Sessão',
            items: [
                {
                    id:     'logout',
                    label:  'Sair da conta',
                    icon:   Logout,
                    color:  Colors.danger,
                    bg:     Colors.dangerLight,
                    danger: true,
                    onPress: () => {
                        Alert.alert(
                            'Sair da conta',
                            'Tem certeza que deseja sair?',
                            [
                                { text: 'Cancelar', style: 'cancel' },
                                {
                                    text:  'Sair',
                                    style: 'destructive',
                                    onPress: async () => {
                                        await signOut();
                                        router.replace('/');
                                    },
                                },
                            ]
                        );
                    },
                },
            ],
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* ── Header ── */}
                <Text style={styles.pageTitle}>Opções</Text>

                {/* ── Card Pro — só aparece no plano free ── */}
                {plan === 'free' && (
                    <TouchableOpacity style={styles.proCard} activeOpacity={0.9}>
                        <View style={styles.proLeft}>
                            <View style={styles.proIconBox}>
                                <Crown size={20} color="#F59E0B" variant="Bold" />
                            </View>
                            <View style={styles.proInfo}>
                                <Text style={styles.proTitle}>Upgrade para Pro</Text>
                                <Text style={styles.proSub}>
                                    Relatórios avançados, sync em nuvem e muito mais
                                </Text>
                            </View>
                        </View>
                        <ArrowRight2 size={18} color="#fff" variant="Linear" />
                    </TouchableOpacity>
                )}

                {/* ── Perfil com dados reais ── */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        {user?.avatarUrl ? (
                            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarFallback}>
                                <Text style={styles.avatarInitials}>
                                    {user?.fullName
                                        ?.split(' ')
                                        .map(n => n[0])
                                        .slice(0, 2)
                                        .join('') ?? '?'}
                                </Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>
                            {user?.fullName ?? 'Usuário'}
                        </Text>
                        <Text style={styles.profileRole}>
                            {roleLabel[role ?? ''] ?? 'Membro'}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.editProfileBtn} activeOpacity={0.8}>
                        <Personalcard size={16} color={Colors.primary} variant="Bold" />
                        <Text style={styles.editProfileText}>Editar</Text>
                    </TouchableOpacity>
                </View>

                {/* ── Grupos ── */}
                {groups.map((group, index) => (
                    <SettingGroupCard key={index} group={group} />
                ))}

                <Text style={styles.version}>
                    Kardex v{Constants.expoConfig?.version ?? '1.0.0'} · Feito com ♥
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 16,
        gap: 16,
        paddingBottom: 80,
    },
    pageTitle: {
        fontSize: 24,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    proCard: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    proLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    proIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    proInfo: {
        flex: 1,
        gap: 2,
    },
    proTitle: {
        fontSize: 15,
        fontFamily: 'Satoshi_Bold',
        color: '#fff',
    },
    proSub: {
        fontSize: 11,
        fontFamily: 'Satoshi_Regular',
        color: 'rgba(255,255,255,0.8)',
    },
    profileCard: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarContainer: {},
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    avatarFallback: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        fontSize: 20,
        fontFamily: 'Satoshi_Bold',
        color: Colors.primary,
    },
    profileInfo: {
        flex: 1,
        gap: 2,
    },
    profileName: {
        fontSize: 16,
        fontFamily: 'Satoshi_Bold',
        color: Colors.textPrimary,
    },
    profileRole: {
        fontSize: 12,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textSecondary,
    },
    editProfileBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    editProfileText: {
        fontSize: 12,
        fontFamily: 'Satoshi_Bold',
        color: Colors.primary,
    },
    group: {
        gap: 8,
    },
    groupTitle: {
        fontSize: 12,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textMuted,
        marginLeft: 4,
    },
    groupCard: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        gap: 12,
    },
    settingIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingLabel: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Satoshi_Medium',
        color: Colors.textPrimary,
    },
    settingLabelDanger: {
        color: Colors.danger,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    settingValue: {
        fontSize: 12,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textMuted,
    },
    rowDivider: {
        height: 1,
        backgroundColor: Colors.divider,
        marginLeft: 62,
    },
    version: {
        textAlign: 'center',
        fontSize: 11,
        fontFamily: 'Satoshi_Regular',
        color: Colors.textMuted,
        marginTop: 8,
    },
});